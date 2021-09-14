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

export const DOH_HOST  = process.env['DOH_HOST'] || '0.0.0.0';
export const DOH_PORT  = parseInt(process.env['DOH_PORT'] || 53535);
export const UDP_PORT  = parseInt(process.env['UDP_PORT'] || 53535);
export const PROVIDER  = (process.env['PROVIDER'] || 'cloudflare').toLowerCase();
export const LOG_LEVEL = (process.env['LOG_LEVEL'] || 'ERROR').toUpperCase();
export const PROVIDER_URL = providers[PROVIDER] || providers['cloudflare'];
