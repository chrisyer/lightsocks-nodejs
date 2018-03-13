#!/usr/bin/env node

const Server = require('../lib/server');
const program = require('commander');
const config = require('../lib/utils/config');
const password = require('../lib/core/password');
const path = require('path');
const os = require('os');
const urlParseLax = require('url-parse-lax');
require('pkginfo')(module);

function getAddr(addr) {
    let url = urlParseLax(addr);

    return {
        host:url.hostname,
        port:url.port
    }
}

function validatePassword(input) {
    if(password.validatePassword(input)){
        return input;
    }else {
        console.error('密码不合法');
        process.exit(1);
    }
}

program
    .version(module.exports.version)
    .description(module.exports.description)
    .option('-P, --password [value]', 'the password for server')
    .option('-L, --listen [value]', 'the listen address for server')
    .parse(process.argv);


console.log(`载入配置文件${path.resolve(os.homedir(),'.lightsocks.json')}`);
configObj = config.loadConfig(path.resolve(os.homedir(),'.lightsocks.json'));
if(program.password){
    if(password.validatePassword(program.password)){
        configObj.password = program.password;
    }else {
        console.error('密码不合法');
        process.exit(1);
    }
}else {
    if(!configObj.password){
        configObj.password = password.generateRandomPassword();
    }
}
if(program.listen){
    if(program.listen.split(':').length === 1){
        configObj.listen = "0.0.0.0:"+program.listen;
    }else {
        configObj.listen = program.listen;
    }

}else {
    if(!configObj.listen){
        configObj.listen = "0.0.0.0:" +  Math.floor(Math.random() * (49151-1024) + 1024);
    }
}
config.writeConfig(configObj);
console.log(`-------------------------------\n`+
    `监听地址：${configObj.listen}\n`+
    `密码：${configObj.password}\n`+
    `---------------------------\n`);
let listenAddr = getAddr(configObj.listen);
const server = new Server(configObj.password,listenAddr);

server.listen();
