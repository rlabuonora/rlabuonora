import { spawn } from "node:child_process";
import { createServer } from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import net from "node:net";
import process from "node:process";
import { chromium } from "playwright";

const rootDir = process.cwd();
const defaultPort = Number(process.env.DESIGN_REVIEW_PORT || "4210");
const explicitBaseUrl = process.env.DESIGN_REVIEW_BASE_URL || "";
const outputRoot = path.join(rootDir, "artifacts", "design-review");
const reuseServer = process.argv.includes("--reuse-server");
const includeDetailPages = process.argv.includes("--include-detail-pages");
const topLevelPages = [
  { id: "home", path: "/", label: "Homepage" },
  { id: "posts-index", path: "/posts/index.html", label: "Notas index" },
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

async function findAvailablePort(startPort, host = "127.0.0.1", attempts = 20) {
  for (let candidate = startPort; candidate < startPort + attempts; candidate += 1) {
    const open = await isPortOpen(host, candidate);
    if (!open) {
      return candidate;
    }
  }
  throw new Error(`No free port found starting from ${startPort}`);
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

function runQuartoRender() {
  const child = spawn("quarto", ["render"], {
    cwd: rootDir,
    stdio: "pipe",
    env: { ...process.env, QUARTO_PRINT_STACK: "true" }
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[quarto] ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[quarto] ${chunk}`);
  });

  return new Promise((resolve, reject) => {
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`quarto render exited with code ${code}`));
      }
    });
    child.on("error", reject);
  });
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html": return "text/html; charset=utf-8";
    case ".css": return "text/css; charset=utf-8";
    case ".js": return "application/javascript; charset=utf-8";
    case ".json": return "application/json; charset=utf-8";
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".svg": return "image/svg+xml";
    case ".ico": return "image/x-icon";
    case ".woff": return "font/woff";
    case ".woff2": return "font/woff2";
    default: return "application/octet-stream";
  }
}

async function startStaticServer({ port, root }) {
  const server = createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || "/", `http://127.0.0.1:${port}`);
      const pathname = decodeURIComponent(requestUrl.pathname);
      const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
      let filePath = path.join(root, relativePath);
      let stats;

      try {
        stats = await fs.stat(filePath);
      } catch {
        stats = null;
      }

      if (stats?.isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }

      const data = await fs.readFile(filePath);
      res.writeHead(200, { "Content-Type": getContentType(filePath) });
      res.end(data);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });

  return server;
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
  const host = "127.0.0.1";
  const activePort = explicitBaseUrl
    ? new URL(explicitBaseUrl).port
    : reuseServer
      ? defaultPort
      : await findAvailablePort(defaultPort, host);
  const baseUrl = explicitBaseUrl || `http://${host}:${activePort}`;
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

  const serverAlreadyRunning = explicitBaseUrl
    ? true
    : await isPortOpen(host, Number(activePort));
  const shouldReuseServer = reuseServer || Boolean(explicitBaseUrl);
  let server;
  let browser;

  try {
    if (!shouldReuseServer) {
      await runQuartoRender();
      server = await startStaticServer({
        port: Number(activePort),
        root: path.join(rootDir, "_site")
      });
    }

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

    if (serverAlreadyRunning && shouldReuseServer) {
      console.log(`Reused existing server at ${baseUrl}`);
    }
    console.log(`Saved screenshots to ${path.relative(rootDir, runDir)}`);
    console.log(`Updated latest screenshots in ${path.relative(rootDir, latestDir)}`);
    console.log(`Review prompt: ${path.relative(rootDir, path.join(latestDir, "review-prompt.md"))}`);
  } finally {
    if (browser) {
      await browser.close();
    }
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
