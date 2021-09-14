import http from 'http';
import dnsPacket from 'dns-packet';
import { DOH_HOST, DOH_PORT } from './config.js';
import relay from './relay.js';
import log from './log.js';

export default (port = DOH_PORT, host = DOH_HOST, provider) => {
  const server = http.createServer((req, res) => {
    const t = Date.now();
    log.debug('DOH req', req.connection.remoteAddress, req.method, req.url, req.headers);

    if (req.method !== 'POST' || req.headers['content-type'] !== 'application/dns-message' ||  req.headers['accept'] !== 'application/dns-message') {
      res.writeHead(400);
      res.end('Invalid request');

      log.debug('DOH res', `(${Date.now() - t}ms)`, 400, `${req.connection.remoteAddress}`, 'invalid_request');
      return;
    }

    const data = [];

    req.on('error', error => {
      log.debug('DOH req error', error);
    });

    req.on('data', chunk => data.push(chunk));

    req.on('end', async () => {
      const request = Buffer.concat(data);
      let dnsReq;

      try {
        dnsReq = dnsPacket.decode(request);

        if (!dnsReq.id) {
          log.debug('DOH invalid message', dnsReq);
          return;
        }
      } catch (error) {
        log.debug('DOH failed to parse message', error);

        res.writeHead(400);
        res.end('Invalid request body');

        log.debug('DOH res', `(${Date.now() - t}ms)`, 400, `${req.connection.remoteAddress}`, 'invalid_request_body');
        return;
      }

      const result = await relay(request, provider);

      res.writeHead(200, {'content-type': 'application/dns-message'});
      res.end(result);

      log.debug('DOH res', `(${Date.now() - t}ms)`, 200, `${req.connection.remoteAddress}`, () => dnsPacket.decode(result));
    });
  });

  server.on('error', error => {
    log.error('DOH error', error);
  })

  server.listen(port, host);

  log.info(`DOH start on ${DOH_HOST}:${DOH_PORT}`);
};
