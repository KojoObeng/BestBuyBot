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
const url_3070 = 'https://www.bestbuy.ca/en-ca/product/nvidia-geforce-rtx-3070-8gb-gddr6-video-card-only-at-best-buy/15078017';
const url_cart = 'https://www.bestbuy.ca/en-ca/basket'
const url_paypal = "https://www.bestbuy.ca/checkout/?qit=1#/en-ca/shipping/ON/M2N?expressPaypalCheckout=true"

var checkInterval = setInterval(() => {checkStatus(url_3070)}, 5000);

chromeOptions = {
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
  subject: '3070 is in stock',
  text: url_test
};



async function checkStatus (curr_url) {
  clearInterval(checkInterval)

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
    console.log(availability_text)
    if (availability_text != "Coming soon") {
      sendEmail(curr_url)
      openBrowser(curr_url)
    }
    else {
      var checkInterval = setInterval(() => {checkStatus(url_3070)}, 3000);
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
  clearInterval(checkInterval)
  mailOptions.text = curr_url; 
  let info = await transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
} 


async function clearBrowser (page) {
  // clear cookies
  // const client = await page.target().createCDPSession()		
  // await await client.send('Network.clearBrowserCookies')
  console.log(page)
}
