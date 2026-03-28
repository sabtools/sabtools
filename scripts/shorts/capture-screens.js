/**
 * Step 2: Capture tool screenshots using Puppeteer
 * Creates a sequence of screenshots showing the tool being used
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const config = require("./config");

async function captureScreens(tool, demoValues) {
  const tempDir = config.TEMP_DIR;
  fs.mkdirSync(tempDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: {
      width: config.VIDEO_WIDTH,
      height: config.VIDEO_HEIGHT,
      deviceScaleFactor: 1,
    },
  });

  const page = await browser.newPage();
  const screenshots = [];

  try {
    // Navigate to the tool page
    const toolUrl = `${config.SITE_URL}/tools/${tool.slug}`;
    await page.goto(toolUrl, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for tool to load
    await page.waitForSelector("h1", { timeout: 10000 });

    // Remove header, footer, ads, and floating elements for clean capture
    await page.evaluate(() => {
      const selectors = [
        "header", "footer", "nav",
        '[class*="AdBanner"]', '[class*="ad-"]', '[class*="Ad"]',
        '[class*="InstallPrompt"]', '[class*="SuggestTool"]',
        '[class*="AskSabTools"]', '[class*="RecentCalculations"]',
        '[class*="BackToTop"]', '[class*="KeyboardShortcuts"]',
        '[class*="ReadingProgress"]', '[class*="Breadcrumb"]',
        '[class*="EmbedCode"]', '[class*="WhatsApp"]',
        '[class*="ShareButtons"]', '[class*="FavoriteButton"]',
        '[class*="DownloadPDF"]', '[class*="ToolUsageCounter"]',
      ];
      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          el.style.display = "none";
        });
      });
      // Make tool area full width
      document.body.style.background = "#ffffff";
      document.body.style.overflow = "hidden";
    });

    // Screenshot 1: Tool page (clean, just the tool)
    const ss1 = path.join(tempDir, "screen_01_tool.png");
    await page.screenshot({ path: ss1, type: "png" });
    screenshots.push(ss1);

    // Try to fill in demo values
    if (demoValues && Object.keys(demoValues).length > 0) {
      for (const [key, value] of Object.entries(demoValues)) {
        try {
          // Try multiple selectors to find the input
          const selectors = [
            `input[name="${key}"]`,
            `input[id="${key}"]`,
            `input[placeholder*="${key}" i]`,
            `input[aria-label*="${key}" i]`,
          ];

          let found = false;
          for (const sel of selectors) {
            const input = await page.$(sel);
            if (input) {
              await input.click({ clickCount: 3 }); // Select all
              await input.type(String(value), { delay: 50 });
              found = true;
              break;
            }
          }

          if (!found) {
            // Try to find by visible label text
            const inputs = await page.$$("input[type='number'], input[type='text'], input:not([type])");
            for (const input of inputs) {
              const placeholder = await page.evaluate((el) => el.placeholder || el.name || "", input);
              if (placeholder.toLowerCase().includes(key.toLowerCase())) {
                await input.click({ clickCount: 3 });
                await input.type(String(value), { delay: 50 });
                break;
              }
            }
          }
        } catch {
          // Skip if input not found
        }
      }

      // Wait for calculations
      await new Promise((r) => setTimeout(r, 1500));

      // Screenshot 2: With values entered
      const ss2 = path.join(tempDir, "screen_02_input.png");
      await page.screenshot({ path: ss2, type: "png" });
      screenshots.push(ss2);

      // Scroll down to see results
      await page.evaluate(() => window.scrollBy(0, 400));
      await new Promise((r) => setTimeout(r, 500));

      // Screenshot 3: Results
      const ss3 = path.join(tempDir, "screen_03_result.png");
      await page.screenshot({ path: ss3, type: "png" });
      screenshots.push(ss3);

      // Scroll more for charts/tables if any
      await page.evaluate(() => window.scrollBy(0, 400));
      await new Promise((r) => setTimeout(r, 500));

      const ss4 = path.join(tempDir, "screen_04_detail.png");
      await page.screenshot({ path: ss4, type: "png" });
      screenshots.push(ss4);
    } else {
      // No demo values — just take scrolling screenshots
      for (let i = 2; i <= 4; i++) {
        await page.evaluate(() => window.scrollBy(0, 350));
        await new Promise((r) => setTimeout(r, 500));
        const ss = path.join(tempDir, `screen_0${i}_scroll.png`);
        await page.screenshot({ path: ss, type: "png" });
        screenshots.push(ss);
      }
    }
  } catch (err) {
    console.error("Screenshot error:", err.message);
  } finally {
    await browser.close();
  }

  return screenshots;
}

module.exports = { captureScreens };
