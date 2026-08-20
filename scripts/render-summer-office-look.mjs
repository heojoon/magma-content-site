import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('public/images/summer-office-look');
await fs.mkdir(outDir, { recursive: true });

const W = 1600;
const H = 1000;
const C = {
  bg: '#141414',
  card: '#1E1E1E',
  ink: '#EDEAE3',
  sub: '#B0AAA0',
  muted: '#7C766C',
  border: '#2E2A26',
  border2: '#423D37',
  accent: '#C05621',
  accentDark: '#A03F1C',
  accentLight: '#E8754A',
  parchment: '#F4F1EA',
  taupe: '#B8B2A8',
  stone: '#6F6A60',
  navy: '#28313A',
  olive: '#575949',
  clay: '#8A4D31',
  linen: '#D8D0C2',
  skin: '#B88769',
  hair: '#2D241F',
  shadow: '#0E0E0E'
};

function svgWrap(body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:${W}px;height:${H}px;background:${C.bg};overflow:hidden}svg{display:block;width:${W}px;height:${H}px} *{shape-rendering:geometricPrecision}</style></head><body><svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg></body></html>`;
}

function defs() {
  return `<defs>
    <linearGradient id="vignette" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#202020"/><stop offset="0.72" stop-color="#141414"/><stop offset="1" stop-color="#101010"/></linearGradient>
    <radialGradient id="warmLight" cx="0.34" cy="0.20" r="0.80"><stop offset="0" stop-color="#3B3329" stop-opacity="0.45"/><stop offset="0.55" stop-color="#201D1A" stop-opacity="0.20"/><stop offset="1" stop-color="#141414" stop-opacity="0"/></radialGradient>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#000" flood-opacity="0.35"/></filter>
  </defs>`;
}

function frame(accentX=1180, accentY=185) {
  return `<rect width="1600" height="1000" fill="url(#vignette)"/><rect width="1600" height="1000" fill="url(#warmLight)"/>
  <path d="M80 822 C390 768 690 864 1025 802 C1250 760 1400 790 1510 748" fill="none" stroke="${C.border}" stroke-width="2" opacity="0.75"/>
  <rect x="82" y="74" width="1436" height="852" rx="18" fill="none" stroke="${C.border}" stroke-width="2" opacity="0.86"/>
  <circle cx="${accentX}" cy="${accentY}" r="7" fill="${C.accent}" opacity="0.95"/>`;
}

function officeBack(type) {
  const win = `<rect x="155" y="118" width="460" height="330" rx="10" fill="#24231F" stroke="${C.border2}"/><path d="M196 160h374M196 228h374M196 296h374M196 364h374M250 130v300M350 130v300M470 130v300" stroke="${C.border}" stroke-width="4" opacity="0.95"/>`;
  const table = `<path d="M880 650h460l64 184H795z" fill="#282521" stroke="${C.border2}"/><path d="M838 840h530" stroke="${C.border2}" stroke-width="12" stroke-linecap="round"/>`;
  if (type === 'meeting') return `${win}<rect x="740" y="214" width="530" height="315" rx="18" fill="#201F1D" stroke="${C.border}"/><path d="M805 465h398" stroke="${C.border2}" stroke-width="8" opacity="0.65"/>${table}`;
  if (type === 'desk') return `${win}<rect x="878" y="230" width="410" height="260" rx="16" fill="#20201E" stroke="${C.border}"/><path d="M915 612h420l48 160H850z" fill="#2A2723" stroke="${C.border2}"/><circle cx="1294" cy="582" r="18" fill="${C.accent}" opacity="0.85"/>`;
  if (type === 'street') return `<rect x="140" y="120" width="390" height="680" rx="18" fill="#20201E" stroke="${C.border}"/><rect x="620" y="166" width="280" height="430" rx="16" fill="#23211E" stroke="${C.border}"/><path d="M930 700 C1090 620 1230 635 1455 570" fill="none" stroke="${C.border2}" stroke-width="14" opacity="0.55"/><circle cx="1280" cy="200" r="52" fill="${C.parchment}" opacity="0.12"/>`;
  if (type === 'workshop') return `${win}<rect x="760" y="184" width="610" height="385" rx="22" fill="#20201E" stroke="${C.border}"/><path d="M770 615h560l66 175H714z" fill="#2A2723" stroke="${C.border2}"/><circle cx="1222" cy="178" r="76" fill="${C.parchment}" opacity="0.10"/>`;
  return `<rect x="150" y="126" width="440" height="610" rx="22" fill="#211F1C" stroke="${C.border}"/><rect x="760" y="220" width="480" height="378" rx="20" fill="#24211E" stroke="${C.border}"/><circle cx="1320" cy="246" r="44" fill="${C.accent}" opacity="0.22"/><path d="M806 672h506" stroke="${C.border2}" stroke-width="16" stroke-linecap="round"/>`;
}

function person(x, y, s, outfit) {
  const jacket = outfit.jacket || 'none';
  const shirt = outfit.shirt;
  const pants = outfit.pants;
  const shoes = outfit.shoes || '#171717';
  const pose = outfit.pose || 0;
  const head = `<ellipse cx="${x}" cy="${y-276*s}" rx="43" ry="50" fill="${C.skin}"/><path d="M${x-42*s} ${y-288*s} C${x-34*s} ${y-340*s} ${x+42*s} ${y-337*s} ${x+48*s} ${y-294*s} C${x+18*s} ${y-315*s} ${x-10*s} ${y-318*s} ${x-42*s} ${y-288*s}Z" fill="${C.hair}"/>`;
  const neck = `<rect x="${x-18*s}" y="${y-230*s}" width="36" height="45" rx="16" fill="${C.skin}"/>`;
  const torso = `<path d="M${x-86*s} ${y-196*s} C${x-53*s} ${y-222*s} ${x+58*s} ${y-222*s} ${x+92*s} ${y-194*s} L${x+76*s} ${y+70*s} C${x+32*s} ${y+92*s} ${x-42*s} ${y+92*s} ${x-82*s} ${y+70*s}Z" fill="${shirt}" stroke="${C.border}" stroke-width="${2*s}"/>`;
  const collar = outfit.collar ? `<path d="M${x-38*s} ${y-196*s} L${x} ${y-156*s} L${x+40*s} ${y-196*s}" fill="none" stroke="${C.parchment}" stroke-width="${7*s}" stroke-linecap="round" stroke-linejoin="round" opacity="0.78"/>` : '';
  const outer = jacket !== 'none' ? `<path d="M${x-106*s} ${y-196*s} C${x-56*s} ${y-235*s} ${x+58*s} ${y-235*s} ${x+108*s} ${y-196*s} L${x+88*s} ${y+92*s} C${x+48*s} ${y+124*s} ${x-50*s} ${y+124*s} ${x-90*s} ${y+92*s}Z" fill="${jacket}" stroke="${C.border2}" stroke-width="${3*s}" opacity="0.95"/><path d="M${x-18*s} ${y-190*s} L${x-4*s} ${y+92*s} M${x+20*s} ${y-190*s} L${x+4*s} ${y+92*s}" stroke="${C.border}" stroke-width="${5*s}" opacity="0.62"/>` : '';
  const arms = pose === 1 ? `<path d="M${x-90*s} ${y-164*s} C${x-168*s} ${y-94*s} ${x-178*s} ${y+10*s} ${x-142*s} ${y+70*s}" fill="none" stroke="${jacket==='none'?shirt:jacket}" stroke-width="${30*s}" stroke-linecap="round"/><path d="M${x+92*s} ${y-164*s} C${x+165*s} ${y-100*s} ${x+182*s} ${y+8*s} ${x+146*s} ${y+70*s}" fill="none" stroke="${jacket==='none'?shirt:jacket}" stroke-width="${30*s}" stroke-linecap="round"/>` : `<path d="M${x-90*s} ${y-164*s} C${x-136*s} ${y-56*s} ${x-134*s} ${y+42*s} ${x-98*s} ${y+112*s}" fill="none" stroke="${jacket==='none'?shirt:jacket}" stroke-width="${30*s}" stroke-linecap="round"/><path d="M${x+92*s} ${y-164*s} C${x+138*s} ${y-54*s} ${x+132*s} ${y+50*s} ${x+96*s} ${y+118*s}" fill="none" stroke="${jacket==='none'?shirt:jacket}" stroke-width="${30*s}" stroke-linecap="round"/>`;
  const hands = `<circle cx="${x-98*s}" cy="${y+112*s}" r="15" fill="${C.skin}"/><circle cx="${x+96*s}" cy="${y+118*s}" r="15" fill="${C.skin}"/>`;
  const legs = `<path d="M${x-58*s} ${y+70*s} C${x-82*s} ${y+210*s} ${x-96*s} ${y+366*s} ${x-104*s} ${y+482*s}" fill="none" stroke="${pants}" stroke-width="${48*s}" stroke-linecap="round"/><path d="M${x+55*s} ${y+70*s} C${x+70*s} ${y+210*s} ${x+88*s} ${y+360*s} ${x+112*s} ${y+482*s}" fill="none" stroke="${pants}" stroke-width="${48*s}" stroke-linecap="round"/><path d="M${x-139*s} ${y+510*s}h78" stroke="${shoes}" stroke-width="${27*s}" stroke-linecap="round"/><path d="M${x+78*s} ${y+510*s}h82" stroke="${shoes}" stroke-width="${27*s}" stroke-linecap="round"/>`;
  const belt = `<path d="M${x-72*s} ${y+68*s} C${x-25*s} ${y+86*s} ${x+24*s} ${y+86*s} ${x+72*s} ${y+68*s}" stroke="${C.border2}" stroke-width="${8*s}" fill="none" opacity="0.75"/>`;
  return `<g filter="url(#softShadow)">${legs}${torso}${outer}${arms}${hands}${neck}${head}${collar}${belt}</g>`;
}

function props(type) {
  if (type === 'meeting') return `<rect x="980" y="642" width="138" height="30" rx="15" fill="${C.parchment}" opacity="0.60"/><rect x="1150" y="650" width="92" height="18" rx="9" fill="${C.accent}" opacity="0.75"/>`;
  if (type === 'desk') return `<path d="M1010 560h178l28 86H982z" fill="#151515" stroke="${C.border2}"/><path d="M1080 650h68" stroke="${C.border2}" stroke-width="10"/>`;
  if (type === 'street') return `<circle cx="312" cy="740" r="42" fill="${C.accent}" opacity="0.42"/><path d="M220 790 C430 722 590 760 750 714" stroke="${C.border2}" stroke-width="8" fill="none" opacity="0.65"/>`;
  if (type === 'workshop') return `<circle cx="1036" cy="625" r="18" fill="${C.accent}" opacity="0.75"/><rect x="1100" y="604" width="126" height="22" rx="11" fill="${C.parchment}" opacity="0.45"/>`;
  return `<circle cx="962" cy="628" r="22" fill="${C.accent}" opacity="0.7"/><rect x="1042" y="606" width="170" height="34" rx="17" fill="${C.parchment}" opacity="0.46"/>`;
}

const scenes = [
  {name:'summer-office-look-look-01.png', type:'meeting', accent:[1324,164], x:560, y:360, s:0.82, outfit:{jacket:C.navy, shirt:C.linen, pants:'#343E45', shoes:'#151515', collar:false}, note:'light jacket, quiet inner, same-tone trouser'},
  {name:'summer-office-look-look-02.png', type:'desk', accent:[1272,578], x:560, y:370, s:0.80, outfit:{jacket:'none', shirt:'#AFA699', pants:'#3F4038', shoes:'#151515', collar:true}, note:'knit polo texture and straight trousers'},
  {name:'summer-office-look-look-03.png', type:'street', accent:[317,739], x:860, y:374, s:0.80, outfit:{jacket:'none', shirt:'#D2C7B6', pants:'#4C5047', shoes:'#1A1A1A', collar:true, pose:1}, note:'open-collar shirt and easy tapered trousers'},
  {name:'summer-office-look-look-04.png', type:'workshop', accent:[1036,625], x:560, y:365, s:0.82, outfit:{jacket:'#9B9285', shirt:'#E7E0D4', pants:'#5B5A52', shoes:'#161616', collar:true}, note:'long sleeve shirt layered over inner'},
  {name:'summer-office-look-look-05.png', type:'evening', accent:[1320,246], x:570, y:360, s:0.82, outfit:{jacket:C.clay, shirt:'#CAC1B3', pants:'#414740', shoes:'#141414', collar:false}, note:'overshirt jacket and single-color inner'}
];

function sceneSvg(scene) {
  return defs()+frame(scene.accent[0], scene.accent[1])+officeBack(scene.type)+props(scene.type)+person(scene.x, scene.y, scene.s, scene.outfit);
}

function thumbnailSvg() {
  const bodies = scenes.map((sc, i)=> {
    const x = 335 + i*230;
    return `<g transform="translate(${x-560}, ${i%2===0?18:50}) scale(0.52)">${officeBack(i===0?'meeting':i===1?'desk':i===2?'street':i===3?'workshop':'evening')}${person(560, 360, 0.82, sc.outfit)}</g>`;
  }).join('');
  return defs()+`<rect width="1600" height="1000" fill="${C.bg}"/><rect x="72" y="74" width="1456" height="850" rx="22" fill="${C.card}" stroke="${C.border}"/><path d="M126 198 C420 130 650 232 874 174 C1120 112 1340 144 1470 102" fill="none" stroke="${C.accent}" stroke-width="8" opacity="0.75"/><circle cx="1278" cy="160" r="9" fill="${C.accent}"/>${bodies}<rect x="102" y="758" width="1396" height="92" rx="20" fill="#151515" opacity="0.34"/><path d="M180 804h1240" stroke="${C.border2}" stroke-width="8" stroke-linecap="round" opacity="0.65"/>`;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

async function render(name, svg) {
  await page.setContent(svgWrap(svg), { waitUntil: 'load' });
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage: false, type: 'png' });
  return file;
}

const made = [];
made.push(await render('summer-office-look-thumbnail.png', thumbnailSvg()));
for (const sc of scenes) made.push(await render(sc.name, sceneSvg(sc)));
await browser.close();
console.log(JSON.stringify({ outDir, files: made }, null, 2));
