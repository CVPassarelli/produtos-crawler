const puppeteer = require("puppeteer");
const fs = require("fs");

const ua =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36";
const items = "col__StyledCol-sc-1snw5v3-0 qYCYL theme-grid-col";

(async () => {
  console.log("start");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  await page.setViewport({ width: 1080, height: 1024 });
  await page.setDefaultNavigationTimeout(120000);
  page.setUserAgent(ua);

  await page.goto(
    "https://www.americanas.com.br/categoria/celulares-e-smartphones/f/memoria-interna-128GB/preco-mais+de+R%24+5.000%2C00?viewMode=list"
  );

  const options = await page.$$eval(
    "a.inStockCardList__Wrapper-sc-ap8xmn-0",
    (options) => {
      let itens = [];
      options.map((opt) => {
        itens.push(`\r\n
          ${opt.querySelector(".product-name").textContent}, ${opt
          .querySelector(".list-price")
          .textContent.replace(",", ".")}, ${opt
          .querySelector(".src__LazyImage-sc-xr9q25-0")
          .getAttribute("src")},`);

        //return item;
      });
      return itens;
    },
    "Titulo"
  );

  await fs.writeFile(
    "src/downloads/produtos.csv",
    "Nome, Preço, Imagem" + options.join(""),
    "utf8",
    (err) => {
      if (err) console.log(err);
      else console.log("Data saved");
    }
  );

  console.log("fim");

  await browser.close();
})();
