///<reference path="../typings/main.d.ts"/>
import * as http from 'http';
import * as connect from 'connect';
import * as url from 'url'

const serveStatic = require( 'serve-static' );
const proxy = require( 'proxy-middleware' );


export module server {

  export interface Option {
    host:string;
    remoteAddr:string;
    listenAddr:string;
    port:number|string;
    root:string;
    logger:Logger
  }

  interface ProxyOption extends url.Url {
    headers?: any;
    route?: string;
    via? : boolean|string
    cookieRewrite?: boolean|string
    preserveHost?: boolean
  }

  export interface Logger {
    info:(message?: any, ...optionalParams: any[])=>void;
    request:(req: http.IncomingMessage, res: http.ServerResponse, error?: Error)=>void;
  }

  export class server {

    listen: http.Server;
    option: Option;
    app: connect.Server;

    constructor(option: Option) {
      this.option = option;
      this.app = connect();

    }


    public setupMiddleware(): server {
      const proxyOptions: ProxyOption = url.parse( 'http://' + this.option.remoteAddr );
      proxyOptions.preserveHost = true;
      proxyOptions.headers = {host: this.option.host};
      this.app.use((req:http.IncomingMessage,res:http.ServerResponse,next:Function)=>{
        this.option.logger.request(req,res);
        next();
      } );

      this.app.use( '/api/recotw', proxy( proxyOptions ) );
      this.app.use( serveStatic( this.option.root ) );
      return this;
    }

    public createServer(): http.Server {
      this.listen = http.createServer( this.app );
      const port = this.option.port;
      if (typeof port === 'string') {
        this.listen.listen( port );
        this.option.logger.info( 'Listening on ' + port );
      } else {
        this.listen.listen( port, this.option.listenAddr );
        this.option.logger.info( `Listening on ${this.option.listenAddr}:${port}` );
      }
      return this.listen;
    }


  }
}