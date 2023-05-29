const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());

let page;

async function getBrowserPage() {
  const browser = await puppeteer.launch({
    headless: true
  });
  return browser.newPage();
}

app.get("/", async (req, res) => {
    res.send("Hello World!");
});
app.post("/img", async (req, res) => {
   

  const width = req.body.width || 800;
  const height = req.body.height || 600;


  try {
    if (!page) {
      page = await getBrowserPage();
    }
    
    await page.setViewport({width, height});

    if (req.body.html && req.body.url) {
      return res.status(400).send(`url or html query must be provided, not both`);
    }

    if (req.body.html) {
      await page.setContent(req.body.html);
    } else {
      await page.goto(req.body.url);
    }

    const imgBuffer = await page.screenshot({
      fullPage: true,
    });

    res.set("Content-Type", "image/png");
    res.status(200).send(imgBuffer);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
