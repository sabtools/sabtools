/**
 * Step 4: Create YouTube Short video from screenshots + audio
 * Uses FFmpeg to combine screenshots into a slideshow with text overlays
 */

const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const config = require("./config");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function createVideo(tool, script, screenshots, audioPath) {
  const tempDir = config.TEMP_DIR;
  const outputDir = config.OUTPUT_DIR;
  fs.mkdirSync(outputDir, { recursive: true });

  // Step 1: Create branded frames from screenshots
  const frames = [];
  const textsPerFrame = [
    script.hook || `${tool.name} — Free Online Tool`,
    script.narration1 || tool.description,
    script.narration2 || "100% Free — No Signup Required",
    script.cta || "sabtools.in — 460+ Free Tools",
  ];

  for (let i = 0; i < Math.min(screenshots.length, 4); i++) {
    const framePath = path.join(tempDir, `frame_${i}.png`);
    await createBrandedFrame(screenshots[i], textsPerFrame[i], tool, i, framePath);
    frames.push(framePath);
  }

  // If less than 4 frames, add a CTA frame
  if (frames.length < 4) {
    const ctaPath = path.join(tempDir, "frame_cta.png");
    await createCtaFrame(tool, script, ctaPath);
    frames.push(ctaPath);
  }

  // Step 2: Create intro frame (hook)
  const introPath = path.join(tempDir, "frame_intro.png");
  await createIntroFrame(tool, script.hook, introPath);
  frames.unshift(introPath);

  // Step 3: Create outro frame (CTA)
  const outroPath = path.join(tempDir, "frame_outro.png");
  await createCtaFrame(tool, script, outroPath);
  frames.push(outroPath);

  // Step 4: Calculate duration per frame
  const totalDuration = config.VIDEO_DURATION_TARGET;
  const durationPerFrame = totalDuration / frames.length;

  // Step 5: Create a file list for FFmpeg concat
  const listPath = path.join(tempDir, "frames.txt");
  const listContent = frames
    .map((f) => `file '${f}'\nduration ${durationPerFrame}`)
    .join("\n");
  fs.writeFileSync(listPath, listContent + `\nfile '${frames[frames.length - 1]}'`);

  // Step 6: Generate video with FFmpeg
  const dateStr = new Date().toISOString().slice(0, 10);
  const videoFilename = `${tool.slug}-${dateStr}.mp4`;
  const outputPath = path.join(outputDir, videoFilename);

  return new Promise((resolve, reject) => {
    const cmd = ffmpeg()
      .input(listPath)
      .inputOptions(["-f", "concat", "-safe", "0"])
      .input(audioPath)
      .outputOptions([
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-r", String(config.VIDEO_FPS),
        "-c:a", "aac",
        "-b:a", "128k",
        "-shortest",
        "-movflags", "+faststart",
        // YouTube Shorts optimal settings
        "-vf", `scale=${config.VIDEO_WIDTH}:${config.VIDEO_HEIGHT}:force_original_aspect_ratio=decrease,pad=${config.VIDEO_WIDTH}:${config.VIDEO_HEIGHT}:(ow-iw)/2:(oh-ih)/2:color=white`,
        "-preset", "medium",
        "-crf", "23",
      ])
      .output(outputPath)
      .on("start", (cmd) => console.log("FFmpeg started..."))
      .on("progress", (p) => {
        if (p.percent) process.stdout.write(`\rEncoding: ${Math.round(p.percent)}%`);
      })
      .on("end", () => {
        console.log("\nVideo created:", outputPath);
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err.message);
        reject(err);
      });

    cmd.run();
  });
}

async function createBrandedFrame(screenshotPath, text, tool, index, outputPath) {
  const width = config.VIDEO_WIDTH;
  const height = config.VIDEO_HEIGHT;

  // Read and resize screenshot
  const screenshot = await sharp(screenshotPath)
    .resize(width - 60, height - 400, { fit: "inside", background: "#ffffff" })
    .toBuffer();

  const screenshotMeta = await sharp(screenshot).metadata();
  const ssWidth = screenshotMeta.width || width - 60;
  const ssHeight = screenshotMeta.height || height - 400;

  // Wrap text to fit
  const wrappedText = wrapText(text, 35);
  const textLines = wrappedText.split("\n");
  const textHeight = textLines.length * 42;

  // Create the frame with SVG overlay
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="white"/>
      <!-- Top bar -->
      <rect width="${width}" height="80" fill="url(#grad)"/>
      <text x="${width / 2}" y="50" text-anchor="middle" fill="white" font-size="28" font-weight="bold" font-family="Arial, sans-serif">
        ${escapeXml(tool.icon)} ${escapeXml(tool.name)}
      </text>
      <!-- Bottom text area -->
      <rect y="${height - 200 - textHeight}" width="${width}" height="${200 + textHeight}" fill="#f8fafc"/>
      <rect y="${height - 200 - textHeight}" width="${width}" height="3" fill="url(#grad)"/>
      ${textLines
        .map(
          (line, i) =>
            `<text x="${width / 2}" y="${height - 160 - textHeight + i * 42 + 40}" text-anchor="middle" fill="#1e293b" font-size="32" font-weight="600" font-family="Arial, sans-serif">${escapeXml(line)}</text>`
        )
        .join("")}
      <!-- SabTools branding -->
      <text x="${width / 2}" y="${height - 40}" text-anchor="middle" fill="#6366f1" font-size="28" font-weight="bold" font-family="Arial, sans-serif">
        sabtools.in
      </text>
      <!-- Step indicator -->
      <circle cx="${width / 2 - 30}" cy="${height - 80}" r="8" fill="${index === 0 ? '#4f46e5' : '#cbd5e1'}"/>
      <circle cx="${width / 2}" cy="${height - 80}" r="8" fill="${index === 1 ? '#4f46e5' : '#cbd5e1'}"/>
      <circle cx="${width / 2 + 30}" cy="${height - 80}" r="8" fill="${index === 2 ? '#4f46e5' : '#cbd5e1'}"/>
    </svg>
  `;

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      {
        input: screenshot,
        top: 100,
        left: Math.floor((width - ssWidth) / 2),
      },
    ])
    .png()
    .toFile(outputPath);
}

async function createIntroFrame(tool, hookText, outputPath) {
  const width = config.VIDEO_WIDTH;
  const height = config.VIDEO_HEIGHT;
  const wrappedHook = wrapText(hookText || `${tool.name} — 100% Free!`, 25);
  const hookLines = wrappedHook.split("\n");

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#6366f1;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <!-- Tool icon area -->
      <circle cx="${width / 2}" cy="${height / 2 - 200}" r="80" fill="rgba(255,255,255,0.2)"/>
      <text x="${width / 2}" y="${height / 2 - 170}" text-anchor="middle" font-size="80" font-family="Arial">${tool.icon}</text>
      <!-- Tool name -->
      <text x="${width / 2}" y="${height / 2 - 60}" text-anchor="middle" fill="white" font-size="48" font-weight="bold" font-family="Arial, sans-serif">
        ${escapeXml(tool.name)}
      </text>
      <!-- Hook text -->
      ${hookLines
        .map(
          (line, i) =>
            `<text x="${width / 2}" y="${height / 2 + 40 + i * 56}" text-anchor="middle" fill="#fef08a" font-size="44" font-weight="bold" font-family="Arial, sans-serif">${escapeXml(line)}</text>`
        )
        .join("")}
      <!-- FREE badge -->
      <rect x="${width / 2 - 100}" y="${height / 2 + 200}" width="200" height="60" rx="30" fill="#22c55e"/>
      <text x="${width / 2}" y="${height / 2 + 240}" text-anchor="middle" fill="white" font-size="32" font-weight="bold" font-family="Arial, sans-serif">
        100% FREE
      </text>
      <!-- Branding -->
      <text x="${width / 2}" y="${height - 80}" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="32" font-weight="600" font-family="Arial, sans-serif">
        sabtools.in
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

async function createCtaFrame(tool, script, outputPath) {
  const width = config.VIDEO_WIDTH;
  const height = config.VIDEO_HEIGHT;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ctabg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e1b4b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#312e81;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#ctabg)"/>
      <!-- Big CTA -->
      <text x="${width / 2}" y="${height / 2 - 200}" text-anchor="middle" fill="white" font-size="56" font-weight="bold" font-family="Arial, sans-serif">
        Try It FREE!
      </text>
      <!-- URL -->
      <rect x="${width / 2 - 250}" y="${height / 2 - 120}" width="500" height="80" rx="40" fill="#4f46e5"/>
      <text x="${width / 2}" y="${height / 2 - 68}" text-anchor="middle" fill="white" font-size="40" font-weight="bold" font-family="Arial, sans-serif">
        sabtools.in
      </text>
      <!-- Features -->
      <text x="${width / 2}" y="${height / 2 + 40}" text-anchor="middle" fill="#a5b4fc" font-size="32" font-family="Arial, sans-serif">
        460+ Free Online Tools
      </text>
      <text x="${width / 2}" y="${height / 2 + 100}" text-anchor="middle" fill="#a5b4fc" font-size="28" font-family="Arial, sans-serif">
        No Signup | No Ads | Made for India
      </text>
      <!-- Arrow -->
      <text x="${width / 2}" y="${height / 2 + 180}" text-anchor="middle" fill="#fbbf24" font-size="48" font-family="Arial, sans-serif">
        Link in Bio
      </text>
      <text x="${width / 2}" y="${height / 2 + 250}" text-anchor="middle" fill="#fbbf24" font-size="60" font-family="Arial, sans-serif">
        ↓ ↓ ↓
      </text>
      <!-- Subscribe text -->
      <rect x="${width / 2 - 180}" y="${height - 200}" width="360" height="60" rx="30" fill="#ef4444"/>
      <text x="${width / 2}" y="${height - 160}" text-anchor="middle" fill="white" font-size="28" font-weight="bold" font-family="Arial, sans-serif">
        SUBSCRIBE for more!
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

function wrapText(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length > maxChars) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = (currentLine + " " + word).trim();
    }
  }
  if (currentLine) lines.push(currentLine.trim());

  return lines.slice(0, 3).join("\n"); // Max 3 lines
}

function escapeXml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

module.exports = { createVideo };
