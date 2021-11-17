import dgram from 'dgram';
import dnsPacket from 'dns-packet';
import relay from './relay.js';
import log from './log.js';
import ClassDoH from './doh.js';
import { UDP_PORT, UDP_HOST, proxyClass, isObject } from './config.js';


class ClassUDP extends ClassDoH {
  get _defaults() {
    return {
      port: UDP_PORT, host: UDP_HOST
    }
  }

  get _paramsList() {
    return ['port', 'host', 'provider', 'logLevel'];
  }

  start() {
    if (this.server) this.stop();

    const server = dgram.createSocket('udp4');

    server.on('listening', () => {
      const address = server.address();
      log.info(`UDP server start on ${address.address}:${address.port}`);
    });

    server.on('error', error => {
      log.error('UDP error', error);
    });

    server.on('message', async (req, info) => {
      await this._onRequest(req, info);
    })

    server.bind(this.params.port, this.params.host);

    this.server = server;
  }

  stop() {
    if (this.server) {
      this.server.close();
      delete this.server();

      log.info('UDP server stop');
    }
  }

  async _onRequest(req, info) {
    let dnsReq;
    const t = Date.now();

    try {
      dnsReq = dnsPacket.decode(req);

      if (dnsReq.id == null) {
        log.debug('UDP invalid message', dnsReq);
        return;
      }
    } catch (error) {
      log.debug('UDP failed to parse message', error);
      return;
    }

    log.debug('UDP req', `${info.address}:${info.port}`, dnsReq);

    const res = await relay(req, this.providerUrl);
    this.server.send(res, info.port, info.address);

    log.debug('UDP res', `(${Date.now() - t}ms)`, `${info.address}:${info.port}`, () => dnsPacket.decode(res));
  }
}


const UDP = proxyClass(ClassUDP);

export default UDP;
