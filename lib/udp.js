import dgram from 'dgram';
import dnsPacket from 'dns-packet';
import { UDP_PORT } from './config.js';
import relay from './relay.js';
import log from './log.js';

export default () => {
  const server = dgram.createSocket('udp4');

  server.on('listening', () => {
    const address = server.address()
    log.info(`UDP start on ${address.address}:${address.port}`);
  });

  server.on('error', error => {
    log.error('UDP error', error);
  });

  server.on('message', async (req, info) => {
    let dnsReq;
    const t = Date.now();

    try {
      dnsReq = dnsPacket.decode(req);

      if (!dnsReq.id) {
        log.debug('UDP invalid message', dnsReq);
        return;
      }
    } catch (error) {
      log.debug('UDP failed to parse message', error);
      return;
    }

    log.debug('UDP req', `${info.address}:${info.port}`, dnsReq);

    const res = await relay(req);
    server.send(res, info.port, info.address);

    log.debug('UDP res', `(${Date.now() - t}ms)`, `${info.address}:${info.port}`, () => dnsPacket.decode(res));
  });

  server.bind(UDP_PORT);
};
