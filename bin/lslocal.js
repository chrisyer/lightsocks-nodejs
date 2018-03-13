#!/usr/bin/env node

const Local = require('../lib/local');
const program = require('commander');
const config = require('../lib/utils/config');
const password = require('../lib/core/password');
const path = require('path');
const os = require('os');
const urlParseLax = require('url-parse-lax');
require('pkginfo')(module);

function getAddr(addr) {
    let url = urlParseLax(addr);
    let host = url.hostname || '0.0.0.0';
    let port = parseInt(url.port);
    return {
        host,
        port
    }
}


program
    .version(module.exports.version)
    .description(module.exports.description)
    .option('-P, --password [value]', 'the password for server')
    .option('-L, --listen [value]', 'the listen address for server')
    .option('-R, --remote [value]','the remote server address')
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
}
if(program.listen){
    if(program.listen.split(':').length === 1){
        configObj.listen = "0.0.0.0:"+program.listen;
    }else {
        configObj.listen = program.listen;
    }
}else {
    if(!configObj.listen){
        configObj.listen = '0.0.0.0:7448';
    }
}
if(program.remote){
    if(program.remote.split(':').length !== 2){
        console.error('请按照<ip_address>:port的格式定义远程地址');
        process.exit(1);
    }
    configObj.remote = program.remote;
}else{
    if(!configObj.remote){
        config.writeConfig(configObj);
        console.error('请在配置文件或命令行中定义远程服务器地址');
        process.exit(1);
    }
}
config.writeConfig(configObj);
let listenAddr = getAddr(configObj.listen);
let remoteAddr = getAddr(configObj.remote);

let client = new Local(configObj.password,listenAddr,remoteAddr);
client.listen();