import pkg from './package.json';

const dependencies = Object.keys(pkg.dependencies);

const banner = `/*
  @license
	dns-relay v${pkg.version} - ${new Date().toUTCString()}
	${pkg.homepage}
	Released under the ${pkg.license} License.
*/\n`;

export function emitCommonPackageFile() {
	return {
		generateBundle() {
			this.emitFile({ fileName: 'package.json', source: `{"type":"commonjs"}`, type: 'asset' });
		},
		name: 'emit-common-package-file'
	};
}

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
  sourcemap: true
}

const esmOutput = {
  ...cjsOutput,
  format: 'es',
  dir: 'dist',
  minifyInternalExports: false,
  sourcemap: false
}

const config = {
  external: [
    ...dependencies,
    'fs',
    'path',
    'dgram',
    'http',
    'https'
  ],

  input: {
    'dns-relay': './index.js'
  },

  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false
  }
}

export default [
  {
    ...config,
    output: cjsOutput,
    plugins: [ emitCommonPackageFile() ]
  }, {
    ...config,
    output: esmOutput,
  }
]
