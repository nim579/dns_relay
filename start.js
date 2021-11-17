import fs from 'fs';
import { program, Option, Argument } from 'commander';
import { UDP, DoH } from './index.js';
import { providers } from './lib/config.js';

const pkg = JSON.parse(fs.readFileSync('./package.json').toString());

const optPort = new Option('-p, --port [port]', 'Servers port').env('DNS_PORT').default(53535);
const optHost = new Option('-H, --host [host]', 'Servers host').env('DNS_HOST').default('0.0.0.0');
const optProv = new Option('-P, --provider [provider]', `Relay DoH provider from list or direct DoH URL`).env('DNS_PROVIDER').default('cloudflare');
const optLLvl = new Option('-L, --log-level [level]', 'Log level').env('LOG_LEVEL').default('ERROR').choices(['NONE', 'ERROR', 'INFO', 'DEBUG']);
const optHKey = new Option('--https-key [key]', 'HTTPS key file-path or PEM-file content').env('DOH_HTTPS_KEY');
const optHCrt = new Option('--https-cert [cert]', 'HTTPS cert file-path or PEM-file content').env('DOH_HTTPS_CERT');

const argument = new Argument('[servers...]', 'Types of servers for start').default(['udp', 'doh']).choices(['udp', 'doh'])

const helpText = `
Providers list:
  ${Object.keys(providers).join('\n  ')}`;


const start = (servers, params) => {
  if (params.httpsKey || params.httpsCert)
    params.https = {
      key: params.httpsKey,
      cert: params.httpsCert
    };

  if (servers.includes('doh')) DoH(params);
  if (servers.includes('udp')) UDP(params);
}

program
  .name(pkg.name)
  .version(pkg.version)
  .addOption(optPort)
  .addOption(optHost)
  .addOption(optProv)
  .addOption(optLLvl)
  .addOption(optHKey)
  .addOption(optHCrt)
  .addArgument(argument)
  .action(start)
  .addHelpText('after', helpText)
  .parse();
