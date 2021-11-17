import fs from 'fs';
import path from 'path';

const homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

export const providers = {
  'mozilla-cloudflare': 'https://mozilla.cloudflare-dns.com/dns-query',
  'google': 'https://dns.google/dns-query',
  'cloudflare': 'https://cloudflare-dns.com/dns-query',
  'quad9': 'https://dns.quad9.net/dns-query',
  'cleanbrowsing-security': 'https://doh.cleanbrowsing.org/doh/security-filter/',
  'cleanbrowsing-family': 'https://doh.cleanbrowsing.org/doh/family-filter/',
  'cleanbrowsing-adult': 'https://doh.cleanbrowsing.org/doh/adult-filter/',
  'adguard': 'https://dns.adguard.com/dns-query',
  'adguard-family': 'https://dns-family.adguard.com/dns-query',
};

export const getProvider = provider => {
  if (provider && provider.indexOf('https:') === 0) return provider;
  return providers[(provider || '').toLowerCase()] || providers['cloudflare'];
}

export const isPem = str => /^-----BEGIN\s[A-Z\s]+-----\n/.test(str);

export const isObject = value => value != null && typeof value === 'object';

export const getPem = value => {
  if (isPem(value)) return value;
  const filePath = path.resolve(process.cwd(), value.replace(/^\~/, homeDir));

  try {
    return fs.readFileSync(filePath).toString();
  } catch (e) {
    return null;
  }
}

export const proxyClass = Class => new Proxy(Class, {
  apply(Target, context, args) {
    const instance = new Target(...args);
    instance.start();

    return instance;
  }
});


export const DOH_HOST       = process.env['DOH_HOST'] || process.env['DNS_HOST'] || '0.0.0.0';
export const DOH_PORT       = parseInt(process.env['DOH_PORT'] || process.env['DNS_PORT'] || 53535);

export const UDP_HOST       = process.env['UDP_HOST'] || process.env['DNS_HOST'] || '0.0.0.0';
export const UDP_PORT       = parseInt(process.env['UDP_PORT'] || process.env['DNS_PORT'] || 53535);

export const DNS_PROVIDER   = getProvider(process.env['DNS_PROVIDER']);
export const LOG_LEVEL      = (process.env['LOG_LEVEL'] || 'ERROR').toUpperCase();

export const DOH_HTTPS_CERT = process.env['DOH_HTTPS_CERT'] || null;
export const DOH_HTTPS_KEY  = process.env['DOH_HTTPS_KEY'] || null;
