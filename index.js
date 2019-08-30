#!/usr/bin/env node

const commander = require("commander");
const mailgun = require("mailgun-js");

let cliData, config

let cli = commander
    .command("mailgun-send-mail")
    .description("A script that uses Mailgun to deliver emails.")
    .option('-c, --config <file>', 'Config file to use (absolute path)')
    .option('-p, --template <name>', 'Template to use from your Mailgun account')
    .option('-t, --to <email>', 'To email')
    .option('-s, --subject <name>', 'Mail subject')
    .option('-d, --data <dict>', 'Variables dict that will be sent to Mailgun template')
    .version('1.0.0')
    .parse(process.argv);

if (cli.data) {
    cliData = JSON.parse(cli.data)
}

if (cli.config.indexOf('/') == 0) {
   config = require(cli.config);
} else {
   config = require('./' + cli.config);
}

console.log("Config:", cli.config);
console.log("Template:", cli.template);
console.log("Subject:", cli.subject);
console.log("To:", cli.to);
console.log("Variables:", cli.data);
console.log("Variables:", cliData);

const mg = mailgun({apiKey: config.api_key, domain: config.domain});
console.log(mg)
let data = {
    from: 'CarPass Console <notify@' + config.domain + '>',
    to: cli.to,
    subject: cli.subject,
    template: cli.template,
};

for (key in cliData) {
    data['v:' + key] = cliData[key]
}
console.log(data)

mg.messages().send(data, function (error, body) {
    console.log(body);
});