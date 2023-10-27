const puppeteer = require('puppeteer-extra');
const axios = require('axios');
const chalk = require('chalk');
const config = require('./config');
const userAgents = require('user-agents');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const rl = readline.createInterface({
  input: fs.createReadStream('email.txt'),
  output: process.stdout
});
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const userAgentsList = Array.from({ length: 10 }, () => new userAgents());
  puppeteer.use(StealthPlugin());
  async function createSpotifyAccount(email) {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        `--user-agent=${userAgentsList[Math.floor(Math.random() * userAgentsList.length)].toString()}`,
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'/*,
        `--load-extension=${path.resolve(__dirname, 'captcha')}`*/ // Replace with the actual path to your CRX file
      ],
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en'
    });
    const userAgent = await page.evaluate(() => {
      return navigator.userAgent;
    });
    
    console.log(chalk.green(userAgent)); 
    console.log('[Server] Opening Browser...');
    await page.goto('https://accounts.google.com/ServiceLogin?service=accountsettings&hl=en-US&continue=https://myaccount.google.com/intro/security', { waitUntil: 'domcontentloaded' });
    console.log('[Server] Visiting Google Change pass');
  
    await page.waitForSelector('input[type="email"]');
    await page.$eval('input[type="email"]', (input) => input.focus());
    await page.type('input[type="email"]', email); // auto fill from email.txt
    console.log(chalk.green('[Server] Inputing Email Address\n> ' + email))
    await page.waitForTimeout(2000);
    await page.waitForSelector('button[data-idom-class="nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b"]');
await page.click('button[data-idom-class="nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b"]');
await page.waitForTimeout(3900);
if (page.url().includes('https://accounts.google.com/signin/v2/challenge')) {
  await page.waitForTimeout(3500);
  const now = new Date();
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
  await page.screenshot({ path: `otp/${email}_${currentDate}_otp.jpg` });
  console.log(chalk.red(`${email} Have number verification so bot skipping this mail only and saved the screenshot to ${email}_${currentDate}_otp.jpg`));
  removeCurrentEmailFromList(email);
  function removeCurrentEmailFromList(email) {
    const emailList = fs.readFileSync('email.txt', 'utf-8').split('\n');
    const filteredEmailList = emailList.filter((line) => line.trim() !== email);
  
    fs.writeFileSync('email.txt', filteredEmailList.join('\n'));
  }
}
else {
  await page.waitForTimeout(200);
await page.waitForSelector('input[type="password"]');
await page.type('input[type="password"]', config.default_password);
console.log(chalk.green('[Server] Inputing Password For\n> ' + email))
await page.waitForTimeout(1000);
await page.waitForSelector('button[data-idom-class="nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b"]');
await page.click('button[data-idom-class="nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b"]');
await page.waitForTimeout(2000);
if (page.url().includes('https://accounts.google.com/signin/v2/challenge')) {
  const now = new Date();
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
  await page.screenshot({ path: `otp/${email}_${currentDate}_otp.jpg` });
  console.log(chalk.red(`${email} Have number verification so bot skipping this mail only and saved the screenshot to ${email}_${currentDate}_otp.jpg`));
}
else {
await page.waitForTimeout(4000);
console.log(chalk.blue('[Server] ') + `Gmail ` + email + ' Seems doesn\'t getting banned, trying another');
}
}
await browser.close()
  }
  async function processEmails() {
    const emails = [];
  
    rl.on('line', (line) => {
      if (line.trim() !== '') {
        emails.push(line.trim());
      }
    });
  
    rl.on('close', async () => {
      if (emails.length === 0) {
        console.log(chalk.blue('No data Found'));
      } else {
        for (const email of emails) {
          console.log(`\n[Server] Checking email: ${email}`);
          await createSpotifyAccount(email);
        }
      }
    });
  }
  
  async function askUserCount() {
    console.log(chalk.green.bold("[Server] Starting Auto Check Gmail"));
    console.log(chalk.green.bold("[Server] Reading email.txt"));
    processEmails();
  }
  
  askUserCount();