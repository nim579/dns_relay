# DNS Relay
DNS relay for UDP and DoH requests


## Node usage

### In code

``` js
import { udp, doh } from 'dns-relay';

udp(53535, 'cloudflare');
doh(80, '127.0.0.1', 'google');
```
OR
``` js
const dnsRelay = require('dns-relay');

dnsRelay.udp(53535, 'cloudflare');
dnsRelay.doh(80, '127.0.0.1', 'google');
```

**Methods:**
* **udp(port[, provider])** — start UDP DNS server
* **doh(port[, host[, provider]])** — start DoH HTTP (**not secure!**) server

Or use environment variables (see list below).

### Command line

```sh
$ npm i -g dns-relay
```
```sh
$ dns-relay
```

You can use environment variables (see list below).


## Docker usage

Command:
```sh
docker run \
  --name dns-relay \
  -p 53:53535/udp \
  -p 80:53535/tcp \
  -e DOH_PORT=53535
  -e UDP_PORT=53535
  nim579/dns-relay
```

Compose:
```yaml
version: "2"
services:
  migrator:
    image: nim579/dns-relay
    ports:
      - 53:53535/udp
      - 80:53535/tcp
    environment:
      DOH_HOST=0.0.0.0
      DOH_PORT=53535
      UDP_PORT=53535
      PROVIDER=google
      LOG_LEVEL=none
```


## Env variables
* **DOH_HOST** — Listen host for DoH server (default `0.0.0.0`)
* **DOH_PORT** — Listen port for DoH server (default `53535`)
* **UDP_PORT** — Listen port for UDP server (default `53535`)
* **PROVIDER** — Provider name for relay (see list below, default `cloudflare`)
* **LOG_LEVEL** — Logs level. `none`, `error`, `info`, `debug` available (default `error`)


## Providers
List of available providers

* `mozilla-cloudflare` — https://mozilla.cloudflare-dns.com/dns-query
* `google` — https://dns.google/dns-query
* `cloudflare` — https://cloudflare-dns.com/dns-query
* `quad9` — https://dns.quad9.net/dns-query
* `cleanbrowsing-security` — https://doh.cleanbrowsing.org/doh/security-filter/
* `cleanbrowsing-family` — https://doh.cleanbrowsing.org/doh/family-filter/
* `cleanbrowsing-adult` — https://doh.cleanbrowsing.org/doh/adult-filter/
* `adguard` — https://dns.adguard.com/dns-query
* `adguard-family` — https://dns-family.adguard.com/dns-query
