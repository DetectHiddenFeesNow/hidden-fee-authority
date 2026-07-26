const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const ROOT='C:/vhub',PORT=3456,API_KEY='sentinel-agent-v1',LOG='C:/vhub/logs/agent.log';
const LOG_DIR='C:/vhub/logs';
try{fs.mkdirSync(LOG_DIR,{recursive:true})}catch(e){}
function log(op,file,status,msg){
 const t=new Date().toISOString();
 fs.appendFileSync(LOG,t+' | '+(msg||'')+' | '+op+' | '+file+' | '+(status?'OK':'FAIL')+'\n');
}
function sec(p){
 const r=path.resolve(ROOT,p);
 if(!r.startsWith(ROOT))throw new Error('Access denied');
 return r;
}
function serve(req,res){
 res.setHeader('Content-Type','application/json');
 res.setHeader('Access-Control-Allow-Origin','*');
 res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
 res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
 if(req.method==='OPTIONS'){res.end('{}');return}
 if(req.headers['authorization']!=='Bearer '+API_KEY&&req.url!=='/api/ping'){
  res.statusCode=403;res.end(JSON.stringify({error:'Invalid or missing API key'}));return
 }
 let b='';
 req.on('data',function(d){b+=d});
 req.on('end',function(){
  try{
   var data={};
   if(b)data=JSON.parse(b);
   var result=handle(req.url,data);
   log(req.url,data.path||'','success',result.status||'ok');
   res.end(JSON.stringify(result));
  }catch(e){
   log(req.url,'','failed',e.message);
   res.statusCode=400;
   res.end(JSON.stringify({error:e.message}));
  }
 });
}
function handle(url,data){
 if(url==='/api/ping')return{status:'ok',agent:'sentinel-agent-v1',root:ROOT};
 if(url==='/api/write-file'){
  var p=sec(data.path);fs.mkdirSync(path.dirname(p),{recursive:true});
  fs.writeFileSync(p,data.content);return{success:true,path:data.path,bytes:data.content.length};
 }
 if(url==='/api/read-file'){
  var p=sec(data.path);var c=fs.readFileSync(p,'utf8');
  return{success:true,content:c,bytes:c.length};
 }
 if(url==='/api/list-files'){
  var p=sec(data.path||'');
  var files=fs.readdirSync(p,{withFileTypes:true}).map(function(f){
   var s={};
   try{s=fs.statSync(path.join(p,f.name))}catch(e){}
   return{name:f.name,isDirectory:f.isDirectory(),size:s.size||0,modified:s.mtime||null};
  });
  return{success:true,files:files};
 }
 if(url==='/api/run-script'){
  var allowed=['scripts/master_verify.js','scripts/release_gate.js','scripts/page_generator.js'];
  if(allowed.indexOf(data.script)<0)throw new Error('Script not in allowed list');
  var p=sec(data.script);
  var cmd='node '+p+(data.args?' '+data.args:'');
  var r=require('child_process').execSync(cmd,{cwd:ROOT,timeout:30000});
  return{success:true,stdout:r.toString().trim()};
 }
 if(url==='/api/git-status'){
  var r=require('child_process').execSync('git status --short',{cwd:ROOT,timeout:10000});
  var o=r.toString().trim();
  return{success:true,status:o,lines:o?o.split('\n').length:0};
 }
 if(url==='/api/git-commit'){
  if(!data.message)throw new Error('Commit message required');
  require('child_process').execSync('git add -A',{cwd:ROOT,timeout:10000});
  var r=require('child_process').execSync('git commit -m "'+data.message+'"',{cwd:ROOT,timeout:10000});
  return{success:true,output:r.toString().trim()};
 }
 if(url==='/api/git-push'){
  var r=require('child_process').execSync('git push origin main',{cwd:ROOT,timeout:30000});
  return{success:true,output:r.toString().trim()};
 }
 throw new Error('Unknown endpoint: '+url);
}
http.createServer(serve).listen(PORT,function(){
 console.log('Agent running on port '+PORT);
 console.log('Root: '+ROOT);
 console.log('Log: '+LOG);
});
