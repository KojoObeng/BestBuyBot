const rp = require('request-promise');
const puppeteer = require('puppeteer');
const pptr = require('puppeteer-core');
var HTMLParser = require('node-html-parser');
var nodemailer = require('nodemailer');
var nodeoutlook = require('nodejs-nodemailer-outlook')
var http = require('http');
var https = require('https');

require('dotenv').config()
http.globalAgent.maxSockets = 1;
https.globalAgent.maxSockets = 1;

const url_test = 'https://www.bestbuy.ca/en-ca/product/apple-apple-lightning-to-3-5mm-headphone-jack-adapter-mmx62am-a/10487473';

const url_PS5 = 'https://www.bestbuy.ca/en-ca/product/playstation-5-digital-edition-console-online-only/14962184';
const url_3060_ASUS_ROG = 'https://www.bestbuy.ca/en-ca/product/asus-rog-strix-geforce-rtx-3060-oc-12gb-gddr6x-video-card/15309514';
const url_3060_ASUS_TUF = 'https://www.bestbuy.ca/en-ca/product/asus-tuf-gaming-geforce-rtx-3060-oc-12gb-gddr6x-video-card/15309513';
const url_3060_EVGA = 'https://www.bestbuy.ca/en-ca/product/evga-nvidia-geforce-rtx-3060-xc-12gb-dddr6-video-card/15318940';
const url_3060_MSI = 'https://www.bestbuy.ca/en-ca/product/msi-nvidia-geforce-rtx-3060-ventus-3x-12gb-gddr6-video-card/15324508';
const url_3060_ZOTAC = 'https://www.bestbuy.ca/en-ca/product/zotac-nvidia-geforce-rtx-3060-twin-edge-12gb-gddr6-video-card/15309504';
const url_3060TI_NVIDIA = 'https://www.bestbuy.ca/en-ca/product/nvidia-geforce-rtx-3060-ti-8gb-gddr6-video-card/15166285'
const url_3070_ASUS_TUF = 'https://www.bestbuy.ca/en-ca/product/asus-tuf-gaming-nvidia-geforce-rtx-3070-2x-oc-8gb-gddr6-video-card/15053087';
const url_3070_EVGA = 'https://www.bestbuy.ca/en-ca/product/evga-geforce-rtx-3070-xc3-ultra-8gb-gddr6-video-card/15147122';
const url_3070_MSI = 'https://www.bestbuy.ca/en-ca/product/msi-nvidia-geforce-rtx-3070-ventus-3x-oc-8gb-gddr6-video-card/15038016';
const url_3070_NVIDIA = 'https://www.bestbuy.ca/en-ca/product/nvidia-geforce-rtx-3070-8gb-gddr6-video-card-only-at-best-buy/15078017';
const url_3070_ZOTAC = 'https://www.bestbuy.ca/en-ca/product/zotac-nvidia-geforce-rtx-3070-twin-edge-8gb-gddr6x-video-card/15000079';
const url_3070_ZOTAC_OC = 'https://www.bestbuy.ca/en-ca/product/zotac-nvidia-geforce-rtx-3070-twin-edge-oc-8gb-gddr6x-video-card/15000078';
const url_3080_ASUS_ROG = 'https://www.bestbuy.ca/en-ca/product/asus-rog-strix-nvidia-geforce-rtx-3080-10gb-gddr6x-video-card/14954116';
const url_3080_ASUS_TUF = 'https://www.bestbuy.ca/en-ca/product/asus-tuf-gaming-nvidia-geforce-rtx-3080-10gb-gddr6x-video-card/14953248';
const url_3080_EVGA = 'https://www.bestbuy.ca/en-ca/product/evga-geforce-rtx-3080-xc3-ultra-gaming-10gb-gddr6x-video-card/15084753';
const url_3080_MSI = 'https://www.bestbuy.ca/en-ca/product/msi-nvidia-geforce-rtx-3080-ventus-3x-10gb-gddr6x-video-card/14950588';
const url_3080_ZOTAC = 'https://www.bestbuy.ca/en-ca/product/zotac-nvidia-geforce-rtx-3080-trinity-10gb-gddr6x-video-card/14953249';
const url_3080_ZOTAC_OC = 'https://www.bestbuy.ca/en-ca/product/zotac-nvidia-geforce-rtx-3080-trinity-oc-10gb-gddr6x-video-card/15000077';

const url_cart = 'https://www.bestbuy.ca/en-ca/basket'
const url_paypal = "https://www.bestbuy.ca/checkout/?qit=1#/en-ca/shipping/ON/M2N?expressPaypalCheckout=true"


const names =  {
  '14962184': 'Digital PS5',
  '15309514': '3060 ASUS ROG',
  '15309513': '3060 ASUS TUF',
  '15318940': '3060 EVGA', 
  '15324508': '3060 MSI', 
  '15309504': '3060 ZOTAC', 
  '15166285': '3060TI NVIDIA',
  '15053087': '3070 ASUS TUF',
  '15147122': '3070 EVGA', 
  '15038016': '3070 MSI', 
  '15078017': '3070 NVIDIA',
  '15000079': '3070 ZOTAC',
  '15000078': '3070 ZOTAC OC',
  '14954116': '3080 ASUS ROG',
  '14953248': '3080 ASUS TUF',
  '15084753': '3080 EVGA', 
  '14950588': '3080 MSI', 
  '14953249': '3080 ZOTAC',
  '15000077': '3080 ZOTAC OC',
  '10487473': 'TEST ITEM'
}





var chromeOptions = {
  headless: false,
  executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  browserWSEndpoint: process.env.WS_ENDPOINT,
  defaultViewport: null
}

var transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secureConnection: false,
  tls: {
     ciphers:'SSLv3'
  }, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});


var mailOptions = {
  from: process.env.EMAIL,
  to: process.env.EMAIL,
  subject: 'GPU is in stock',
  text: url_test
};

function intervalManager(flag, link, time=3000) {
  var interval_id = link + "-interval"

  if (flag) global[interval_id] = setInterval(() => {checkStatus(link)}, time)
  else {
    clearInterval(global[interval_id])
  }
}

async function checkStatus (curr_url) {

  intervalManager(false, curr_url)

  var searchOptions = {
    uri: curr_url,
    headers: {
      'Connection': 'keep-alive',
      'Accept-Encoding': '',
      'Accept-Language': 'en-US,en;q=0.8'
    }
  }

  await rp(searchOptions)
  .then((html) => {
    var root = HTMLParser.parse(html)
    var availability_text = root.querySelector(".shippingAvailability_2RMa1").textContent
    var gpu_type = names[curr_url.split("/")[6]]
    console.log(gpu_type +  '  -------   ' + availability_text)
    if (availability_text != "Coming soon" && availability_text != "Sold out online")   {
      sendEmail(curr_url)
      openBrowser(curr_url)
    }
    else {
      intervalManager(true, curr_url, 3000)
    }
  })
  .catch((error) => {
    console.log(error)
  })
}


async function openBrowser (curr_url) {
  const browser = await pptr.connect(chromeOptions);
  const page = await browser.newPage();
  await page.goto(curr_url);
  var cookies = await page.cookies()

  for (cookie of cookies) {
    if (cookie.domain === '.bestbuy.ca' || cookie.domain === 'www.bestbuy.ca') {
      await page.deleteCookie({
        name : cookie.name,
        domain : cookie.domain,
      })
    }
  }

  await page.focus("#test > button")
  await page.keyboard.type('\n');
  await page.waitForTimeout(5000)
  await page.goto(url_cart);
  // const response = await page.goto("https://www.bestbuy.ca/checkout/?qit=1#/en-ca/shipping/ON/M2N?expressPaypalCheckout=true");
  const reponse = await page.goto("https://www.bestbuy.ca/identity/global/signin?redirectUrl=https%3A%2F%2Fwww.bestbuy.ca%2Fcheckout%2F%3Fqit%3D1%23%2Fen-ca%2Fshipping%2FON%2FL6W&amp;lang=en-CA&amp;contextId=checkout")
  await page.type('#username', process.env.EMAIL)
  await page.type('#password', process.env.BESTBUY_PASSWORD)
  const form = await page.$('#signIn > div > button')
  await form.evaluate( form => form.click() )
  await page.waitForSelector("#cvv")
  await page.type('#cvv', process.env.CVV)

 // Paypal
  // await page.click('#signIn > div > button')
  // const response = await page.goto("https://www.bestbuy.ca/checkout/?qit=1#/en-ca/payment")
  // await page.waitForSelector('#payment-submit-btn', { visible: true, timeout: 0 })
  // await page.click("#payment-submit-btn")
   // page.waitForNavigation({
    //   waitUntil: 'networkidle0'
  // await page.waitForSelector("#root > div > div.x-page-content.container_3Sp8P > div.loader_3thnw > div.loadedContent_2Wp84 > section > div > section > section.cost-sum-section_3pPEp > div.checkoutOptions_1VB1L > div:nth-child(1) > div > div > a")
  // await page.click("#root > div > div.x-page-content.container_3Sp8P > div.loader_3thnw > div.loadedContent_2Wp84 > section > div > section > section.cost-sum-section_3pPEp > div.checkoutOptions_1VB1L > div:nth-child(1) > div > div > a")
  // await page.waitForSelector('#payment-submit-btn')
  // await page.click('#payment-submit-btn')
  // await page.focus("#root > div > div.x-page-content.container_3Sp8P > div.loader_3thnw > div.loadedContent_2Wp84 > section > div > section > section.cost-sum-section_3pPEp > div:nth-child(3) > div > a")
  // await page.waitForSelector("#test > button")
  // await page.click("#test > button")
}

const sendEmail = async (curr_url) => {

  mailOptions.subject = names[curr_url.split("/")[6]] + " IS HERE."
  mailOptions.text = curr_url; 
  let info = await transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
} 

intervalManager(true, url_3060_ASUS_ROG, 3000)
intervalManager(true, url_3060_ASUS_TUF, 3000)
intervalManager(true, url_3060_EVGA, 3000)
intervalManager(true, url_3060_MSI, 3000)
intervalManager(true, url_3060_ZOTAC, 3000)
intervalManager(true, url_3060TI_NVIDIA, 3000)
intervalManager(true, url_3070_ASUS_TUF, 3000)
intervalManager(true, url_3070_EVGA, 3000)
intervalManager(true, url_3070_NVIDIA, 3000)
intervalManager(true, url_3070_MSI, 3000)
intervalManager(true, url_3070_ZOTAC, 3000)
intervalManager(true, url_3070_ZOTAC_OC, 3000)
intervalManager(true, url_3080_ASUS_ROG, 3000)
intervalManager(true, url_3080_ASUS_TUF, 3000)
intervalManager(true, url_3080_EVGA, 3000)
intervalManager(true, url_3080_MSI, 3000)
intervalManager(true, url_3080_ZOTAC, 3000)
intervalManager(true, url_3080_ZOTAC_OC, 3000)
intervalManager(true, url_PS5, 3000)
intervalManager(true, url_test, 3000)
