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
await page.waitForTimeout(2000);
if (page.url().includes('https://accounts.google.com/signin/v2/challenge')) {
  await page.waitForTimeout(3000);
  const now = new Date();
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
  await page.screenshot({ path: `${email}_${currentDate}_otp.jpg` });
  console.log(chalk.red(`${email} Have number verification so bot skipping this mail only and saved the screenshot to ${email}_${currentDate}_otp.jpg`));
}
else {
await page.waitForSelector('input[type="password"]');
await page.waitForTimeout(1000);
await page.type('input[type="password"]', config.default_password);
console.log(chalk.green('[Server] Inputing Password For\n> ' + email))
await page.waitForTimeout(2000);
await page.waitForSelector('button[data-idom-class="nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b"]');
await page.click('button[data-idom-class="nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b"]');
await page.waitForTimeout(2000);
if (page.url().includes('https://accounts.google.com/signin/v2/challenge')) {
  const now = new Date();
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
  await page.screenshot({ path: `${email}_${currentDate}_otp.jpg` });
  console.log(chalk.red(`${email} Have number verification so bot skipping this mail only and saved the screenshot to ${email}_${currentDate}_otp.jpg`));
}
else {
await page.waitForTimeout(4000);
await page.waitForSelector('a[data-rid="401"]');
await page.click('a[data-rid="401"]');
await page.waitForTimeout(2000);
await page.waitForSelector('input[name="password"]');
await page.$eval('input[name="password"]', (input) => input.focus());
await page.type('input[name="password"]', config.new_password);
await page.waitForTimeout(2000);
await page.waitForSelector('input[name="confirmation_password"]');
await page.$eval('input[name="confirmation_password"]', (input) => input.focus());
await page.type('input[name="confirmation_password"]', config.new_password);
console.log(chalk.green('[Server] Password Updated'))
console.log(chalk.green('[Server] ' + config.default_password + ' to ' +config.new_password + '\n> ' + email))
await page.waitForTimeout(2000);
await page.keyboard.press('Enter');
await page.waitForTimeout(4000);
console.log(chalk.blue('[Server] ') + `Queued Email From ` + email + ' Succsesfully');
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
          console.log(`\n[Server] Processing email: ${email}`);
          await createSpotifyAccount(email);
        }
      }
    });
  }
  
  async function askUserCount() {
    const text = `
    ▒█▀▀█ █▀▄▀█ █▀▀█ ░▀░ █░░ 　 ░█▀▀█ █░░█ ▀▀█▀▀ █▀▀█ 　 ▒█▀▀█ █░░█ █▀▀█ █▀▀▄ █▀▀▀ █▀▀ 
    ▒█░▄▄ █░▀░█ █▄▄█ ▀█▀ █░░ 　 ▒█▄▄█ █░░█ ░░█░░ █░░█ 　 ▒█░░░ █▀▀█ █▄▄█ █░░█ █░▀█ █▀▀ 
    ▒█▄▄█ ▀░░░▀ ▀░░▀ ▀▀▀ ▀▀▀ 　 ▒█░▒█ ░▀▀▀ ░░▀░░ ▀▀▀▀ 　 ▒█▄▄█ ▀░░▀ ▀░░▀ ▀░░▀ ▀▀▀▀ ▀▀▀ 
    
    ▒█▀▀█ █▀▀█ █▀▀ █▀▀ █░░░█ █▀▀█ █▀▀█ █▀▀▄ 
    ▒█▄▄█ █▄▄█ ▀▀█ ▀▀█ █▄█▄█ █░░█ █▄▄▀ █░░█ 
    ▒█░░░ ▀░░▀ ▀▀▀ ▀▀▀ ░▀░▀░ ▀▀▀▀ ▀░▀▀ ▀▀▀░
      `;
    
    console.log(chalk.green.bold(text));
    console.log('Created By @aisbircubes coder');
    console.log('Follow Us');
    console.log('Telegram: https://t.me/penyukaberuang');
    console.log('Instagram: https://instagram.com/aisbircubes\n');
  console.log(chalk.red('==============\n[Server] Reading From: emails.txt Queued Has been started\n=============='))
    processEmails();
  }
  
  askUserCount();
