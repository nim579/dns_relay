import dgram from 'dgram';
import dnsPacket from 'dns-packet';
import { UDP_PORT, PROVIDER_URL, getProvider } from './config.js';
import relay from './relay.js';
import log, { setLogLevel } from './log.js';


export default (port = UDP_PORT, provider, logLevel) => {
  const self = {};

  self.setLogLevel = logLevel => {
    setLogLevel(logLevel);
    return self;
  };

  if (logLevel) self.setLogLevel(logLevel);

  let providerUrl;

  self.setProvider = (provider) => {
    providerUrl = provider ? getProvider(provider) : PROVIDER_URL;
    log.info(`UDP set provider URL to ${providerUrl}`);
    return self;
  }

  self.setProvider(provider);

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

      if (dnsReq.id == null) {
        log.debug('UDP invalid message', dnsReq);
        return;
      }
    } catch (error) {
      log.debug('UDP failed to parse message', error);
      return;
    }

    log.debug('UDP req', `${info.address}:${info.port}`, dnsReq);

    const res = await relay(req, providerUrl);
    server.send(res, info.port, info.address);

    log.debug('UDP res', `(${Date.now() - t}ms)`, `${info.address}:${info.port}`, () => dnsPacket.decode(res));
  });

  server.bind(port);

  self.stop = () => {
    log.info('UDP server stop');
    server.close();
    return null;
  }

  return self;
};
