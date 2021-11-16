import got from 'got';
import dnsPacket from 'dns-packet';
import log from './log.js';

export const fail = req => {
  const { questions, flags, id } = dnsPacket.decode(req);

  return dnsPacket.encode({
    id,
    type: 'response',
    questions,
    flags: (0b0111100000000000 & flags) |
           (0b0000000100000000 & flags) |
           (0b0000000010000000) |
           (0b0000000000000010)
  });
}

export default async (req, providerUrl) => {
  try {
    const res = await got(providerUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/dns-message',
        'content-type': 'application/dns-message'
      },
      body: req,
      responseType: 'buffer',
      throwHttpErrors: false
    });

    if (res.statusCode === 200) {
      log.debug('Relay response', res.statusCode, res.headers);
      return res.body;
    }

    log.debug('Relay response error', () => new got.HTTPError(res));
    return fail(req);
  } catch (error) {
    log.error('Relay error', error);
    return fail(req);
  }
};
