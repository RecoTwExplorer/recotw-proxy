///<reference path="../typings/main.d.ts"/>
import {argv} from "yargs";
import {server} from "./server";
import {IncomingMessage,ServerResponse} from "http";
require("colors");

if (argv.h || argv.help) {
  console.log( `RecoTw Explorer Server
    recotw-server [-h] [options]
      Options:
        --host   recotw api server host
        --ip     recotw api server ip address
        --listen listening ip addr
        --port   listening port or unix domain socket path
        --root   application root path
        --silent not output log
        --utc    log datetime as utc
    ` );
  process.exit();
}

let logger: server.Logger;
const utc: boolean = !!argv.utc;

if (!argv.silent) {

  logger = {
    info: console.log,
    request (req: IncomingMessage, res: ServerResponse, error?: Error) {
      var date = utc ? new Date().toUTCString() : new Date();
      if (error) {
        logger.info(
          //'[%s] "%s %s" Error (%s): "%s"',
          '[%s] "%s %s" Error: "%s"',
          date, req.method.red, req.url.red,
          /*error.status.toString().red,*/ error.message.red
        );
      }
      else {
        logger.info(
          '[%s] "%s %s" "%s"',
          date, req.method.cyan, req.url.cyan,
          req.headers[ 'user-agent' ]
        );
      }
    }
  };

} else {
  logger = {
    info(){
    },
    request(){
    },
  };
}


const host: string = typeof argv.host === 'string' ? argv.host : 'api.recotw.black';
const remoteAddr: string = typeof argv.ip === 'string' ? argv.ip : '157.112.147.23';
const listenAddr: string = typeof argv.listen === 'string' ? argv.listen : '127.0.0.1';
const port: number|string = typeof argv.port === 'number' || typeof argv.port === 'string' ? argv.port : 4100;
const root: string = typeof argv.root === 'string' ? argv.root : './';
(new server.server( {host, remoteAddr, listenAddr, port, root, logger} )).setupMiddleware().createServer();
