# RecoTw Exp Proxy Server

Standalone server for RecoTw Explorer

### Install 

```sh
npm install recotw-proxy
```

or head from Git

```sh
git clone https://github.com/RecoTwExplorer/recotw-proxy
typings install
npm run build
```

-- You can also use global install

### Command line 

```
recotw-server [-h] [options]
```

Options

- --host   recotw api server host [api.recotw.black]
- --ip     recotw api server ip address [157.112.147.23]
- --listen listening ip addr [127.0.0.1]
- --port   listening port or unix domain socket path [4100]
- --root   application root path [./]
- --silent not output log [false]
- --utc    log datetime as utc [fasle]

### Routing

`/api/recotw/:foo` :: `http://api.recotw.black/:foo`
`/` :: cwd or selected on `--root`
