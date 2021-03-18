const rp = require('request-promise');
const puppeteer = require('puppeteer');
const pptr = require('puppeteer-core');
var HTMLParser = require('node-html-parser');

require('dotenv').config()

const url_test = 'https://www.bestbuy.ca/en-ca/product/apple-apple-lightning-to-3-5mm-headphone-jack-adapter-mmx62am-a/10487473';
const url_3070 = 'https://www.bestbuy.ca/en-ca/product/nvidia-geforce-rtx-3070-8gb-gddr6-video-card-only-at-best-buy/15078017';
const url_cart = 'https://www.bestbuy.ca/en-ca/basket'
const url_paypal = "https://www.bestbuy.ca/checkout/?qit=1#/en-ca/shipping/ON/M2N?expressPaypalCheckout=true"

chromeOptions = {
  headless: false,
  executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  browserWSEndpoint: process.env.WS_ENDPOINT,
  defaultViewport: null,
}

var checkInterval = setInterval(checkStatus, 3000)

function checkStatus () {
  clearInterval(checkInterval)
  rp(url_test).then((html) => {
    var root = HTMLParser.parse(html)
    const availability_text = root.querySelector(".shippingAvailability_2RMa1").textContent
    if (availability_text != "Coming soon") {
      openBrowser()
    }
  })
}


async function openBrowser () {
  const browser = await pptr.connect(chromeOptions);
  const page = await browser.newPage();
  await page.goto(url_test);
  const cookies = await page.cookies()
  await page.waitForSelector("#test > button")
  await page.click("#test > button")
  // await page.keyboard.type('\n'); 
  await page.goto(url_cart);
  await page.goto("https://www.bestbuy.ca/checkout/?qit=1#/en-ca/shipping/ON/M2N?expressPaypalCheckout=true")
  page.waitForNavigation({ waitUntil: 'networkidle0' })
  await page.click("#payment-submit-btn")

  // await page.waitForSelector("#root > div > div.x-page-content.container_3Sp8P > div.loader_3thnw > div.loadedContent_2Wp84 > section > div > section > section.cost-sum-section_3pPEp > div.checkoutOptions_1VB1L > div:nth-child(1) > div > div > a")
  // await page.click("#root > div > div.x-page-content.container_3Sp8P > div.loader_3thnw > div.loadedContent_2Wp84 > section > div > section > section.cost-sum-section_3pPEp > div.checkoutOptions_1VB1L > div:nth-child(1) > div > div > a")
  // await page.waitForSelector('#payment-submit-btn')
  // await page.click('#payment-submit-btn')
  // await page.focus("#root > div > div.x-page-content.container_3Sp8P > div.loader_3thnw > div.loadedContent_2Wp84 > section > div > section > section.cost-sum-section_3pPEp > div:nth-child(3) > div > a")
  

  // await page.waitForSelector("#test > button")
  // await page.click("#test > button")
}
