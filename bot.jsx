const rp = require('request-promise');
const puppeteer = require('puppeteer');
const pptr = require('puppeteer-core');
var HTMLParser = require('node-html-parser');
var nodemailer = require('nodemailer');
var nodeoutlook = require('nodejs-nodemailer-outlook')

require('dotenv').config()
var checkInterval = setInterval(checkStatus, 3000)


const url_test = 'https://www.bestbuy.ca/en-ca/product/apple-apple-lightning-to-3-5mm-headphone-jack-adapter-mmx62am-a/10487473';
const url_3070 = 'https://www.bestbuy.ca/en-ca/product/nvidia-geforce-rtx-3070-8gb-gddr6-video-card-only-at-best-buy/15078017';
const url_cart = 'https://www.bestbuy.ca/en-ca/basket'
const url_paypal = "https://www.bestbuy.ca/checkout/?qit=1#/en-ca/shipping/ON/M2N?expressPaypalCheckout=true"

chromeOptions = {
  headless: false,
  executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  browserWSEndpoint: process.env.WS_ENDPOINT,
  defaultViewport: null
}

var transporter = nodemailer.createTransport({
  // host: "smtp-mail.outlook.com", // hostname
  // secureConnection: false, // TLS requires secureConnection to be false
  // port: 587, // port for secure SMTP
  // tls: {
  //    ciphers:'SSLv3'
  // },
  host: 'smtp-mail.outlook.com',
  port: 587,
  secureConnection: false,
  tls: {
     ciphers:'SSLv3'
  }
});




var mailOptions = {
  from: process.env.USERNAME,
  to: process.env.USERNAME,
  subject: '3070 is in stock',
  text: url_test
};


console.log(process.env.USERNAME)

function checkStatus () {
  clearInterval(checkInterval)
  rp(url_test).then((html) => {
    var root = HTMLParser.parse(html)
    const availability_text = root.querySelector(".shippingAvailability_2RMa1").textContent
    if (availability_text != "Coming soon") {
      sendEmail()
      //openBrowser()
      
    }
  })
}


async function openBrowser () {
  const browser = await pptr.connect(chromeOptions);
  const page = await browser.newPage();
  await page.goto(url_test);
  var cookies = await page.cookies()

  for (const cookie of cookies) {
    if (cookie.domain === '.bestbuy.ca' || cookie.domain === 'www.bestbuy.ca') {
      await page.deleteCookie({
        name : cookie.name,
        domain : cookie.domain,
    })
    }
  }



  // await page.waitForSelector("#test > button")
  // await page.click("#test > button")
  // await page.waitForTimeout(1000)
  // await page.keyboard.type('\n'); 
  // await page.goto(url_cart);
  // await page.goto("https://www.bestbuy.ca/checkout/?qit=1#/en-ca/shipping/ON/M2N?expressPaypalCheckout=true")
  // await page.waitForSelector('#payment-submit-btn', { visible: true, timeout: 0 })
  // await page.click("#payment-submit-btn")

  // await page.waitForSelector("#root > div > div.x-page-content.container_3Sp8P > div.loader_3thnw > div.loadedContent_2Wp84 > section > div > section > section.cost-sum-section_3pPEp > div.checkoutOptions_1VB1L > div:nth-child(1) > div > div > a")
  // await page.click("#root > div > div.x-page-content.container_3Sp8P > div.loader_3thnw > div.loadedContent_2Wp84 > section > div > section > section.cost-sum-section_3pPEp > div.checkoutOptions_1VB1L > div:nth-child(1) > div > div > a")
  // await page.waitForSelector('#payment-submit-btn')
  // await page.click('#payment-submit-btn')
  // await page.focus("#root > div > div.x-page-content.container_3Sp8P > div.loader_3thnw > div.loadedContent_2Wp84 > section > div > section > section.cost-sum-section_3pPEp > div:nth-child(3) > div > a")
  

  // await page.waitForSelector("#test > button")
  // await page.click("#test > button")
}

const sendEmail = async () => {
  let info = await transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  // nodeoutlook.sendEmail({
  //   auth: {
  //       user: process.env.USERNAME,
  //       pass: process.env.PASSWORD
  //   },
  //   from: process.env.USERNAME,
  //   to: process.env.USERNAME,
  //   subject: '3070 is here',
  //   text: 'This is text version!',
  //   onError: (e) => console.log(e),
  //   onSuccess: (i) => console.log(i)
  // })
} 


async function clearBrowser (page) {
  // clear cookies
  // const client = await page.target().createCDPSession()		
  // await await client.send('Network.clearBrowserCookies')
  console.log(page)
}
