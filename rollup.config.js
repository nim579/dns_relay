import pkg from './package.json';

// export default {
// 	input: './index.js',
// 	output: [{
// 		file: './dist/dns-relay.es.js',
// 		format: 'es',
// 		sourcemap: true
// 	}, {
// 		file: './dist/dns-relay.cjs.js',
// 		format: 'cjs',
// 		sourcemap: true
// 	}]
// };

const banner = `/*
  @license
	dns-relay v${pkg.version} - ${new Date().toUTCString()}
	${pkg.homepage}
	Released under the ${pkg.license} License.
*/\n`;

const cjsOutput = {
  banner,
  format: 'cjs',
  dir: 'dist/cjs',
  entryFileNames: '[name].js',
  chunkFileNames: '[name].js',
  freeze: false,
  exports: 'auto',
  generatedCode: 'es2015',
  externalLiveBindings: false,
  manualChunks: { rollup: ['./index.js'] },
  sourcemap: true
}

const esmOutput = {
  ...cjsOutput,
  format: 'es',
  dir: 'dist',
  minifyInternalExports: false,
  sourcemap: false
}


export default {
  external: [
    'dns-packet',
    'got',
    'http',
    'dgram'
  ],
  input: {
    'dns-relay': './index.js'
  },
  output: [cjsOutput, esmOutput],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false
  }
}

// {
//   banner,
//   dir: 'dist',
//   entryFileNames: '[name].es.js',
//   chunkFileNames: '[name].js',
//   format: 'es',
//   sourcemap: true
// }

// chunkFileNames: 'shared/[name].js',
//       dir: 'dist',
//       entryFileNames: '[name]',
//       // TODO Only loadConfigFile is using default exports mode; this should be changed in Rollup@3
//       exports: 'auto',
//       externalLiveBindings: false,
//       format: 'cjs',
//       freeze: false,
//       generatedCode: 'es2015',
//       interop: id => {
//         if (id === 'fsevents') {
//           return 'defaultOnly';
//         }
//         return 'default';
//       },
//       manualChunks: { rollup: ['src/node-entry.ts'] },
//       sourcemap: true
