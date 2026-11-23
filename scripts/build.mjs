import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export async function build(output=path.join(root,'dist')){
 const {pocketWild:p}=JSON.parse(await fs.readFile(path.join(root,'projects.json'),'utf8'));
 if(p.repository!=='JinxOnPurpose-Labs/pocket-wild'||!/^\w{40}$/.test(p.revision))throw Error('Invalid project identity/revision');
 const source=path.resolve(process.env.POCKET_WILD_DIR||path.join(root,'../pocket-wild'));
 const allowed=['index.html','style.css','icon.svg','src/main.js','src/world.js','src/render.js'];
 if(Object.keys(p.files).sort().join()!==allowed.sort().join())throw Error('Unexpected game file list');
 // Read committed bytes only. Never execute the game, copy its whole repository, or include dirty work.
 const game=[];for(const file of allowed){const bytes=execFileSync('git',['-C',source,'show',`${p.revision}:${file}`],{maxBuffer:1024*1024});if(createHash('sha256').update(bytes).digest('hex')!==p.files[file])throw Error(`Game digest mismatch: ${file}`);game.push([file,bytes]);}
 await fs.rm(output,{recursive:true,force:true});await fs.mkdir(output,{recursive:true});
 await fs.cp(path.join(root,'public'),output,{recursive:true});
 for(const [file,bytes]of game){const dest=path.join(output,'pocket-wild',file);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,bytes);}
 await fs.writeFile(path.join(output,'projects.json'),JSON.stringify({pocketWild:{repository:p.repository,revision:p.revision,url:'/pocket-wild/'}},null,2)+'\n');
 return output;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){console.log(await build());}
