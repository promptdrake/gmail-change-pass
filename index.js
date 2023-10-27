const chalk = require('chalk');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askUserCount() {
  const text = `
  █▀▀ █▀▄▀█ ▄▀█ █ █░░   █▀▄▀█ ▄▀█ █▄░█ ▄▀█ █▀▀ █▀▀ █▀█
  █▄█ █░▀░█ █▀█ █ █▄▄   █░▀░█ █▀█ █░▀█ █▀█ █▄█ ██▄ █▀▄
  `;

  console.log(chalk.cyan.bold(text));
  console.log('Created By @aisbircubes coder');
  console.log('Follow Us');
  console.log('Telegram: https://t.me/penyukaberuang');
  console.log('Instagram: https://instagram.com/aisbircubes\n');
  rl.question('(1). Auto Change Password\n(2). Check Gmail Address\n(3). Exit\n\nWhat do you want?\n' +chalk.yellow('- '), (choice) => {
    if (choice === '1') {
      const changepassPath = path.join(__dirname, 'changepass.js');
      if (fs.existsSync(changepassPath)) {
        require(changepassPath);
      } else {
        console.log('pb.file.changepass.not.found');
      }
    } else if (choice === '2') {
      const checkerPath = path.join(__dirname, 'checkgmail.js');
      if (fs.existsSync(checkerPath)) {
        require(checkerPath);
      } else {
        console.log('pb.file.checkgmail.not.found');
      }
    } else if (choice === '3') {
     return rl.close();
    }
     else {
      console.log(chalk.red.bold("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n[Cmd] Failed Usage, please at least select option in the list\n\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n"));
      setTimeout(() => {
      askUserCount();
    }, 1000);
    }
  });
}

askUserCount();
