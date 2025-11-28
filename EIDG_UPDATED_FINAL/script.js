
const MUNICIPIOS = ["apodaca", "apodaca", "cadereyta jim\u00e9nez", "el carmen", "garc\u00eda", "general escobedo", "guadalupe", "ju\u00e1rez", "monterrey", "salinas victoria", "san nicol\u00e1s de los garza", "san pedro garza garc\u00eda", "santa catarina", "santiago", "pesqueria", "pesqueria"];

function onlyDigits(s){ return (s||'').replace(/\D/g,''); }

function classifyLines(lines){
  let res = {nombre:'',calle:'',numero:'',colonia:'',municipio:'',estado:'',cp:'',telefono:''};
  let used = new Array(lines.length).fill(false);

  for(let i=0;i<lines.length;i++){ let d=onlyDigits(lines[i]); if(d.length>=7 && d.length<=15){ res.telefono = lines[i]; used[i]=true; break; } }
  for(let i=0;i<lines.length;i++){ if(used[i]) continue; let d=onlyDigits(lines[i]); if(d.length===5){ res.cp = d; used[i]=true; break; } }
  for(let i=0;i<lines.length;i++){ if(used[i]) continue; let L=lines[i].toLowerCase(); for(let m of MUNICIPIOS){ if(L.includes(m)){ res.municipio = lines[i]; used[i]=true; break; } } }
  for(let i=0;i<lines.length;i++){ if(used[i]) continue; let d=onlyDigits(lines[i]); if(d.length>0 && d.length<=4){ res.numero = d; used[i]=true; break; } }
  const coloniaKeywords = ['col','colonia','fracc','fraccionamiento','priv','mza','manzana','barrio'];
  for(let i=0;i<lines.length;i++){ if(used[i]) continue; let L=lines[i].toLowerCase(); for(let kw of coloniaKeywords){ if(L.includes(kw)){ res.colonia = lines[i]; used[i]=true; break; } } }
  const STATES = ['nuevo león','nuevo leon','jalisco','cdmx','ciudad de méxico','coahuila','querétaro','queretaro'];
  for(let i=0;i<lines.length;i++){ if(used[i]) continue; let L=lines[i].toLowerCase(); for(let s of STATES){ if(L.includes(s)){ res.estado = lines[i]; used[i]=true; break; } } }
  for(let i=0;i<lines.length;i++){ if(used[i]) continue; if(!res.nombre){ res.nombre = lines[i]; used[i]=true; continue; } }
  for(let i=0;i<lines.length;i++){ if(used[i]) continue; if(!res.calle){ res.calle = lines[i]; used[i]=true; continue; } }
  for(let i=0;i<lines.length;i++){ if(used[i]) continue; if(!res.estado){ res.estado = lines[i]; used[i]=true; continue; } }
  return res;
}

function fillFromRaw(id){
  let raw = document.getElementById(id).value.split('\n').map(s=>s.trim()).filter(Boolean);
  raw = raw.map(r => r.replace(/\s*\$\d+/,'').trim());
  let parsed = classifyLines(raw);
  for(let k in parsed){ let el=document.getElementById(k); if(el) el.value = parsed[k]; }
  if(document.getElementById('paca')) calcTotal();
}

function autoMunicipioSelect(selectId){
  let sel = document.getElementById(selectId).value;
  if(!sel) return;
  let name = sel.split(' $')[0];
  let price = sel.split('$')[1] || '';
  if(document.getElementById('municipio')) document.getElementById('municipio').value = name;
  if(document.getElementById('envio')) document.getElementById('envio').value = price;
  calcTotal();
}

function calcTotal(){
  let p = parseFloat(document.getElementById('paca')?.value) || 0;
  let c = parseFloat(document.getElementById('costo')?.value) || 0;
  let e = parseFloat(document.getElementById('envio')?.value) || 0;
  let tot = p + c + e;
  if(document.getElementById('total')) document.getElementById('total').value = tot.toFixed(2);
}

function openWA(msg){ let tel='528110281462'; window.open('https://wa.me/'+tel+'?text='+encodeURIComponent(msg),'_blank'); }

function sendWANacional(){
  let pkg = document.getElementById('paqueteria')?.value || '';
  let f = new Date().toLocaleDateString('es-MX');
  let lines = [
    `*1 GUIA 45 KG (${pkg})*`,'',
    document.getElementById('nombre')?.value || '',
    document.getElementById('calle')?.value || '',
    document.getElementById('numero')?.value || '',
    document.getElementById('colonia')?.value || '',
    document.getElementById('municipio')?.value || '',
    document.getElementById('estado')?.value || '',
    document.getElementById('cp')?.value || '',
    document.getElementById('telefono')?.value || '',
    '',
    `📦PACA: ${document.getElementById('paca')?.value || ''}`,
    `☑️COSTO: ${document.getElementById('costo')?.value || ''}`,
    `🚚ENVÍO: ${document.getElementById('envio')?.value || ''}`,
    `✅TOTAL: ${document.getElementById('total')?.value || ''}`,
    '','('+pkg+')','',`*${f}*`
  ];
  openWA(lines.join('\n'));
}

function sendWALocal(){
  let dia = document.querySelector('input[name="dia"]:checked')?.value || '';
  let horario = document.getElementById('horario')?.value || '';
  let f = new Date().toLocaleDateString('es-MX');
  let lines = [
    `*ENTREGA PARA ${dia} ${horario}*`,'',
    document.getElementById('nombre')?.value || '',
    document.getElementById('calle')?.value || '',
    document.getElementById('numero')?.value || '',
    document.getElementById('colonia')?.value || '',
    document.getElementById('municipio')?.value || '',
    document.getElementById('telefono')?.value || '',
    '',
    `📦PACA: ${document.getElementById('paca')?.value || ''}`,
    `☑️COSTO: ${document.getElementById('costo')?.value || ''}`,
    `🚚ENVÍO: ${document.getElementById('envio')?.value || ''}`,
    `✅TOTAL: ${document.getElementById('total')?.value || ''}`,
    '','Paga al recibir','',`*${f}*`
  ];
  openWA(lines.join('\n'));
}
