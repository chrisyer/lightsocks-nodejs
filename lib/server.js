const net = require('net');
const dns = require('dns');
const throught2 = require('through2');
const debug = require('debug')('server');
const SecureSocket = require('./core/secure-socket');
const Cipher = require('./core/cipher');


class LSServer extends SecureSocket {
    constructor(password,listenAddr = {
        host:'0.0.0.0',
        port:7488
    }) {
        super(Cipher.createCipher(password));
        this.listenAddr = listenAddr;
        LSServer.instance = this;
    }

    trimAddress(addr) {
        return addr.trim()
            .replace(/\u0000|\u0001|\u0002|\u0003|\u0004|\u0005|\u0006|\u0007|\u0008|\u0009|\u000a|\u000b|\u000c|\u000d|\u000e|\u000f|\u0010|\u0011|\u0012|\u0013|\u0014|\u0015|\u0016|\u0017|\u0018|\u0019|\u001a|\u001b|\u001c|\u001d|\u001e|\u001f/g, "");
    }

    handleConnection(localConnection){
        let _this = LSServer.instance;
        localConnection.on('error',(err)=>{
            console.error(err.message);
            debug(err.message);
            localConnection.destroy();
        });
        debug('Receive Connection:' + localConnection.remoteAddress + ':' + localConnection.remotePort);
        console.log('接受连接:'+ localConnection.remoteAddress + ':' + localConnection.remotePort);
        _this.socketRead(localConnection)
            .then((chunk) => {
                let buf = [...chunk];
                if (!buf && buf[0] !== 0x05) {
                    localConnection.destroy();
                    return;
                }
                _this.socketWrite(localConnection, Buffer.from([0x05, 0x00]))
                    .then(() => {
                        _this.socketRead(localConnection)
                            .then((chunk) => {
                                buf = [...chunk];
                                if (buf.length < 7) {
                                    localConnection.destroy();
                                    return;
                                }
                                if (buf[1] !== 0x01) {
                                    localConnection.destroy();
                                    // 目前只支持 CONNECT
                                    return;
                                }
                                let remote = _this.trimAddress(Buffer.from(buf.slice(4, buf.length - 2)).toString());
                                dns.lookup(remote, function (err, ip) {
                                    if (!ip || err) {
                                        debug(err.message);
                                        localConnection.destroy();
                                        return;
                                    }
                                    let port = parseInt("0x" + Buffer.from(buf.slice(buf.length - 2)).toString('hex'));
                                    debug('Create Connection to ' + remote + ":" + port);
                                    let remoteConnection = net.createConnection(port, ip, function () {
                                        _this.socketWrite(localConnection, Buffer.from([0x05, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]))
                                            .then(() => {
                                                remoteConnection.pipe(throught2(function (chunk, enc, callback) {
                                                    chunk = _this.encodeBuffer(chunk);
                                                    callback(null, chunk);
                                                })).pipe(localConnection);
                                                localConnection.pipe(throught2(function (chunk, enc, callback) {
                                                    chunk = _this.decodeBuffer(chunk);
                                                    callback(null, chunk);
                                                })).pipe(remoteConnection);
                                            });
                                    });
                                    remoteConnection.on('error', function (err) {
                                        debug(err.message);
                                        console.error(err.message);
                                        remoteConnection.destroy();
                                        localConnection.destroy();
                                        return;
                                    })
                                });
                            });
                    });
            });
    }
    //todo: deal didListen
    listen(didListen) {
        let _this = this;
        let server = net.createServer(this.handleConnection);
        server.on('error',function (err) {
            console.error(err.message);
            debug(err.message);
            server.close();
        });
        server.listen(this.listenAddr.port, () => {
            console.log(`The Server listening on ${_this.listenAddr.port}`)
        })
    }

}

module.exports = LSServer;