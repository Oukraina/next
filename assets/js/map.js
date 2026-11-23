const svgNS = "http://www.w3.org/2000/svg";
const seedNodes = [
  {id:"ouk",title:"Oukraina",type:"idea",description:"Відкрита технологія самоорганізації: середовище, у якому люди, знання та можливості знаходять одне одного.",x:450,y:285},
  {id:"mycelium",title:"Інтелектуальний міцелій",type:"idea",description:"Мережа розподіленого знання, де зв’язки важливіші за централізовану структуру.",x:255,y:150},
  {id:"commons",title:"Спільне надбання",type:"idea",description:"Ресурси та знання, які люди підтримують і розвивають разом.",x:660,y:135},
  {id:"open-projects",title:"Open Projects",type:"project",description:"Незалежні ініціативи, що відкрито показують свій стан, потреби та можливості участі.",x:690,y:365},
  {id:"self-org",title:"Самоорганізація",type:"idea",description:"Координація без єдиного центру: автономні учасники домовляються та діють.",x:450,y:90},
  {id:"nodes",title:"Nodes",type:"community",description:"Автономні вузли мережі: люди, групи, простори та організації.",x:220,y:390},
  {id:"open-source",title:"Open source",type:"tool",description:"Спосіб спільно створювати, перевіряти та вдосконалювати інструменти.",x:455,y:485},
  {id:"knowledge",title:"Knowledge Map",type:"project",description:"Ця експериментальна карта зв’язків між ідеями, проєктами, спільнотами та інструментами.",x:760,y:510}
];
const edges = [["ouk","mycelium"],["ouk","commons"],["ouk","open-projects"],["ouk","self-org"],["ouk","nodes"],["ouk","open-source"],["ouk","knowledge"],["mycelium","commons"],["nodes","open-projects"],["open-source","knowledge"],["self-org","nodes"]];
let nodes = [...seedNodes];
try { const saved = JSON.parse(localStorage.getItem("ouk-map-nodes") || "[]"); if (Array.isArray(saved)) nodes.push(...saved); } catch {}
let activeFilter = "all";
let selectedId = null;
const graph = document.querySelector("#graph");
const edgeLayer = document.querySelector("#edges");
const nodeLayer = document.querySelector("#nodes");
const searchInput = document.querySelector("#search");
const detail = document.querySelector("#detail-panel");
const typeNames = {idea:"Ідея",project:"Проєкт",community:"Спільнота",tool:"Інструмент"};
const nodeById = id => nodes.find(n => n.id === id);
function el(tag,attrs={},parent){const n=document.createElementNS(svgNS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(parent)parent.append(n);return n;}
function render(){
  edgeLayer.replaceChildren(); nodeLayer.replaceChildren();
  const visible = nodes.filter(n => (activeFilter==="all"||n.type===activeFilter) && (n.title+" "+n.description).toLowerCase().includes(searchInput.value.toLowerCase()));
  const visibleIds = new Set(visible.map(n=>n.id));
  edges.forEach(([a,b])=>{const A=nodeById(a),B=nodeById(b);if(!A||!B)return;el("line",{x1:A.x,y1:A.y,x2:B.x,y2:B.y,class:"edge"+(selectedId&&(a===selectedId||b===selectedId)?" is-related":"")},edgeLayer);});
  visible.forEach(n=>{
    const group=el("g",{class:"node"+(selectedId===n.id?" is-selected":"")+(selectedId&& !edges.some(e=>e.includes(selectedId)&&e.includes(n.id))&&selectedId!==n.id?" is-dimmed":""),tabindex:"0",role:"button","aria-label":n.title+" — "+typeNames[n.type],"data-id":n.id},nodeLayer);
    el("circle",{class:"node-ring",cx:n.x,cy:n.y,r:15},group);
    el("circle",{class:"node-core "+n.type,cx:n.x,cy:n.y,r:n.id==="ouk"?8:6},group);
    const label=el("text",{x:n.x,y:n.y+27},group);label.textContent=n.title;
    group.addEventListener("click",()=>selectNode(n.id));
    group.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectNode(n.id);}});
  });
  document.querySelector("#node-count").textContent=String(visible.length).padStart(2,"0")+" NODES · "+edges.length+" LINKS";
}
function selectNode(id){
  selectedId=id; const n=nodeById(id); if(!n)return;
  const related=edges.filter(e=>e.includes(id)).flatMap(e=>e.filter(x=>x!==id)).map(nodeById).filter(Boolean);
  detail.innerHTML="";
  const box=document.createElement("div");box.className="detail-content";
  const eyebrow=document.createElement("span");eyebrow.className="eyebrow";eyebrow.textContent="NODE EXPLORER";box.append(eyebrow);
  const type=document.createElement("span");type.className="detail-type";type.textContent=typeNames[n.type];box.append(type);
  const title=document.createElement("h2");title.textContent=n.title;box.append(title);
  const desc=document.createElement("p");desc.textContent=n.description||"Опис поки не додано.";box.append(desc);
  const meta=document.createElement("div");meta.className="detail-meta";meta.textContent="CONNECTED NODES · "+related.length;box.append(meta);
  const list=document.createElement("div");list.className="related-list";
  related.forEach(r=>{const b=document.createElement("button");b.className="related-link";b.type="button";const dot=document.createElement("i");const t=document.createElement("span");t.textContent=r.title;b.append(dot,t);b.addEventListener("click",()=>selectNode(r.id));list.append(b);});
  box.append(list);detail.append(box);render();
}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{activeFilter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("is-active",x===b));render();}));
searchInput.addEventListener("input",render);
document.addEventListener("keydown",e=>{if(e.key==="/"&&document.activeElement.tagName!=="INPUT"&&document.activeElement.tagName!=="TEXTAREA"){e.preventDefault();searchInput.focus();}if(e.key==="Escape")searchInput.blur();});
const dialog=document.querySelector("#add-dialog");
document.querySelector("#open-add").addEventListener("click",()=>dialog.showModal());
document.querySelector("#close-add").addEventListener("click",()=>dialog.close());
document.querySelector("#add-form").addEventListener("submit",e=>{
  e.preventDefault();const form=e.currentTarget;const data=new FormData(form);const title=String(data.get("title")||"").trim();if(!title)return;
  const angle=nodes.length*2.399;const n={id:"custom-"+Date.now(),title,type:String(data.get("type")),description:String(data.get("description")||"").trim(),x:450+Math.cos(angle)*220,y:285+Math.sin(angle)*185};
  nodes.push(n);edges.push(["ouk",n.id]);
  try{localStorage.setItem("ouk-map-nodes",JSON.stringify(nodes.filter(x=>x.id.startsWith("custom-"))));}catch{}
  form.reset();dialog.close();activeFilter="all";searchInput.value="";document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("is-active",x.dataset.filter==="all"));selectNode(n.id);
});
render();
