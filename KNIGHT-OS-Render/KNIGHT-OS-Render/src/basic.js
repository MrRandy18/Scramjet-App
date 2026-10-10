import http from 'node:http';
import https from 'node:https';
import dns from 'node:dns/promises';
import net from 'node:net';
import {randomBytes} from 'node:crypto';
import {load} from 'cheerio';
const MAX=4_000_000;
export function validTarget(raw){
 const u=new URL(raw),host=u.hostname.toLowerCase();
 if(!['http:','https:'].includes(u.protocol)||u.username||u.password||u.port||!host.includes('.')||net.isIP(host)||host.includes(':')||/(^|\.)(localhost|local|internal|test|invalid)$/.test(host))throw Error('Use a public http or https website address without a custom port.');
 return u;
}
export function publicAddress(address){
 if(net.isIP(address)!==4)return false;
 const [a,b]=address.split('.').map(Number);
 return !(a===0||a===10||a===127||a>=224||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&[0,168].includes(b))||(a===198&&(b===18||b===19||b===51))||(a===100&&b>=64&&b<=127)||(a===203&&b===0));
}
async function requestPage(url,signal){
 const addresses=await dns.lookup(url.hostname,{all:true,family:4});
 if(!addresses.length||addresses.some(item=>!publicAddress(item.address)))throw Error('Only public websites are supported.');
 const address=addresses[0].address;
 return new Promise((resolve,reject)=>{
  const req=(url.protocol==='https:'?https:http).request(url,{signal,method:'GET',agent:false,lookup:(_host,options,callback)=>callback(null,options.all?[{address,family:4}]:address,4),headers:{'User-Agent':'NightWindow/1.0 (basic document viewer)','Accept':'text/html,text/css,image/*;q=0.8,*/*;q=0.5','Accept-Encoding':'identity'}},res=>{
   const chunks=[];let bytes=0;
   res.on('data',chunk=>{bytes+=chunk.length;if(bytes>MAX){res.destroy(Error('This page is too large for Basic. Try Scramjet.'));return;}chunks.push(chunk);});
   res.on('error',reject);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks)}));
  });req.on('error',reject);req.setTimeout(18000,()=>req.destroy(Error('The website took too long to respond.')));req.end();
 });
}
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function sanitizeHtml(source,target){
 const $=load(source);let base=target;
 try{const href=$('base[href]').first().attr('href');if(href)base=validTarget(new URL(href,target).href).href;}catch{}
 const asset=value=>{try{return '/api/basic?asset=1&url='+encodeURIComponent(validTarget(new URL(value,base).href).href);}catch{return '';}};
 const css=text=>String(text).replace(/url\(\s*(['"]?)(.*?)\1\s*\)/gi,(_m,_q,url)=>url.startsWith('data:')?'url("'+url.replaceAll('"','%22')+'")':'url("'+asset(url)+'")').replace(/@import\s+(['"])(.*?)\1/gi,(_m,_q,url)=>'@import "'+asset(url)+'"');
 $('script,iframe,frame,frameset,object,embed,meta,base,svg,math,template').remove();
 $('*').each((_index,element)=>{
  const el=$(element),tag=element.tagName;
  for(const name of Object.keys(element.attribs||{}))if(name.startsWith('on')||['nonce','integrity','crossorigin','srcdoc','ping','srcset','autofocus','data-night-url','formaction'].includes(name))el.removeAttr(name);
  if(tag==='a'||tag==='area'){const href=el.attr('href');el.removeAttr('target');if(href&&!href.startsWith('#')){try{el.attr('data-night-url',validTarget(new URL(href,base).href).href);el.attr('href','#');}catch{el.removeAttr('href');}}}
  if(tag==='form')el.removeAttr('action');if(['button','input','select','textarea'].includes(tag))el.attr('disabled','');
  if(tag==='link'){if(el.attr('rel')!=='stylesheet'){el.remove();return;}const href=el.attr('href');if(href)el.attr('href',asset(href));}
  const src=el.attr('src');if(src)el.attr('src',asset(src));const style=el.attr('style');if(style)el.attr('style',css(style));
 });$('style').each((_i,element)=>$(element).text(css($(element).text())));
 const nonce=randomBytes(18).toString('base64');
 const policy=`default-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'nonce-${nonce}'; base-uri 'none'; form-action 'none'; connect-src 'none'`;
 $('head').prepend(`<meta http-equiv="Content-Security-Policy" content="${esc(policy)}"><meta name="referrer" content="no-referrer"><style>body{overflow-wrap:anywhere}img{max-width:100%;height:auto}</style>`);
 $('body').append(`<script nonce="${nonce}">document.addEventListener('click',function(e){const a=e.target.closest('a[data-night-url],area[data-night-url]');if(a){e.preventDefault();parent.postMessage({type:'night-navigate',url:a.dataset.nightUrl},'*');}});document.addEventListener('submit',e=>e.preventDefault());</script>`);
 return $.html();
}
export async function basicRoute(request,reply){
 reply.header('Cache-Control','no-store').header('X-Content-Type-Options','nosniff').header('Cross-Origin-Resource-Policy','same-origin');
 try{
  let target=validTarget(String(request.query.url||''));let response;
  const signal=AbortSignal.timeout(22000);
  for(let i=0;i<6;i++){response=await requestPage(target,signal);if(response.status>=300&&response.status<400&&response.headers.location){target=validTarget(new URL(response.headers.location,target).href);continue;}break;}
  if(!response||response.status>=300&&response.status<400)throw Error('This website redirected too many times.');
  if(response.status<200||response.status>=300)throw Error(`${target.hostname} returned ${response.status}. Try Scramjet for this website.`);
  const type=String(response.headers['content-type']||'').toLowerCase();
  if(request.query.asset){
   if(type.includes('text/css')){const css=response.body.toString().replace(/url\(\s*(['"]?)(.*?)\1\s*\)/gi,(_m,_q,value)=>{try{return 'url("/api/basic?asset=1&url='+encodeURIComponent(validTarget(new URL(value,target).href).href)+'")';}catch{return 'url("")';}});return reply.type('text/css').send(css);}
   if(/^image\/(png|jpeg|gif|webp|avif|x-icon|vnd.microsoft.icon)(;|$)/.test(type)||/^font\//.test(type))return reply.type(type).send(response.body);
   return reply.code(415).send('Unsupported asset');
  }
  if(!type.includes('text/html')&&!type.includes('text/plain'))throw Error('Basic opens simple webpages. Use Scramjet for this content.');
  const source=type.includes('text/plain')?'<pre>'+esc(response.body.toString())+'</pre>':response.body.toString();
  return {url:target.href,html:sanitizeHtml(source,target.href)};
 }catch(error){return reply.code(400).send({error:error.name==='TimeoutError'?'The website timed out. Try again.':error.message||'Unable to open this page.'});}
}
