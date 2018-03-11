const net = require('net');
const Cipher = require('./core/cipher');
const SecureSocket = require('./core/secure-socket');
const thought2 = require('through2');
const debug = require('debug')('local');

class LSLocal extends SecureSocket {
    constructor(password, listenAddr, remoteAddr) {
        super(Cipher.createCipher(password));
        this.listenAddr = listenAddr || { host:'0.0.0.0',port:7448};
        this.remoteAddr = remoteAddr || {host:'0.0.0.0',port:'*'};
        LSLocal.instance = this;
    }
    handleConnection(localConnection) {
        let _this = LSLocal.instance;
        let host = _this.remoteAddr.host;
        let port = _this.remoteAddr.port;
        debug('Receive Connection from ' + localConnection.remoteAddress + ':' + localConnection.remotePort);
        localConnection.on('error', (err) => {
            debug(err.message);
            console.error(err.message);
            localConnection.destroy();
        });
        localConnection.on('close', () => {
            debug('Close Connection from ' + localConnection.remoteAddress + ':' + localConnection.remotePort)
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
        })
        remoteConnection.on('error', (err) => {
            debug(err.message);
            console.error(`连接到远程服务器 ${_this.remoteAddr.host} 失败`);
            remoteConnection.destroy();
            localConnection.destroy();
        });
    }
    listen(didListen) {
        let _this =this;
        let server = net.createServer(this.handleConnection);
        server.listen(this.listenAddr.port, function () {
            console.log(`The Local Server listen on ${_this.listenAddr.port}...`);
        });
        if(didListen){
            //todo:
            didListen();
        }
        server.on('error', (err) => {
            console.error(err.message);
            debug(err.message);
            server.close();
        });
    }
}


module.exports = LSLocal;