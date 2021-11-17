# DNS Relay
DNS relay for UDP and DoH requests


## Node usage

### In code

``` js
// ESM
import { UDP, DoH } from 'dns-relay';
// CommonJS
const { UDP, DoH } = require('dns-relay');

// Instant start
UDP(53535, 'cloudflare');
DoH(80, '127.0.0.1', 'google');

// Class usage
const udp = new UDP(53535, 'cloudflare');
udp.start();

const doh = new DoH(53535, 'cloudflare');
doh.start();

// Object params
UDP({ port: 53535, host: '127.0.0.1', provider: 'cloudflare'});
const doh = new DoH({ port: 53535, host: '127.0.0.1', provider: 'cloudflare'});
```


### Initialize
* UDP
  * `UDP(...params): ClassUDP` — argumental params. Return class object and instantly start server
  * `UDP(params: Object): ClassUDP` — object params. Return class object and instantly start server
  * `new UDP(...params): ClassUDP` — argumental params. Just class constructor call
  * `new UDP(params: Object): ClassUDP` — object params. Just class constructor call
* DoH
  * `DoH(...params): ClassDoH` — argumental params. Return class object and instantly start server
  * `DoH(params: Object): ClassDoH` — object params. Return class object and instantly start server
  * `new DoH(...params): ClassDoH` — argumental params. Just class constructor call
  * `new DoH(params: Object): ClassDoH` — object params. Just class constructor call

Params overwrites environment variables (see list below).

### Parameters

**Arguments**
* UDP
  * `UDP([port[, host[, provider[, logLevel]]]])`
  * `new UDP([port[, host[, provider[, logLevel]]]])`
  * `UDP({port: number, host: string, provider: string, logLevel: string})`
  * `new UDP({port: number, host: string, provider: string, logLevel: string})`
* DoH
  * `DoH([port[, host[, provider[, https[, logLevel]]]]])`
  * `new DoH([port[, host[, provider[, https[, logLevel]]]]])`
  * `DoH({port: number, host: string, provider: string, https: {key: string, cert: string}, logLevel: string})`
  * `new DoH({port: number, host: string, provider: string, https: {key: string, cert: string}, logLevel: string})`

**Available params**
* **port** — server listen port
* **host** — server listen host 
* **provider** — DoH-provider for relay. Use predefined name (see list below) or pass direct URL
* **https** — **for DoH only** `{key: "pem or file-path", cert: "pem or file-path"}`. HTTPS params for DoH server. If some file does not pass or unavaliable DoH server starts in HTTP.
* **logLevel** — Log level (see list of levels below)

### Class methods
* `start()` — start server
* `stop()` — stop server
* `setLogLevel(level)` — set log level
* `setProvider(provider || providerUrl)` — set provider from list (see below) or direct url


## Command line

Local usage:
```sh
$ npm install dns-relay
$ npx dns-relay [options] [servers...]
```

Global usage:
```sh
$ npm install -g dns-relay
$ dns-relay [options] [servers...]
```

**Servers**

You can enable one of UDP or DoH server
``` sh
$ dns-relay doh # DoH only
$ dns-relay udp # UDP only
$ dns-relay doh udp # UDP and DoH server starts
$ dns-relay # dns-relay doh udp
```

**Options**

Options overrides environment variables
* `-p, --port [port]` — Servers port (default *53535*, env `DNS_PORT`)
* `-H, --host [host]` — Servers host (default *0.0.0.0*, env `DNS_HOST`)
* `-P, --provider [provider]` — Relay DoH provider from list or direct DoH URL (default *cloudflare*, env `DNS_PROVIDER`)
* `-L, --log-level [level]` — Log level (see list of levels below, default *ERROR*, env `LOG_LEVEL`)
* `--https-key [key]` — HTTPS key file-path or PEM-file content (env `DOH_HTTPS_KEY`)
* `--https-cert [cert]` — HTTPS cert file-path or PEM-file content (env `DOH_HTTPS_CERT`)
* `-V, --version` — output the version number
* `-h, --help` — display help for command


## Docker usage

Command:
```sh
docker run \
  --name dns-relay \
  -p 53:53535/udp \
  -p 80:53535/tcp \
  -e DNS_HOST=0.0.0.0
  -e DNS_PORT=53535
  -e DNS_PROVIDER=google
  -e LOG_LEVEL=NONE
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
      DNS_HOST=0.0.0.0
      DNS_PORT=53535
      DNS_PROVIDER=google
      LOG_LEVEL=NONE
```


## Env variables
* **DNS_PORT** — Listen port for UDP and DoH servers
* **DNS_HOST** — Listen host for UDP and DoH servers

* **UDP_PORT** — Listen port for UDP server (overrides **DNS_HOST**, default *53535*)
* **UDP_HOST** — Listen host for UDP server (overrides **DNS_PORT**, default *0.0.0.0*)

* **DOH_PORT** — Listen port for DoH server (overrides **DNS_HOST**, default *53535*)
* **DOH_HOST** — Listen host for DoH server (overrides **DNS_PORT**, default *0.0.0.0*)

* **DOH_HTTPS_CERT** — HTTP cert (for DoH only). Pass absolute or relative url or PEM-file content
* **DOH_HTTPS_KEY** — HTTP key (for DoH only). Pass absolute or relative url or PEM-file content

* **DNS_PROVIDER** — Provider name or direct URL for relay (see list of providers below, default *cloudflare*)
* **LOG_LEVEL** — Logs level (see list of levels below, default *ERROR*)


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


## Log levels
* `NONE` — no logs
* `ERROR` — error logs only
* `INFO` — error and info logs
* `DEBUG` — error, info and debug logs
