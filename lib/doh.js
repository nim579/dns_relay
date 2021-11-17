import http from 'http';
import https from 'https';
import dnsPacket from 'dns-packet';
import relay from './relay.js';
import log, { setLogLevel } from './log.js';

import { getProvider, getPem, isObject, proxyClass } from './config.js';
import { DOH_HOST, DOH_PORT, DNS_PROVIDER, DOH_HTTPS_CERT, DOH_HTTPS_KEY } from './config.js';


class ClassDoH {
  constructor(...args) {
    const params = this._parseParams(args);

    if (params.logLevel) this.setLogLevel(params.logLevel);

    const isSupportsHttps = this._defaults.https != null;

    this.params = {
      ...this._defaults,

      ...params,

      https: (isSupportsHttps && params.https && params.https.key && params.https.cert
        ? this._parseHttpsParams(params.https) || this._defaults.https
        : null
      )
    };

    this.provider = params.provider;

    console.log(this);
  }

  get _defaults() {
    return {
      port: DOH_PORT,
      host: DOH_HOST,
      https: {
        key: DOH_HTTPS_KEY,
        cert: DOH_HTTPS_CERT
      }
    }
  }

  get _paramsList() {
    return ['port', 'host', 'provider', 'https', 'logLevel'];
  }

  get providerUrl() {
    return this.params.providerUrl;
  }
  set providerUrl(providerUrl) {
    this.params.providerUrl = providerUrl || PROVIDER_URL;
    log.info(`DoH set provider URL to ${this.providerUrl}`);
  }
  set provider(provider) {
    this.params.providerUrl = provider ? getProvider(provider) : PROVIDER_URL;
    log.info(`DoH set provider URL to ${this.providerUrl}`);
  }

  _parseParams(args) {
    const params = {};

    if (isObject(args[0])) {
      this._paramsList.forEach(key => {
        if (args[0][key] != null) params[key] = args[0][key];
      });
    } else {
      this._paramsList.forEach((key, index) => {
        if (args[index] != null) params[key] = args[index];
      });
    }

    return params;
  }

  _parseHttpsParams(https) {
    const key = getPem(https.key);
    const cert = getPem(https.cert);

    return key && cert ? { key, cert } : null;
  }

  setLogLevel(level) {
    setLogLevel(level)
  }

  setProvider(provider) {
    this.provider = provider;
  }

  start() {
    if (this.server) this.stop();

    const server = this.params.https
      ? https.createServer(this.params.https, (req, res) => this._onRequest(req, res))
      : http.createServer((req, res) => this._onRequest(req, res));

    server.on('error', error => {
      log.error('DoH error', error);
    })

    server.listen(this.params.port, this.params.host);

    log.info(`DoH ${this.params.https ? 'HTTPS' : 'HTTP'} server start on ${DOH_HOST}:${DOH_PORT}`);

    this.server = server;
  }

  stop() {
    if (this.server) {
      server.close(() => {
        delete this.server;
      });

      log.info('DoH server stop');
    }
  }

  _onRequest(req, res) {
    const t = Date.now();
    log.debug('DoH req', req.connection.remoteAddress, req.method, req.url, req.headers);

    if (req.method !== 'POST' || req.headers['content-type'] !== 'application/dns-message' ||  req.headers['accept'] !== 'application/dns-message') {
      res.writeHead(400);
      res.end('Invalid request');

      log.debug('DoH res', `(${Date.now() - t}ms)`, 400, `${req.connection.remoteAddress}`, 'invalid_request');
      return;
    }

    const data = [];

    req.on('error', error => {
      log.debug('DoH req error', error);
    });

    req.on('data', chunk => data.push(chunk));

    req.on('end', async () => {
      const request = Buffer.concat(data);
      let dnsReq;

      try {
        dnsReq = dnsPacket.decode(request);

        if (dnsReq.id == null) {
          log.debug('DoH invalid message', dnsReq);
          return;
        }
      } catch (error) {
        log.debug('DoH failed to parse message', error);

        res.writeHead(400);
        res.end('Invalid request body');

        log.debug('DoH res', `(${Date.now() - t}ms)`, 400, `${req.connection.remoteAddress}`, 'invalid_request_body');
        return;
      }

      const result = await relay(request, this.providerUrl);

      res.writeHead(200, {'content-type': 'application/dns-message'});
      res.end(result);

      log.debug('DoH res', `(${Date.now() - t}ms)`, 200, `${req.connection.remoteAddress}`, () => dnsPacket.decode(result));
    });
  }
}


const DoH = proxyClass(ClassDoH);

export default DoH;
