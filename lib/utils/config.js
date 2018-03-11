const path = require('path');
const fs = require('fs');
const os =require('os');

function validate(configObj) {
    let validateField = (field)=>{
        if(!configObj.hasOwnProperty(field)
            || !configObj[field]){
            throw new Error(`Config must include ${field} field`);
        }
    };
    if (typeof(configObj) !== 'object'){
        throw new Error("Config must be a object");
    }
    validateField('password');
    validateField('listen');
    return true;
}

function loadConfig(filepath) {
    let configPath = path.resolve(filepath);
    if(!fs.existsSync(configPath)){
        console.log('未发现配置文件，正在新建配置文件...');
        return {};
    }
    configObject = JSON.parse(fs.readFileSync(filepath));
    validate(configObject);
    return configObject;
}

function weiteConfig(config) {
    let homePath = path.resolve(os.homedir(),'.lightsocks.json');
    let config_string = JSON.stringify(config,null,2);
    fs.writeFileSync(homePath,config_string);
}

exports.loadConfig = loadConfig;
exports.writeConfig = weiteConfig;