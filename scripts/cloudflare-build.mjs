// Use the official cf toolchain's Build Output writer, never hand-roll its unstable schema.
import path from 'node:path';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {root,build} from './build.mjs';
const require=createRequire(import.meta.url);
const sdk=process.env.CF_SDK_ROOT||path.dirname(require.resolve('cf/package.json'));
const modules=path.resolve(sdk,'..');
const utils=await import(pathToFileURL(path.join(modules,'@cloudflare/build-output-utils/dist/index.mjs')).href);
const {InputWorkerSchema}=await import(pathToFileURL(path.join(modules,'@cloudflare/config/dist/index.mjs')).href);
const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
if(!/^[a-f0-9]{32}$/.test(accountId||''))throw Error('Set the intended CLOUDFLARE_ACCOUNT_ID explicitly');
const worker=InputWorkerSchema.parse(JSON.parse(await fs.readFile(path.join(root,'worker.json'),'utf8')));
if(worker.entrypoint||Object.keys(worker.env||{}).length)throw Error('This deployment must remain assets-only, with no bindings');
const dist=await build();await utils.cleanBuildOutputDir(root);await utils.writeRootConfig(root,{accountId},{mode:'production',isPreview:false});await utils.writeWorkerConfig({root,config:worker});await utils.writeAssets({root,sourceDirectory:dist});
const check=await utils.readBuildOutput(root);if(check.workers.default.bundleDir)throw Error('Unexpected runtime bundle');
console.log(`Prepared assets-only ${worker.name} for ${worker.domains.join(', ')}`);
