import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import os from "node:os";

const rootDir = process.cwd();
const latestDir = path.join(rootDir, "artifacts", "design-review", "latest");
const manifestPath = path.join(latestDir, "manifest.json");
const reviewPromptPath = path.join(rootDir, "prompts", "design-review.txt");
const applyPromptPath = path.join(rootDir, "prompts", "design-apply.txt");
const savedReviewPath = path.join(latestDir, "review.md");
const compiledReviewPromptPath = path.join(latestDir, "codex-review-input.md");
const compiledApplyPromptPath = path.join(latestDir, "codex-apply-input.md");

function usage() {
  console.log(`Design workflow

Usage:
  node scripts/design-workflow.mjs capture
  node scripts/design-workflow.mjs review [--exec]
  node scripts/design-workflow.mjs apply [--prepare]
  node scripts/design-workflow.mjs status

Commands:
  capture   Run the existing screenshot capture workflow
  review    Open Codex with the latest screenshots and the design review prompt
            Use --exec to save the result to artifacts/design-review/latest/review.md
            When already inside Codex, this writes the compiled prompt and exits cleanly
  apply     Open Codex with prompts/design-apply.txt plus the saved review findings
            Use --prepare to only write the compiled prompt and exit cleanly
            When already inside Codex, this behaves like --prepare
  status    Show the latest screenshot and review artifact paths
`);
}

function isInteractiveCodexSession() {
  return Boolean(process.env.CODEX_THREAD_ID);
}

async function resolveExecutable(command) {
  const explicit = process.env.CODEX_BIN;
  if (explicit) {
    try {
      await fs.access(explicit);
      return explicit;
    } catch {
      throw new Error(`CODEX_BIN is set but not executable at: ${explicit}`);
    }
  }

  return new Promise((resolve, reject) => {
    const child = spawn(process.env.SHELL || "/bin/zsh", ["-lc", `command -v ${command}`], {
      cwd: rootDir,
      stdio: ["ignore", "pipe", "ignore"],
      env: process.env
    });

    let stdout = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.on("exit", (code) => {
      const resolved = stdout.trim();
      if (code === 0 && resolved) {
        resolve(resolved);
      } else {
        const home = os.homedir();
        const fallbackCandidates = [
          path.join(home, ".vscode", "extensions", "openai.chatgpt-26.318.11754-darwin-arm64", "bin", "macos-aarch64", command),
          path.join(home, ".vscode", "extensions", "openai.chatgpt-26.317.0-darwin-arm64", "bin", "macos-aarch64", command)
        ];

        Promise.any(
          fallbackCandidates.map(async (candidate) => {
            await fs.access(candidate);
            return candidate;
          })
        )
          .then(resolve)
          .catch(() => reject(new Error(`Could not find \`${command}\` in shell PATH. Set CODEX_BIN to the full path of the codex executable.`)));
      }
    });
    child.on("error", reject);
  });
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: options.stdio ?? "inherit",
      env: process.env
    });

    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
    child.on("error", reject);
  });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readLatestManifest() {
  if (!(await fileExists(manifestPath))) {
    throw new Error("No latest design-review manifest found. Run `make design-capture` first.");
  }
  return JSON.parse(await fs.readFile(manifestPath, "utf8"));
}

async function latestImages() {
  const manifest = await readLatestManifest();
  return manifest.shots
    .map((shot) => shot.absolutePath || path.join(rootDir, shot.path))
    .sort((a, b) => a.localeCompare(b));
}

async function compileReviewPrompt() {
  const basePrompt = await fs.readFile(reviewPromptPath, "utf8");
  const manifest = await readLatestManifest();
  const summary = [
    "Use the attached screenshots from the latest local capture.",
    `Capture id: ${manifest.runId}`,
    "Review only what is visible in these images."
  ].join("\n");
  const prompt = `${basePrompt.trim()}\n\n${summary}\n`;
  await fs.writeFile(compiledReviewPromptPath, prompt, "utf8");
  return prompt;
}

async function compileApplyPrompt() {
  if (!(await fileExists(savedReviewPath))) {
    throw new Error("No saved review found at artifacts/design-review/latest/review.md. Run `make design-review-save` first or create that file manually.");
  }

  const applyPrompt = await fs.readFile(applyPromptPath, "utf8");
  const review = await fs.readFile(savedReviewPath, "utf8");
  const prompt = `${applyPrompt.trim()}\n\nReview findings:\n\n${review.trim()}\n`;
  await fs.writeFile(compiledApplyPromptPath, prompt, "utf8");
  return prompt;
}

async function launchInteractive(prompt, images) {
  const codexPath = await resolveExecutable("codex");
  const args = ["-C", rootDir];
  for (const image of images) {
    args.push("-i", image);
  }
  args.push(prompt);
  await run(codexPath, args);
}

async function launchExec(prompt, images, outputFile) {
  const codexPath = await resolveExecutable("codex");
  const args = ["exec", "-C", rootDir, "-s", "read-only", "-o", outputFile];
  for (const image of images) {
    args.push("-i", image);
  }
  args.push("-");

  await new Promise((resolve, reject) => {
    const child = spawn(codexPath, args, {
      cwd: rootDir,
      stdio: ["pipe", "inherit", "inherit"],
      env: process.env
    });

    child.stdin.write(prompt);
    child.stdin.end();

    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`codex exec exited with code ${code}`));
    });
    child.on("error", reject);
  });
}

function printInlineHandoff({ command, promptPath, images, extra }) {
  console.log(`Detected an active Codex session. Skipping nested interactive launch for \`${command}\`.`);
  console.log(`Compiled prompt: ${path.relative(rootDir, promptPath)}`);
  if (extra) {
    console.log(extra);
  }
  console.log("Attached images for this stage:");
  for (const image of images) {
    console.log(`- ${path.relative(rootDir, image)}`);
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const execMode = rest.includes("--exec");
  const prepareMode = rest.includes("--prepare");

  switch (command) {
    case "capture":
      await run("node", ["scripts/capture-design-screenshots.mjs"]);
      break;

    case "review": {
      const images = await latestImages();
      const prompt = await compileReviewPrompt();
      if (execMode) {
        await launchExec(prompt, images, savedReviewPath);
        console.log(`Saved review to ${path.relative(rootDir, savedReviewPath)}`);
      } else if (isInteractiveCodexSession()) {
        printInlineHandoff({
          command: "review",
          promptPath: compiledReviewPromptPath,
          images,
          extra: `Run \`node scripts/design-workflow.mjs review --exec\` from a regular shell if you want the review written automatically to ${path.relative(rootDir, savedReviewPath)}.`
        });
      } else {
        await launchInteractive(prompt, images);
      }
      break;
    }

    case "apply": {
      const images = await latestImages();
      const prompt = await compileApplyPrompt();
      if (prepareMode || isInteractiveCodexSession()) {
        printInlineHandoff({
          command: "apply",
          promptPath: compiledApplyPromptPath,
          images,
          extra: prepareMode
            ? "Prepared the apply handoff without launching Codex. Use the compiled prompt and latest screenshots in the implementation step."
            : "Use the current Codex session to execute the changes described in the compiled apply prompt."
        });
      } else {
        await launchInteractive(prompt, images);
      }
      break;
    }

    case "status": {
      const manifest = await readLatestManifest();
      const images = await latestImages();
      console.log(`Latest capture: ${manifest.runId}`);
      console.log(`Manifest: ${path.relative(rootDir, manifestPath)}`);
      console.log(`Review prompt: ${path.relative(rootDir, compiledReviewPromptPath)}`);
      console.log(`Apply prompt: ${path.relative(rootDir, compiledApplyPromptPath)}`);
      console.log(`Saved review: ${path.relative(rootDir, savedReviewPath)}`);
      console.log("Images:");
      for (const image of images) {
        console.log(`- ${path.relative(rootDir, image)}`);
      }
      break;
    }

    default:
      usage();
      process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
