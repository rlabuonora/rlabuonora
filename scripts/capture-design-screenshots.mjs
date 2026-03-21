import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import net from "node:net";
import process from "node:process";
import { chromium } from "playwright";

const rootDir = process.cwd();
const port = process.env.DESIGN_REVIEW_PORT || "4210";
const baseUrl = process.env.DESIGN_REVIEW_BASE_URL || `http://127.0.0.1:${port}`;
const outputRoot = path.join(rootDir, "artifacts", "design-review");
const reuseServer = process.argv.includes("--reuse-server");
const includeDetailPages = process.argv.includes("--include-detail-pages");
const topLevelPages = [
  { id: "home", path: "/", label: "Homepage" },
  { id: "posts-index", path: "/posts/index.html", label: "Posts index" },
  { id: "projects-index", path: "/proyectos/index.html", label: "Projects index" },
  { id: "courses-index", path: "/cursos/index.html", label: "Courses index" }
];
const detailPages = [
  { id: "project", path: "/proyectos/data-forge-toolkit.html", label: "Project page" },
  { id: "article", path: "/posts/designing-a-personal-site.html", label: "Article page" }
];
const pages = includeDetailPages
  ? [...topLevelPages, ...detailPages]
  : topLevelPages;

const viewports = [
  {
    id: "desktop",
    label: "Desktop",
    contextOptions: {
      viewport: { width: 1440, height: 1200 },
      colorScheme: "light"
    }
  },
  {
    id: "mobile",
    label: "Mobile",
    contextOptions: {
      viewport: { width: 393, height: 852 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 3,
      colorScheme: "light"
    }
  }
];

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isPortOpen(host, targetPort) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port: Number(targetPort) });
    socket.once("connect", () => {
      socket.end();
      resolve(true);
    });
    socket.once("error", () => {
      resolve(false);
    });
  });
}

async function ensureCleanDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.ok || response.status === 302 || response.status === 404) {
        return;
      }
    } catch {}
    await sleep(500);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function startQuartoPreview() {
  const child = spawn(
    "quarto",
    ["preview", "--no-browser", "--port", port],
    {
      cwd: rootDir,
      stdio: "pipe",
      env: { ...process.env, QUARTO_PRINT_STACK: "true" }
    }
  );

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[quarto] ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[quarto] ${chunk}`);
  });

  return child;
}

async function writeReviewInstructions(manifest, latestDir) {
  const desktopHome = path.join(latestDir, "desktop", "home.png");
  const mobileHome = path.join(latestDir, "mobile", "home.png");
  const reviewPromptPath = path.join(latestDir, "review-prompt.md");

  const imageArgs = manifest.shots
    .map((shot) => `-i ${shot.absolutePath}`)
    .join(" \\\n  ");

  const prompt = `# Design Review Loop

Latest capture: \`${manifest.runId}\`
Base URL: \`${manifest.baseUrl}\`

## Suggested Codex command

\`\`\`bash
codex \\
  ${imageArgs} \\
  "Review these Quarto screenshots for layout, spacing, typography, hierarchy, and responsive issues. Prioritize concrete CSS/markup improvements for this repo. Reference the screenshots by page and viewport."
\`\`\`

## Suggested interactive workflow

1. Run \`npm run design:capture\` after layout/style changes.
2. Attach the new screenshots above to Codex and ask for a focused design review.
3. Use Playwright MCP during the review loop to inspect the live page structure and test specific changes in desktop or mobile.
4. Re-run \`npm run design:capture\` and compare the new \`latest\` screenshots with the previous timestamped run.

To include detail pages later, run \`node scripts/capture-design-screenshots.mjs --include-detail-pages\`.

## Quick check files

- [desktop home](${desktopHome})
- [mobile home](${mobileHome})
`;

  await fs.writeFile(reviewPromptPath, prompt, "utf8");
}

async function main() {
  const runId = timestamp();
  const runDir = path.join(outputRoot, runId);
  const latestDir = path.join(outputRoot, "latest");
  const manifest = {
    runId,
    baseUrl,
    generatedAt: new Date().toISOString(),
    pages,
    viewports: viewports.map(({ id, label }) => ({ id, label })),
    shots: []
  };

  await fs.mkdir(outputRoot, { recursive: true });

  const serverAlreadyRunning = await isPortOpen("127.0.0.1", port);
  const shouldReuseServer = reuseServer || serverAlreadyRunning;
  const preview = shouldReuseServer ? null : startQuartoPreview();
  let browser;

  try {
    await waitForServer(baseUrl);
    await ensureCleanDir(runDir);

    browser = await chromium.launch({ headless: true });

    for (const viewport of viewports) {
      const viewportDir = path.join(runDir, viewport.id);
      await fs.mkdir(viewportDir, { recursive: true });

      const context = await browser.newContext(viewport.contextOptions);
      const page = await context.newPage();

      for (const target of pages) {
        const url = new URL(target.path, baseUrl).toString();
        const outputPath = path.join(viewportDir, `${target.id}.png`);
        await page.goto(url, { waitUntil: "networkidle" });
        await page.screenshot({ path: outputPath, fullPage: true });
        manifest.shots.push({
          page: target.id,
          viewport: viewport.id,
          url,
          path: path.relative(rootDir, outputPath),
          absolutePath: outputPath
        });
      }

      await context.close();
    }

    await ensureCleanDir(latestDir);
    await fs.cp(runDir, latestDir, { recursive: true });
    await fs.writeFile(
      path.join(runDir, "manifest.json"),
      JSON.stringify(manifest, null, 2),
      "utf8"
    );
    await fs.writeFile(
      path.join(latestDir, "manifest.json"),
      JSON.stringify(manifest, null, 2),
      "utf8"
    );

    await writeReviewInstructions(manifest, latestDir);

    if (serverAlreadyRunning && !reuseServer) {
      console.log(`Reused existing preview server at ${baseUrl}`);
    }
    console.log(`Saved screenshots to ${path.relative(rootDir, runDir)}`);
    console.log(`Updated latest screenshots in ${path.relative(rootDir, latestDir)}`);
    console.log(`Review prompt: ${path.relative(rootDir, path.join(latestDir, "review-prompt.md"))}`);
  } finally {
    if (browser) {
      await browser.close();
    }
    if (preview) {
      preview.kill("SIGTERM");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
