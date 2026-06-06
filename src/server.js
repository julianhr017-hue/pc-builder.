require('dotenv').config();
const express=require('express');
const cors=require('cors');
const morgan=require('morgan');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const fs=require('fs');
const path=require('path');

const app=express();
const PORT=process.env.PORT||3000;
const JWT_SECRET=process.env.JWT_SECRET||'EXTREMIS_DEV_SECRET';
const JWT_EXPIRES_IN=process.env.JWT_EXPIRES_IN||'2h';

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public')));

const usersFile=path.join(__dirname,'data','users.json');
const buildsFile=path.join(__dirname,'data','builds.json');
function ensure(file){ if(!fs.existsSync(file)) fs.writeFileSync(file,'[]','utf8'); }
function read(file){ ensure(file); return JSON.parse(fs.readFileSync(file,'utf8')||'[]'); }
function write(file,data){ ensure(file); fs.writeFileSync(file,JSON.stringify(data,null,2),'utf8'); }
function publicUser(u){ return {id:u.id,name:u.name,email:u.email,role:u.role,createdAt:u.createdAt}; }
function tokenFor(u){ return jwt.sign({id:u.id,email:u.email,role:u.role},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN}); }
function auth(req,res,next){
  const header=req.headers.authorization||'';
  const [type,token]=header.split(' ');
  if(type!=='Bearer'||!token) return res.status(401).json({ok:false,message:'Token no proporcionado. Usa Authorization: Bearer TOKEN.'});
  try{ req.user=jwt.verify(token,JWT_SECRET); next(); }
  catch(e){ return res.status(401).json({ok:false,message:'Token inválido o expirado.',error:e.message}); }
}
function admin(req,res,next){ if(req.user.role!=='admin') return res.status(403).json({ok:false,message:'Acceso denegado. Se requiere rol administrador.'}); next(); }

const parts={
 cpus:[{id:'',name:'Selecciona procesador',socket:'',ram:'',tdp:0,igpu:false},{id:'r5_5600',name:'AMD Ryzen 5 5600',socket:'AM4',ram:'DDR4',tdp:65,igpu:false},{id:'r5_7600',name:'AMD Ryzen 5 7600',socket:'AM5',ram:'DDR5',tdp:65,igpu:true},{id:'r7_7800x3d',name:'AMD Ryzen 7 7800X3D',socket:'AM5',ram:'DDR5',tdp:120,igpu:true},{id:'i5_12400f',name:'Intel Core i5-12400F',socket:'LGA1700',ram:'DDR4/DDR5',tdp:65,igpu:false},{id:'i5_13600k',name:'Intel Core i5-13600K',socket:'LGA1700',ram:'DDR4/DDR5',tdp:125,igpu:true}],
 boards:[{id:'',name:'Selecciona placa madre',socket:'',ram:'',form:'',m2:0},{id:'b550m',name:'B550M AM4 DDR4',socket:'AM4',ram:'DDR4',form:'mATX',m2:1},{id:'x570_atx',name:'X570 ATX AM4 DDR4',socket:'AM4',ram:'DDR4',form:'ATX',m2:2},{id:'b650_atx',name:'B650 ATX AM5 DDR5',socket:'AM5',ram:'DDR5',form:'ATX',m2:2},{id:'x670_atx',name:'X670 ATX AM5 DDR5',socket:'AM5',ram:'DDR5',form:'ATX',m2:3},{id:'h610_ddr4',name:'H610 LGA1700 DDR4',socket:'LGA1700',ram:'DDR4',form:'mATX',m2:1},{id:'b760_ddr5',name:'B760 LGA1700 DDR5',socket:'LGA1700',ram:'DDR5',form:'ATX',m2:2},{id:'z790_ddr5',name:'Z790 LGA1700 DDR5',socket:'LGA1700',ram:'DDR5',form:'ATX',m2:3}],
 ram:[{id:'',name:'Selecciona memoria RAM',type:'',capacity:0},{id:'ddr4_16',name:'16 GB DDR4 3200 MHz',type:'DDR4',capacity:16},{id:'ddr4_32',name:'32 GB DDR4 3600 MHz',type:'DDR4',capacity:32},{id:'ddr5_16',name:'16 GB DDR5 5600 MHz',type:'DDR5',capacity:16},{id:'ddr5_32',name:'32 GB DDR5 6000 MHz',type:'DDR5',capacity:32}],
 gpus:[{id:'',name:'Sin tarjeta gráfica seleccionada',tdp:0,psu:0,length:0},{id:'rx6600',name:'AMD Radeon RX 6600',tdp:132,psu:500,length:240},{id:'rtx4060',name:'NVIDIA GeForce RTX 4060',tdp:115,psu:550,length:250},{id:'rtx4070s',name:'NVIDIA GeForce RTX 4070 Super',tdp:220,psu:650,length:300},{id:'rx7800xt',name:'AMD Radeon RX 7800 XT',tdp:263,psu:700,length:320},{id:'rtx4080s',name:'NVIDIA GeForce RTX 4080 Super',tdp:320,psu:750,length:340}],
 psus:[{id:'',name:'Selecciona fuente de poder',watts:0},{id:'500b',name:'500W 80+ Bronze',watts:500},{id:'550b',name:'550W 80+ Bronze',watts:550},{id:'650g',name:'650W 80+ Gold',watts:650},{id:'750g',name:'750W 80+ Gold',watts:750},{id:'850g',name:'850W 80+ Gold',watts:850}],
 cases:[{id:'',name:'Selecciona gabinete',supports:[],gpuMax:0},{id:'matx_compact',name:'Gabinete compacto mATX',supports:['mATX'],gpuMax:280},{id:'mid_atx',name:'Gabinete Mid Tower ATX',supports:['ATX','mATX'],gpuMax:330},{id:'large_atx',name:'Gabinete grande ATX',supports:['ATX','mATX'],gpuMax:380}],
 coolers:[{id:'',name:'Selecciona disipador',sockets:[],tdp:0},{id:'stock_am4',name:'Disipador stock AM4/AM5 básico',sockets:['AM4','AM5'],tdp:90},{id:'air_150',name:'Disipador de aire 150W',sockets:['AM4','AM5','LGA1700'],tdp:150},{id:'air_220',name:'Disipador torre 220W',sockets:['AM4','AM5','LGA1700'],tdp:220},{id:'aio_240',name:'Enfriamiento líquido 240 mm',sockets:['AM4','AM5','LGA1700'],tdp:260}],
 storage:[{id:'',name:'Selecciona almacenamiento',type:'',watts:0},{id:'ssd_sata_1tb',name:'SSD SATA 1 TB',type:'SATA',watts:4},{id:'nvme_1tb',name:'SSD NVMe M.2 1 TB',type:'M.2',watts:6},{id:'nvme_2tb',name:'SSD NVMe M.2 2 TB',type:'M.2',watts:8}]
};
function part(list,id){return parts[list].find(x=>x.id===id)||parts[list][0];}
function estimate(sel){const cpu=part('cpus',sel.cpu),gpu=part('gpus',sel.gpu),st=part('storage',sel.storage);return Math.round(90+(cpu.tdp||0)+(gpu.tdp||0)+(st.watts||0));}
function psuRec(sel){const gpu=part('gpus',sel.gpu);return Math.max(gpu.psu||0,Math.ceil((estimate(sel)*1.45)/50)*50,450);}
function analyze(sel={}){
 const cpu=part('cpus',sel.cpu), board=part('boards',sel.board), ram=part('ram',sel.ram), gpu=part('gpus',sel.gpu), psu=part('psus',sel.psu), pcCase=part('cases',sel.case), cooler=part('coolers',sel.cooler), storage=part('storage',sel.storage);
 const results=[]; let checks=0,passed=0;
 const add=(type,title,message)=>results.push({type,title,message});
 const chk=(cond,okT,okM,badT,badM)=>{checks++; if(cond){passed++; add('ok',okT,okM)} else add('bad',badT,badM)};
 if(cpu.id&&board.id) chk(cpu.socket===board.socket,'Socket compatible',`${cpu.name} usa ${cpu.socket} y la placa también.`,'Socket incompatible',`${cpu.name} usa ${cpu.socket}, pero la placa usa ${board.socket}.`); else add('warn','CPU o placa incompleta','Selecciona procesador y placa madre.');
 if(board.id&&ram.id) chk(board.ram===ram.type,'RAM compatible',`La placa soporta ${board.ram} y la RAM seleccionada es ${ram.type}.`,'RAM incompatible',`La placa usa ${board.ram}, pero seleccionaste ${ram.type}.`); else add('warn','RAM incompleta','Selecciona placa y RAM.');
 if(board.id&&pcCase.id) chk(pcCase.supports.includes(board.form),'Gabinete compatible',`El gabinete soporta ${board.form}.`,'Gabinete incompatible',`La placa es ${board.form}, pero el gabinete no lo soporta.`); else add('warn','Gabinete incompleto','Selecciona placa y gabinete.');
 if(gpu.id&&pcCase.id) chk(gpu.length<=pcCase.gpuMax,'GPU cabe en gabinete',`GPU ${gpu.length} mm / gabinete ${pcCase.gpuMax} mm.`,'GPU demasiado grande',`GPU ${gpu.length} mm / gabinete ${pcCase.gpuMax} mm.`); else if(!gpu.id)add('warn','GPU no seleccionada','Si el CPU no tiene gráficos integrados, necesitarás GPU.');
 const watts=estimate(sel), recommended=psuRec(sel);
 if(psu.id) chk(psu.watts>=recommended,'Fuente suficiente',`Fuente ${psu.watts}W / recomendado ${recommended}W.`,'Fuente insuficiente',`Fuente ${psu.watts}W / recomendado ${recommended}W.`); else add('warn','Fuente no seleccionada',`Se recomienda al menos ${recommended}W.`);
 if(cpu.id&&cooler.id) chk(cooler.sockets.includes(cpu.socket)&&cooler.tdp>=cpu.tdp,'Enfriamiento adecuado',`Soporta ${cpu.socket} y ${cooler.tdp}W.`,'Enfriamiento insuficiente',`CPU ${cpu.socket} ${cpu.tdp}W; el disipador no cumple.`); else add('warn','Disipador incompleto','Selecciona CPU y disipador.');
 if(cpu.id&&!cpu.igpu&&!gpu.id){checks++; add('bad','Falta tarjeta gráfica',`${cpu.name} no tiene gráficos integrados.`)} else if(cpu.id&&(cpu.igpu||gpu.id)){checks++;passed++;add('ok','Salida de video cubierta',gpu.id?'Hay GPU dedicada.':'El CPU tiene gráficos integrados.');}
 if(storage.id&&storage.type==='M.2'&&board.id) chk(board.m2>0,'SSD M.2 compatible',`La placa tiene ${board.m2} ranura(s) M.2.`,'Sin ranura M.2','La placa no indica ranuras M.2.');
 return {score:checks?Math.round((passed/checks)*100):0,estimatedWatts:watts,recommendedPsu:recommended,selected:{cpu,board,ram,gpu,psu,case:pcCase,cooler,storage},results};
}
function suggestions(sel={}){
 const cpu=part('cpus',sel.cpu),board=part('boards',sel.board),gpu=part('gpus',sel.gpu); const out=[];
 if(cpu.id&&!board.id) out.push({title:'Placas compatibles',items:parts.boards.filter(b=>b.id&&b.socket===cpu.socket).map(b=>b.name)});
 if(board.id&&!sel.cpu) out.push({title:'Procesadores compatibles',items:parts.cpus.filter(c=>c.id&&c.socket===board.socket).map(c=>c.name)});
 if(board.id&&!sel.ram) out.push({title:'Memorias compatibles',items:parts.ram.filter(r=>r.id&&r.type===board.ram).map(r=>r.name)});
 if(gpu.id&&!sel.psu){const min=psuRec(sel);out.push({title:'Fuentes recomendadas',items:parts.psus.filter(p=>p.id&&p.watts>=min).map(p=>p.name)});}
 return out.length?out:[{title:'Sin pendientes graves',items:['La selección está completa o faltan datos para sugerir alternativas.']}];
}

app.get('/api',(req,res)=>res.json({ok:true,app:'EXTREMIS Final Fusion',message:'API funcionando.'}));
app.post('/api/auth/register',async(req,res)=>{try{const{name,email,password,role}=req.body;if(!name||!email||!password)return res.status(400).json({ok:false,message:'Nombre, correo y contraseña son obligatorios.'});if(password.length<6)return res.status(400).json({ok:false,message:'La contraseña debe tener al menos 6 caracteres.'});const users=read(usersFile);if(users.find(u=>u.email.toLowerCase()===email.toLowerCase()))return res.status(409).json({ok:false,message:'El correo ya está registrado.'});const user={id:Date.now().toString(),name,email,password:await bcrypt.hash(password,10),role:role==='admin'?'admin':'user',createdAt:new Date().toISOString()};users.push(user);write(usersFile,users);res.status(201).json({ok:true,message:'Usuario registrado correctamente.',token:tokenFor(user),user:publicUser(user)});}catch(e){res.status(500).json({ok:false,message:'Error al registrar usuario.',error:e.message})}});
app.post('/api/auth/login',async(req,res)=>{const{email,password}=req.body;const user=read(usersFile).find(u=>u.email.toLowerCase()===(email||'').toLowerCase());if(!user||!(await bcrypt.compare(password||'',user.password)))return res.status(401).json({ok:false,message:'Credenciales inválidas.'});res.json({ok:true,message:'Inicio de sesión correcto.',token:tokenFor(user),user:publicUser(user)});});
app.get('/api/users/me',auth,(req,res)=>{const user=read(usersFile).find(u=>u.id===req.user.id);if(!user)return res.status(404).json({ok:false,message:'Usuario no encontrado.'});res.json({ok:true,message:'Perfil obtenido correctamente.',user:publicUser(user)});});
app.get('/api/users',auth,admin,(req,res)=>res.json({ok:true,message:'Usuarios obtenidos correctamente.',users:read(usersFile).map(publicUser)}));
app.get('/api/users/admin',auth,admin,(req,res)=>res.json({ok:true,message:'Panel administrador autorizado.',stats:{users:read(usersFile).length,builds:read(buildsFile).length,generatedAt:new Date().toISOString()}}));
app.get('/api/pc/parts',(req,res)=>res.json({ok:true,message:'Catálogo cargado.',parts}));
app.post('/api/pc/analyze',(req,res)=>res.json({ok:true,message:'Análisis generado.',analysis:analyze(req.body.selection||{})}));
app.post('/api/pc/suggest',(req,res)=>res.json({ok:true,message:'Sugerencias generadas.',recommendations:suggestions(req.body.selection||{})}));
app.get('/api/builds',auth,(req,res)=>res.json({ok:true,message:'Armados del usuario obtenidos.',builds:read(buildsFile).filter(b=>b.userId===req.user.id)}));
app.post('/api/builds',auth,(req,res)=>{const builds=read(buildsFile);const build={id:Date.now().toString(),userId:req.user.id,name:req.body.name||'Armado EXTREMIS',parts:req.body.parts||{},analysis:req.body.analysis||{},createdAt:new Date().toISOString()};builds.push(build);write(buildsFile,builds);res.status(201).json({ok:true,message:'Armado guardado correctamente.',build});});
app.get('/api/builds/admin/all',auth,admin,(req,res)=>res.json({ok:true,message:'Todos los armados obtenidos.',builds:read(buildsFile)}));
app.post('/api/contact',(req,res)=>{const{name,email,message,subject}=req.body;if(!name||!email||!message)return res.status(400).json({ok:false,message:'Nombre, correo y mensaje son obligatorios.'});res.json({ok:true,message:'Consulta recibida en modo demostración.',ticket:{id:Date.now().toString(),name,email,subject:subject||'Consulta general',receivedAt:new Date().toISOString()}});});
app.use((req,res)=>{if(req.path.startsWith('/api'))return res.status(404).json({ok:false,message:'Ruta API no encontrada.'});res.sendFile(path.join(__dirname,'..','public','index.html'));});
app.listen(PORT,()=>console.log(`EXTREMIS Final Fusion iniciado en http://localhost:${PORT}`));
