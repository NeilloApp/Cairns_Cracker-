const MASTER={flour:830,cornmeal:43,water:471,salt:21,sugar:10,vegOil:56,oliveOil:16};
const BASE_YEAST={24:2.8,48:1.9,72:1.25};
const SEASONS={
  hot:{
    label:'Summer / hot',
    yeastMult:.85,
    bench:'10–15 min bench rest; use cold water and refrigerate promptly.',
    dryMin:180,
    dryText:'Start with about 3 hours uncovered. In humid Cairns conditions, keep drying until the skin is dry and firm.',
    note:'High Cairns heat and humidity: reduce yeast, keep dough cold and give the rolled skins extra uncovered fridge time.'
  },
  mild:{
    label:'Mild',
    yeastMult:1.00,
    bench:'20 min bench rest; standard cool-water method.',
    dryMin:120,
    dryText:'Start with about 2 hours uncovered, then check the surface. Cover only once the skin feels dry and firm.',
    note:'Standard Cairns setting. Use the skin check rather than the clock alone.'
  },
  cool:{
    label:'Winter / cooler',
    yeastMult:1.10,
    bench:'20–25 min bench rest; cool water is fine.',
    dryMin:90,
    dryText:'Start with about 90 minutes uncovered. If still soft or tacky, keep drying before covering.',
    note:'Cooler conditions slow fermentation and surface drying, so yeast is raised slightly while the skin still needs a dryness check.'
  }
};
const SKIN_CURE_BEFORE_COOK={24:12,48:18,72:20};
let mode=48,lastTimeline=[];
const $=id=>document.getElementById(id);
const round=(n,d=1)=>{const p=10**d;return Math.round(n*p)/p}
const grams=n=>n<10?round(n,1).toFixed(1):Math.round(n).toString();

function localInput(d){
  const z=new Date(d.getTime()-d.getTimezoneOffset()*60000);
  return z.toISOString().slice(0,16);
}
function nextCook(){
  const d=new Date();
  d.setDate(d.getDate()+2);
  d.setHours(19,0,0,0);
  return d;
}
$('cook').value=localInput(nextCook());

function fmtDate(d){
  return d.toLocaleString('en-AU',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hour12:false});
}
function back(d,h=0,m=0){return new Date(d.getTime()-(h*60+m)*60000)}
function add(d,h=0,m=0){return new Date(d.getTime()+(h*60+m)*60000)}

function buildTimeline(cook,hours,seasonKey){
  const season=SEASONS[seasonKey];
  const mixStart=back(cook,hours);
  const bench=(seasonKey==='hot'?15:(seasonKey==='cool'?25:20));
  // Mix sequence before bench is ~21 min; ball after chosen bench.
  const ballFridge=add(mixStart,0,21+bench);

  // Keep rolled-skin work close to pizza night.
  const coverTarget=back(cook,SKIN_CURE_BEFORE_COOK[hours]);
  const dryStart=back(coverTarget,0,season.dryMin);
  const rollStart=back(dryStart,0,30);
  const relax=back(rollStart,0,25);

  const preheat=back(cook,1);
  const firstSkins=back(cook,0,30);
  const topping=back(cook,0,15);

  return [
    [mixStart,'Start dough','Begin the KitchenAid mixing sequence.'],
    [ballFridge,'Ball & refrigerate','Divide into dough balls and refrigerate immediately.'],
    [relax,'Relax dough balls','Take the dough balls from the fridge for 20–30 minutes.'],
    [rollStart,'Roll + dock skins','Roll to 12 in / 30.5 cm, 2–3 mm thick, then dock thoroughly.'],
    [dryStart,'Start uncovered fridge dry',season.dryText],
    [coverTarget,'Skin check','If dry + firm: loosely cover. If soft/tacky: keep uncovered. If brittle: cover now.'],
    [preheat,'Preheat Ovana','Aim for a 320–340°C stone.'],
    [firstSkins,'Take first two skins out','Leave the others chilled until needed.'],
    [topping,'Begin topping','Use restrained sauce and toppings to protect the crisp centre.'],
    [cook,'Start cooking','Turn the flame down once the pizza goes in; rotate frequently.']
  ];
}

function calculate(){
  const count=Math.max(1,+$('pizzas').value||6);
  const factor=count/6;
  const cook=new Date($('cook').value);
  const seasonKey=$('season').value;
  const season=SEASONS[seasonKey];
  const yeast=BASE_YEAST[mode]*season.yeastMult;

  if(!isFinite(cook.getTime())) return;

  const total=(MASTER.flour+MASTER.cornmeal+MASTER.water+MASTER.salt+MASTER.sugar+MASTER.vegOil+MASTER.oliveOil+yeast)*factor;
  const ball=total/count;

  $('profile').innerHTML=
    `<strong>${mode}-Hour Cairns Cracker</strong><br>`+
    `${count} × 12-inch pizzas • ~${grams(ball)} g each<br>`+
    `<span class="small">${season.label} • yeast ${grams(yeast*factor)} g • rolled-skin dry target: ${season.dryMin} min minimum</span>`;

  const vals=[
    ['Lighthouse Bread & Pizza Flour',MASTER.flour],
    ['Traditional cornmeal',MASTER.cornmeal],
    ['Cool water',MASTER.water],
    ['Instant dry yeast',yeast],
    ['Salt',MASTER.salt],
    ['Sugar',MASTER.sugar],
    ['Vegetable oil',MASTER.vegOil],
    ['Olive oil',MASTER.oliveOil],
  ];
  $('ingredients').innerHTML=vals.map(([n,v])=>`<div class="ingredient"><span>${n}</span><b>${grams(v*factor)} g</b></div>`).join('');

  const pct=[
    ['Water hydration',MASTER.water/MASTER.flour*100],
    ['Cornmeal',MASTER.cornmeal/MASTER.flour*100],
    ['Salt',MASTER.salt/MASTER.flour*100],
    ['Sugar',MASTER.sugar/MASTER.flour*100],
    ['Vegetable oil',MASTER.vegOil/MASTER.flour*100],
    ['Olive oil',MASTER.oliveOil/MASTER.flour*100],
    ['Yeast',yeast/MASTER.flour*100]
  ];
  $('bakers').innerHTML=pct.map(([n,v])=>`<div class="pct"><span>${n}</span><b>${v.toFixed(2)}%</b></div>`).join('');

  lastTimeline=buildTimeline(cook,mode,seasonKey);
  $('timelineSummary').innerHTML=`<b>${mode} h mode</b> • ${season.label} • cook ${fmtDate(cook)}`;
  $('timelineOut').innerHTML=lastTimeline.map(([d,title,note])=>`<div class="time"><strong>${fmtDate(d)}</strong>${title}<br><em>${note}</em></div>`).join('');

  $('benchBreak').textContent=season.bench;
  $('seasonNote').innerHTML=`<strong>${season.label}</strong><br>${season.note}`;
  $('dryRule').textContent=season.dryText;
  $('skinSeasonAdvice').innerHTML=
    `<strong>${season.label} skin rule</strong><br>`+
    `Minimum uncovered fridge dry: <b>${season.dryMin} minutes</b>. `+
    `Do not cover by the clock alone — cover only when the surface has become dry and the skin has firmed.`;
}

document.querySelectorAll('.mode').forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll('.mode').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  mode=+btn.dataset.hours;
  calculate();
});
$('calc').onclick=calculate;
$('season').onchange=calculate;
$('cook').onchange=calculate;
$('pizzas').onchange=calculate;

document.querySelectorAll('nav button').forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tab').forEach(x=>x.classList.add('hidden'));
  $(btn.dataset.tab).classList.remove('hidden');
});

function getSaved(){
  try{return JSON.parse(localStorage.getItem('cc-v3-nights')||'[]')}
  catch{return []}
}
function showSaved(){
  const arr=getSaved();
  $('saved').innerHTML=arr.length
    ? arr.map((x,i)=>`<div class="savedItem"><div><b>${x.hours}h • ${x.pizzas} pizzas</b><br><span class="small">${x.cook} • ${x.seasonLabel}</span></div><div><button onclick="loadNight(${i})">Load</button> <button onclick="deleteNight(${i})">×</button></div></div>`).join('')
    : '<span class="small">No saved nights yet.</span>';
}
window.loadNight=i=>{
  const x=getSaved()[i];
  $('pizzas').value=x.pizzas;
  $('cook').value=x.rawCook;
  $('season').value=x.season;
  mode=x.hours;
  document.querySelectorAll('.mode').forEach(b=>b.classList.toggle('active',+b.dataset.hours===mode));
  calculate();
  window.scrollTo({top:0,behavior:'smooth'});
}
window.deleteNight=i=>{
  const a=getSaved();a.splice(i,1);
  localStorage.setItem('cc-v3-nights',JSON.stringify(a));showSaved();
}
$('saveNight').onclick=()=>{
  let a=getSaved();
  const cook=new Date($('cook').value);
  const season=$('season').value;
  a.unshift({
    hours:mode,
    pizzas:+$('pizzas').value,
    season,
    seasonLabel:SEASONS[season].label,
    cook:fmtDate(cook),
    rawCook:$('cook').value
  });
  a=a.slice(0,8);
  localStorage.setItem('cc-v3-nights',JSON.stringify(a));
  showSaved();
  $('saveMsg').textContent='Pizza night saved on this device.';
};

function icsDate(d){return d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}
function escapeICS(s){return s.replace(/,/g,'\\,').replace(/;/g,'\\;').replace(/\n/g,'\\n')}
$('calendarBtn').onclick=()=>{
  calculate();
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Cairns Cracker V3//EN','CALSCALE:GREGORIAN'];
  lastTimeline.forEach(([d,title,note],i)=>{
    const end=add(d,0,20);
    lines.push(
      'BEGIN:VEVENT',
      'UID:ccv3-'+d.getTime()+'-'+i+'@cairnscracker',
      'DTSTAMP:'+icsDate(new Date()),
      'DTSTART:'+icsDate(d),
      'DTEND:'+icsDate(end),
      'SUMMARY:'+escapeICS('Cairns Cracker: '+title),
      'DESCRIPTION:'+escapeICS(note),
      'END:VEVENT'
    );
  });
  lines.push('END:VCALENDAR');
  const blob=new Blob([lines.join('\r\n')],{type:'text/calendar'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='cairns-cracker-v3-pizza-night.ics';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
};

calculate();
showSaved();
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
