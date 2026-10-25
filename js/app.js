(function(){"use strict";
var CSV="https://docs.google.com/spreadsheets/d/e/2PACX-1vQOvsCKoEEhYzuses-MU3nhosdg6s6J4wfcQJfs2t89g9OwKZNCEmw_B8nrIoMAvNV9DvRk2dwn4cBp/pub?output=csv";
var $=function(id){return document.getElementById(id)};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var b=$("burger"),n=$("nav");
if(b)b.addEventListener("click",function(){var o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)});
if(n)n.addEventListener("click",function(e){if(e.target.tagName==="A")n.classList.remove("open")});
if($("year"))$("year").textContent=new Date().getFullYear();
var rv=document.querySelectorAll(".rv");
if("IntersectionObserver" in window){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add("on");io.unobserve(x.target)}})},{threshold:.1});rv.forEach(function(r){io.observe(r)})}else rv.forEach(function(r){r.classList.add("on")});
function parse(t){var rows=[],r=[],c="",q=false;for(var i=0;i<t.length;i++){var ch=t[i],nx=t[i+1];
if(q){if(ch==='"'&&nx==='"'){c+='"';i++}else if(ch==='"')q=false;else c+=ch}
else if(ch==='"')q=true;else if(ch===","){r.push(c);c=""}
else if(ch==="\n"||ch==="\r"){if(ch==="\r"&&nx==="\n")i++;r.push(c);rows.push(r);r=[];c=""}else c+=ch}
if(c!==""||r.length){r.push(c);rows.push(r)}
var h=(rows[0]||[]).map(function(x){return x.trim().toLowerCase()});
return rows.slice(1).filter(function(f){return f.some(function(x){return x.trim()})}).map(function(f){var o={};h.forEach(function(k,i){o[k]=(f[i]||"").trim()});return o})}
function money(v){var x=Number(v);return isNaN(x)?v:"$"+x.toLocaleString("es-AR")}
function load(){return fetch(CSV+"&t="+Date.now()).then(function(r){if(!r.ok)throw 0;return r.text()}).then(parse)}
function slug(s){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
if($("menu")){var st=$("estado");load().then(function(ps){
if(!ps.length){st.textContent="No hay platos cargados todavía.";return}
var cats=new Map();ps.forEach(function(p){var c=p.categoria||"Otros",s=p.subcategoria||"";if(!cats.has(c))cats.set(c,new Map());var m=cats.get(c);if(!m.has(s))m.set(s,[]);m.get(s).push(p)});
cats.forEach(function(subs,c){var id=slug(c),a=el("a",null,c);a.href="#"+id;$("pills").appendChild(a);
var s=el("section","cat");s.id=id;s.appendChild(el("h2",null,c));
subs.forEach(function(items,sn){if(sn)s.appendChild(el("h3","sub",sn));
items.forEach(function(p){var no=(p.disponible||"").toUpperCase()==="NO",it=el("div","it"+(no?" out":"")),i=el("div");
i.appendChild(el("strong",null,p.plato+(no?" · Agotado":"")));if(p.descripcion)i.appendChild(el("span","d",p.descripcion));
it.appendChild(i);it.appendChild(el("div","p",money(p.precio)));s.appendChild(it)})});
$("menu").appendChild(s)});st.textContent=""}).catch(function(){st.textContent="No se pudo cargar el menú. Intentá de nuevo en unos minutos."})}
if($("dest")){var se=$("destEstado");load().then(function(ps){
var ok=ps.filter(function(p){return(p.disponible||"").toUpperCase()!=="NO"}),m=ok.filter(function(p){return(p.destacado||"").toUpperCase()==="SI"}),sel=(m.length?m:ok).slice(0,6);
if(!sel.length){se.textContent="Mirá el menú completo.";return}
sel.forEach(function(p){var d=el("article","dish");d.appendChild(el("h3",null,p.plato));if(p.descripcion)d.appendChild(el("p",null,p.descripcion));d.appendChild(el("b",null,money(p.precio)));$("dest").appendChild(d)});se.hidden=true}).catch(function(){se.textContent="No pudimos cargar el menú. Mirá el menú completo."})}
if($("gal")){fetch("data/galeria.json",{cache:"no-cache"}).then(function(r){return r.json()}).then(function(l){
l.forEach(function(x){var f=el("figure");
if(x.src){var i=el("img");i.src=x.src;i.alt=x.titulo||"";i.loading="lazy";f.appendChild(i)}else{var s=el("div","soon");s.appendChild(el("strong",null,x.titulo||"Foto"));s.appendChild(el("span",null,"Próximamente"));f.appendChild(s)}
if(x.src&&x.titulo)f.appendChild(el("figcaption",null,x.titulo));$("gal").appendChild(f)});$("galEstado").hidden=true}).catch(function(){$("galEstado").textContent="No pudimos cargar la galería."})}
})();
