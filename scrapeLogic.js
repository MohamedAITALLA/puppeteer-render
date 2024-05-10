const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (req, res) => {
  const baseUrl = "https://wallpapercave.com"
  const browser = await puppeteer.launch({
    headless:"new",
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();
    await page.goto(req.query.url);
    await page.waitForTimeout(1000);

    const wallpapers = await (await page).evaluate((baseUrl) => {
      const wallpaperPods = Array.from(document.querySelectorAll("#albumwp .wallpaper"))
      const data = wallpaperPods.map(wallpaper => ({
        image: baseUrl + wallpaper.querySelector("a picture img").getAttribute("src")
      }))

      return data
    }, baseUrl)

    res.json(wallpapers);
  } catch (e) {
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = { scrapeLogic };
