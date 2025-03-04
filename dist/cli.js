#!/usr/bin/env node
"use strict";var e=Object.create,t=Object.defineProperty,r=Object.getOwnPropertyDescriptor,o=Object.getOwnPropertyNames,a=Object.getPrototypeOf,l=Object.prototype.hasOwnProperty,c=(c,n,s)=>(s=null!=c?e(a(c)):{},((e,a,c,n)=>{if(a&&"object"==typeof a||"function"==typeof a)for(let s of o(a))l.call(e,s)||s===c||t(e,s,{get:()=>a[s],enumerable:!(n=r(a,s))||n.enumerable});return e})(!n&&c&&c.__esModule?s:t(s,"default",{value:c,enumerable:!0}),c)),n=require("commander"),s=c(require("chalk")),i=c(require("inquirer")),u=c(require("fs-extra")),d=c(require("path")),f=c(require("chalk")),p=c(require("ora")),m=c(require("degit")),g=c(require("fs")),y=c(require("ejs"));var h=(e,t,r)=>{const o=g.default.readFileSync(e,"utf-8"),a=y.default.render(o,r);g.default.writeFileSync(t,a,"utf-8")};var j=c(require("fs")),w=c(require("path")),b=c(require("chalk")),x=c(require("inquirer")),S=c(require("path")),v=c(require("fs"));function q(e){const{root:t}=S.default.parse(e);let r=e;for(;r!==t;){const e=S.default.join(r,"package.json");if(v.default.existsSync(e))return r;r=S.default.dirname(r)}console.error("❌ Could not find project root."),process.exit(1)}var $=c(require("fs")),k=c(require("path")),O=c(require("chalk")),T=c(require("inquirer"));var A=c(require("fs")),E=c(require("path")),P=c(require("chalk")),M=c(require("inquirer"));var J=c(require("path")),C=c(require("fs/promises")),N=require("url"),R=c(require("chalk")),_=c(require("cli-table3"));var L=async e=>{let t=[];try{const r=await C.default.readdir(e,{withFileTypes:!0});for(const o of r){const r=J.default.join(e,o.name);o.isDirectory()?t.push(...await L(r)):o.isFile()&&/\.(route\.(js|mjs|cjs|ts))$/i.test(o.name)&&t.push(r)}}catch{}return t},F=async e=>{try{const t=await async function(e){const t=(0,N.pathToFileURL)(e).href,r=await import(t);return r.default||r}(e);let r={};if("object"!=typeof t||null===t)return{file:e,routes:{}};const o=Object.getPrototypeOf(t);return o&&"AxonRouter"===o.constructor.name?{file:e,routes:t.exportRoutes()}:(Object.values(t).forEach((e=>{if("object"==typeof e&&null!==e){const t=Object.getPrototypeOf(e);t&&"AxonRouter"===t.constructor.name&&(r={...r,...e.exportRoutes()})}})),{file:e,routes:r})}catch(t){return console.error(`Error loading route ${e}:\n`,t),{file:e,routes:{}}}},G={GET:R.default.green.bold,POST:R.default.yellow.bold,PUT:R.default.blue.bold,PATCH:R.default.magenta.bold,DELETE:R.default.red.bold,OPTIONS:R.default.cyan.bold},D=e=>(G[e]||R.default.white.bold)(e),I={project:"Scaffold a new AxonJs project with MVC structure"},H={controller:"Create a controller in src/controllers",middleware:"Create a middleware in src/middlewares",router:"Create a router in src/routers"},U=new n.Command;U.name("axon").description("A complete tool for managing AxonJs projects").usage("<command> [options]").helpOption("-h, --help","Display help for command").version("0.1.0"),U.command("create").description("List of `create` commands").action((()=>{console.log(s.default.yellow("Available `create` commands:")),Object.keys(I).forEach((e=>{console.log(s.default.green(`- ${e}: `)+s.default.white(I[e]))}))})),U.command("make").description("List of `make` commands").action((()=>{console.log(s.default.yellow("Available `make` commands:")),Object.keys(H).forEach((e=>{console.log(s.default.green(`- ${e}: `)+s.default.white(H[e]))}))})),U.command("create:project").description(I.project).action((async function(){let e;try{e=await i.default.prompt([{type:"list",name:"language",message:"Select project language:",choices:["JavaScript","TypeScript"]},{type:"input",name:"projectName",message:"Project name:",default:"axon-project"}])}catch(e){console.log(f.default.magenta("Aborted, Goodbye!")),process.exit(1)}const{language:t,projectName:r}=e,o=d.default.join(process.cwd(),r);u.default.existsSync(o)&&(console.error(f.default.red(`Directory ${r} already exists.`)),process.exit(1)),u.default.mkdirSync(o);const a=(0,p.default)("Cloning template from GitHub...").start();try{await async function(e,t){const r="TypeScript"===e?"AxonJsLabs/Axon-template-ts#main":"AxonJsLabs/Axon-template-js#main",o=(0,m.default)(r,{cache:!1,force:!0,verbose:!0});await o.clone(t)}(t,o),a.succeed("Template cloned successfully.");const e=d.default.join(o,"package.json"),l=u.default.readJsonSync(e);l.name=r,u.default.writeJsonSync(e,l,{spaces:2}),console.log(f.default.green("Base project created successfully using the",t,"template!")),console.log(f.default.blue("✨ Run the following commands to start the project:")),console.log(f.default.white(`cd ${r}`)),console.log(f.default.white("npm install")),console.log(f.default.white("npm start\n")),console.log(f.default.magenta("Happy coding! Thanks for using Axon 🌟❤️"))}catch(e){a.fail("Template cloning failed."),console.error(e),process.exit(1)}})),U.command("make:controller <name>").description(H.controller).action((async function(e){try{const t=q(process.cwd()),r=w.default.join(t,"src","controllers");let o;try{o=await x.default.prompt([{type:"list",name:"language",message:"Select project language:",choices:["JavaScript","TypeScript"]}])}catch(e){console.log(b.default.magenta("Aborted. Goodbye!")),process.exit(1)}const{language:a}=o,l="TypeScript"===a?"ts":"js",c=e.split("/").filter((e=>""!==e.trim()));0===c.length&&(console.error(b.default.red(`❌ Invalid controller name: ${e}`)),process.exit(1));const n=c.pop(),s=c,i=w.default.join(r,...s);j.default.existsSync(i)||j.default.mkdirSync(i,{recursive:!0});const u=`${n}.controller.${l}`,d=w.default.join(__dirname,"templates","controller",`controller.${l}.ejs`),f=w.default.join(i,u);j.default.existsSync(f)&&(console.error(b.default.red(`❌ Controller '${u}' already exists in ${w.default.relative(t,i)}`)),process.exit(1)),h(d,f,{controllerName:n});const p=w.default.relative(t,i),m=b.default.green(`✅ Successfully created ${u} in ${p}`);console.log(m)}catch(e){console.error(b.default.red("❌ Error:",e)),process.exit(1)}})),U.command("make:middleware <name>").description(H.middleware).action((async function(e){try{const t=q(process.cwd()),r=k.default.join(t,"src","middlewares");let o;try{o=await T.default.prompt([{type:"list",name:"language",message:"Select project language:",choices:["JavaScript","TypeScript"]}])}catch(e){console.log(O.default.magenta("Aborted. Goodbye!")),process.exit(1)}const{language:a}=o,l="TypeScript"===a?"ts":"js",c=e.split("/").filter((e=>""!==e.trim()));0===c.length&&(console.error(O.default.red(`❌ Invalid middleware name: ${e}`)),process.exit(1));const n=c.pop(),s=c,i=k.default.join(r,...s);$.default.existsSync(i)||$.default.mkdirSync(i,{recursive:!0});const u=`${n}.middleware.${l}`,d=k.default.join(__dirname,"templates","middleware",`middleware.${l}.ejs`),f=k.default.join(i,u);$.default.existsSync(f)&&(console.error(O.default.red(`❌ Middleware '${u}' already exists in ${k.default.relative(t,i)}`)),process.exit(1)),h(d,f,{middlewareName:n});const p=k.default.relative(t,i),m=O.default.green(`✅ Successfully created ${u} in ${p}`);console.log(m)}catch(e){console.error(O.default.red("❌ Error:",e)),process.exit(1)}})),U.command("make:router <name>").description(H.router).action((async function(e){try{const t=q(process.cwd()),r=E.default.join(t,"src","routers");let o;try{o=await M.default.prompt([{type:"list",name:"language",message:"Select project language:",choices:["JavaScript","TypeScript"]}])}catch(e){console.log(P.default.magenta("Aborted. Goodbye!")),process.exit(1)}const{language:a}=o,l="TypeScript"===a?"ts":"js",c=e.split("/").filter((e=>""!==e.trim()));0===c.length&&(console.error(P.default.red(`❌ Invalid router name: ${e}`)),process.exit(1));const n=c.pop(),s=c,i=E.default.join(r,...s);A.default.existsSync(i)||A.default.mkdirSync(i,{recursive:!0});const u=`${n}.route.${l}`,d=E.default.join(__dirname,"templates","router",`router.${l}.ejs`),f=E.default.join(i,u);A.default.existsSync(f)&&(console.error(P.default.red(`❌ Router '${u}' already exists in ${E.default.relative(t,i)}`)),process.exit(1)),h(d,f,{routerName:n}),console.log(P.default.green(`✅ Successfully created ${u} in ${E.default.relative(t,i)}`))}catch(e){console.error(P.default.red("❌ Error:",e)),process.exit(1)}})),U.command("route:list").description("List all routes in the project").action((async()=>{const e=await(async()=>{try{const e=["src/routers","routers"],t=q(process.cwd());let r=[];for(const o of e){const e=await L(J.default.resolve(t,o));r.push(...e)}return await Promise.all(r.map((e=>F(e))))}catch(e){return console.error("Error loading routes:\n",e),[]}})(),t=[];if(e.forEach((({file:e,routes:r})=>{Object.keys(r).forEach((o=>{Object.keys(r[o]).forEach((r=>{t.push({method:o,route:r,file:J.default.relative(process.cwd(),e)})}))}))})),0===t.length)return void console.log(R.default.red("❌ No routes found."));const[r,o,a]=(e=>{const t=process.stdout.columns||80;let r=6,o=10,a=10;e.forEach((({method:e,route:t,file:l})=>{r=Math.max(r,e.length),o=Math.max(o,t.length),a=Math.max(a,l.length)}));let l=r+o+a+10;if(l>t){const e=l-t;a=Math.max(10,a-e)}else{const e=t-l;o+=Math.floor(.6*e),a+=Math.floor(.4*e)}return[r,o,a]})(t),l=new _.default({head:[R.default.blue.bold("Method"),R.default.blue.bold("Route"),R.default.blue.bold("Filename")],colWidths:[r,o,a].map((e=>Math.max(e,10))),wordWrap:!0,style:{head:[],border:[]}});t.forEach((({method:e,route:t,file:r})=>{var o,c;l.push([D(e),R.default.white(t),R.default.yellow((o=r,c=Math.max(a,10),o.length>c?o.substring(0,c-3)+"...":o))])})),console.log(l.toString())})),U.parse(process.argv);//# sourceMappingURL=cli.js.map