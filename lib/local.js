const net = require('net');
const Cipher = require('./core/cipher');
const SecureSocket = require('./core/secure-socket');
const thought2 = require('through2');
const log4js = require('log4js');

class LSLocal extends SecureSocket {
    constructor(password, listenAddr, remoteAddr) {
        super(Cipher.createCipher(password));
        this.listenAddr = listenAddr || { host:'0.0.0.0',port:7448};
        this.remoteAddr = remoteAddr || {host:'0.0.0.0',port:'*'};
        this.logger = log4js.getLogger('LsLocal');
        this.logger.level = process.env.NODE_ENV === 'debug' ? 'debug' : 'info';
        LSLocal.instance = this;
    }
    handleConnection(localConnection) {
        let _this = LSLocal.instance;
        let host = _this.remoteAddr.host;
        let port = _this.remoteAddr.port;
        _this.logger.info(`接受连接：${localConnection.remoteAddress}:${localConnection.remotePort}`);
        localConnection.on('error', (err) => {
            _this.logger.error(`本地连接发生错误，错误信息：${err.message}`);
            localConnection.destroy();
        });
        localConnection.on('close', () => {
            _this.logger.info(`断开连接 ${localConnection.remoteAddress}:${localConnection.remotePort}`);
        });
        let remoteConnection = net.createConnection(port, host, function () {
            localConnection.pipe(thought2(function (chunk, enc, callback) {
                chunk = _this.encodeBuffer(chunk);
                callback(null, chunk);
            })).pipe(remoteConnection);
            remoteConnection.pipe(thought2(function (chunk, enc, callback) {
                chunk = _this.decodeBuffer(chunk);
                callback(null, chunk);

            })).pipe(localConnection);
        });
        remoteConnection.on('error', () => {
            _this.logger.error(`连接到远程服务器 ${_this.remoteAddr.host} 失败`);
            remoteConnection.destroy();
            localConnection.destroy();
        });
    }
    listen(didListen) {
        let _this =this;
        let server = net.createServer(this.handleConnection);
        server.listen(this.listenAddr.port, function () {
            _this.logger.info(`本地服务器启动，监听端口：${_this.listenAddr.port}...`);
        });
        if(didListen){
            //todo:
            didListen();
        }
        server.on('error', (err) => {
            _this.logger.error(`本地服务器发生错误，错误信息：${err.message}`);
            server.close();
        });
    }
}


module.exports = LSLocal;