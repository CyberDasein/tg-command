const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const http = require('http');
const exec = require("child_process").exec;

const tgToken = "1921609163:AAGewYXeMePiiZjBHzPLUK8GcAQ5XdYHz3Q";
const yaToken = "AQVN0qqxJrU2p3nPKI2XxgpItkLFSHyaLJ6OvM-i";

const bot = new TelegramBot(tgToken, { polling: true });


const shutDownComputer = function () {
  const shutdown = exec("shutdown.exe /h", (error, stdout, stderr) => {
    console.log(`${stdout}`);
    console.log(`${stderr}`);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });
};

// let buildHtml = (text) => {
//   var header = ' ';
//   var body = text;

//   return '<!DOCTYPE html>'
//        + '<html><head>' + header + '</head><body><p>' + body  + '</p></body></html>';
// };

bot.on("voice", (msg) => {
  const stream = bot.getFileStream(msg.voice.file_id);

  let chuncks = [];
  stream.on("data", (chunk) => chuncks.push(chunk));
  stream.on("end", () => {
    const axiosConfig = {
      methog: "POST",
      url: "https://stt.api.cloud.yandex.net/speech/v1/stt:recognize",
      headers: {
        Authorization: "Api-Key " + yaToken,
      },
      data: Buffer.concat(chuncks),
    };
    axios(axiosConfig)
      .then((response) => {
        const command = response.data.result;
        console.log(command);
        if (command == "Сон") {
          console.log("Перевожу в спячку");
          bot.sendMessage(msg.chat.id, "Выполняю");
          setTimeout(() => {
            shutDownComputer();
          }, 2000);   
        }
        // const server = http.createServer(function (req, res) {
        //   let html = buildHtml(command);
        //   res.writeHead(200, {
        //     'Content-Type': 'text/html',
        //     'Content-Length': html.length,
        //     'Expires': new Date().toUTCString()
        //   });
        //   res.end(html);
        // })
        
        // server.listen(5500, '127.0.0.1');
        
      })
      .catch((err) => {
        console.log("Ошибка ", err);
      });
  });
});


