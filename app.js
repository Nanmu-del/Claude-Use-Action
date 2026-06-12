const fileInput = document.getElementById('fileInput');
const playlistEl = document.getElementById('playlist');
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const currentEl = document.getElementById('current');
const durationEl = document.getElementById('duration');
const volume = document.getElementById('volume');
const shuffle = document.getElementById('shuffle');
const repeat = document.getElementById('repeat');
const btnClear = document.getElementById('btnClear');
const disc = document.getElementById('disc');
const canvas = document.getElementById('visualizer');

let tracks = [];
let index = 0;

function formatTime(sec){
  if (!isFinite(sec)) return '0:00';
  const s = Math.floor(sec%60).toString().padStart(2,'0');
  const m = Math.floor(sec/60);
  return `${m}:${s}`;
}

function hexToRgba(hex, alpha){
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function renderPlaylist(){
  playlistEl.innerHTML='';
  tracks.forEach((t,i)=>{
    const d = document.createElement('div');
    d.className='item'+(i===index?' active':'');
    d.textContent = t.name;
    d.onclick = ()=>{ index=i; loadTrack(); play(); };
    playlistEl.appendChild(d);
  });
}

function loadTrack(){
  if (!tracks.length) return;
  const track = tracks[index];
  audio.src = track.url;
  [...playlistEl.children].forEach((el,i)=>el.classList.toggle('active', i===index));
}

function play(){
  if (!audio.src) return;
  setupAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  audio.play();
  playBtn.textContent='⏸';
  disc.classList.add('playing');
  document.body.classList.add('playing');
}
function pause(){
  audio.pause();
  playBtn.textContent='▶️';
  disc.classList.remove('playing');
  document.body.classList.remove('playing');
}

playBtn.onclick = ()=>{ if (audio.paused) play(); else pause(); };
prevBtn.onclick = ()=>{ if (!tracks.length) return; index = (index-1+tracks.length)%tracks.length; loadTrack(); play(); };
nextBtn.onclick = ()=>{ if (!tracks.length) return; if (shuffle.checked){ index = Math.floor(Math.random()*tracks.length);} else { index = (index+1)%tracks.length;} loadTrack(); play(); };

function updateProgressFill(){
  progress.style.backgroundSize = progress.value + '% 100%';
}

audio.ontimeupdate = ()=>{
  progress.value = audio.duration ? (audio.currentTime/audio.duration)*100 : 0;
  updateProgressFill();
  currentEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
};

progress.oninput = ()=>{
  updateProgressFill();
  if (!audio.duration) return;
  audio.currentTime = (progress.value/100)*audio.duration;
};

volume.oninput = ()=>{ audio.volume = volume.value; };

audio.onended = ()=>{
  if (repeat.checked) { play(); } else { nextBtn.onclick(); }
};

fileInput.onchange = (e)=>{
  const files = Array.from(e.target.files);
  const oldLen = tracks.length;
  files.forEach(f=>{
    const url = URL.createObjectURL(f);
    tracks.push({name:f.name,url});
  });
  if (tracks.length && !audio.src){ index = oldLen; loadTrack(); }
  renderPlaylist();
};

btnClear.onclick = ()=>{
  tracks.forEach(t=>URL.revokeObjectURL(t.url));
  tracks = []; index = 0; audio.src=''; renderPlaylist(); currentEl.textContent='0:00'; durationEl.textContent='0:00'; progress.value=0; updateProgressFill(); playBtn.textContent='▶️';
  pause();
};

// initialize volume
audio.volume = volume.value;

/* ---------- Web Audio 实时频谱可视化 ---------- */
let audioCtx, analyser, sourceNode, dataArray, rafId;
const ctx = canvas.getContext('2d');

function setupAudioContext(){
  if (audioCtx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  audioCtx = new AC();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 128;
  sourceNode = audioCtx.createMediaElementSource(audio);
  sourceNode.connect(analyser);
  analyser.connect(audioCtx.destination);
  dataArray = new Uint8Array(analyser.frequencyBinCount);
  draw();
}

function resizeCanvas(){
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize', resizeCanvas);

function draw(){
  rafId = requestAnimationFrame(draw);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  ctx.clearRect(0,0,w,h);
  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);
  const cx = w/2, cy = h/2;
  const bars = dataArray.length;
  const innerR = Math.min(w,h)*0.26;

  // 平均能量 -> 唱片轻微缩放，产生"呼吸"交互
  let sum = 0;
  for (let i=0;i<bars;i++) sum += dataArray[i];
  const avg = sum/bars/255;
  if (disc) disc.style.transform = `scale(${1 + avg*0.08})`;

  for (let i=0;i<bars;i++){
    const v = dataArray[i]/255;
    const angle = (i/bars)*Math.PI*2 - Math.PI/2;
    const len = v * Math.min(w,h)*0.22;
    const x1 = cx + Math.cos(angle)*innerR;
    const y1 = cy + Math.sin(angle)*innerR;
    const x2 = cx + Math.cos(angle)*(innerR+len);
    const y2 = cy + Math.sin(angle)*(innerR+len);

    const grad = ctx.createLinearGradient(x1,y1,x2,y2);
    grad.addColorStop(0,hexToRgba(settings.accent3, 0.3+v*0.6));
    grad.addColorStop(1,hexToRgba(settings.accent2, 0.3+v*0.7));
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
  }
}

resizeCanvas();

/* ---------- 自定义设置（localStorage 持久化） ---------- */
const btnSettings = document.getElementById('btnSettings');
const settingsPanel = document.getElementById('settingsPanel');
const settingsOverlay = document.getElementById('settingsOverlay');
const btnCloseSettings = document.getElementById('btnCloseSettings');
const bgPresets = document.getElementById('bgPresets');
const themePresets = document.getElementById('themePresets');
const btnCustomBg = document.getElementById('btnCustomBg');
const bgFileInput = document.getElementById('bgFileInput');
const bgUrlInput = document.getElementById('bgUrlInput');
const blurRange = document.getElementById('blurRange');
const blurVal = document.getElementById('blurVal');
const opacityRange = document.getElementById('opacityRange');
const opacityVal = document.getElementById('opacityVal');
const btnResetSettings = document.getElementById('btnResetSettings');

const STORAGE_KEY = 'musicPlayerSettings';

const DEFAULTS = {
  bg: "url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1920&q=80')",
  accent: '#8b5cf6',
  accent2: '#ec4899',
  accent3: '#22d3ee',
  blur: 24,
  opacity: 7
};

const BG_OPTIONS = [
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1502790671504-542ad42d5189?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1493514789931-586cb221d7a7?auto=format&fit=crop&w=1920&q=80'
];

const THEME_OPTIONS = [
  {accent:'#8b5cf6',accent2:'#ec4899',accent3:'#22d3ee'},
  {accent:'#06b6d4',accent2:'#3b82f6',accent3:'#8b5cf6'},
  {accent:'#f59e0b',accent2:'#ef4444',accent3:'#ec4899'},
  {accent:'#10b981',accent2:'#22d3ee',accent3:'#84cc16'},
  {accent:'#f43f5e',accent2:'#a855f7',accent3:'#ec4899'},
  {accent:'#64748b',accent2:'#94a3b8',accent3:'#cbd5e1'}
];

let settings = loadSettings();

function loadSettings(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Object.assign({}, DEFAULTS, saved || {});
  }catch(e){ return Object.assign({}, DEFAULTS); }
}

function saveSettings(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }catch(e){}
}

function applySettings(){
  const root = document.documentElement.style;
  root.setProperty('--bg-image', settings.bg);
  root.setProperty('--accent', settings.accent);
  root.setProperty('--accent-2', settings.accent2);
  root.setProperty('--accent-3', settings.accent3);
  root.setProperty('--blur', settings.blur + 'px');
  root.setProperty('--panel-opacity', settings.opacity / 100);
  // 同步控件显示
  blurRange.value = settings.blur;
  blurVal.textContent = settings.blur;
  opacityRange.value = settings.opacity;
  opacityVal.textContent = settings.opacity;
  bgUrlInput.value = '';
  highlightActive();
}

function highlightActive(){
  [...bgPresets.children].forEach(el=>{
    el.classList.toggle('active', settings.bg.includes(el.dataset.url));
  });
  [...themePresets.children].forEach((el,i)=>{
    const t = THEME_OPTIONS[i];
    el.classList.toggle('active', t && t.accent === settings.accent && t.accent2 === settings.accent2);
  });
}

// 构建背景缩略图
BG_OPTIONS.forEach(url=>{
  const thumb = document.createElement('div');
  thumb.className = 'bg-thumb';
  thumb.style.backgroundImage = `url('${url}')`;
  thumb.dataset.url = url;
  thumb.onclick = ()=>{ settings.bg = `url('${url}')`; applySettings(); saveSettings(); };
  bgPresets.appendChild(thumb);
});

// 构建主题色圆点
THEME_OPTIONS.forEach(t=>{
  const dot = document.createElement('div');
  dot.className = 'theme-dot';
  dot.style.background = `linear-gradient(135deg,${t.accent3},${t.accent},${t.accent2})`;
  dot.onclick = ()=>{
    settings.accent = t.accent;
    settings.accent2 = t.accent2;
    settings.accent3 = t.accent3;
    applySettings(); saveSettings();
  };
  themePresets.appendChild(dot);
});

// 本地图片上传
btnCustomBg.onclick = ()=> bgFileInput.click();
bgFileInput.onchange = (e)=>{
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    settings.bg = `url('${reader.result}')`;
    applySettings(); saveSettings();
  };
  reader.readAsDataURL(file);
};

// URL 链接
bgUrlInput.onkeydown = (e)=>{
  if (e.key === 'Enter' && bgUrlInput.value.trim()){
    settings.bg = `url('${bgUrlInput.value.trim()}')`;
    applySettings(); saveSettings();
  }
};

// 滑块
blurRange.oninput = ()=>{
  settings.blur = +blurRange.value;
  blurVal.textContent = settings.blur;
  document.documentElement.style.setProperty('--blur', settings.blur + 'px');
  saveSettings();
};
opacityRange.oninput = ()=>{
  settings.opacity = +opacityRange.value;
  opacityVal.textContent = settings.opacity;
  document.documentElement.style.setProperty('--panel-opacity', settings.opacity / 100);
  saveSettings();
};

// 重置
btnResetSettings.onclick = ()=>{
  settings = Object.assign({}, DEFAULTS);
  applySettings(); saveSettings();
};

// 打开/关闭面板
function openSettings(){ settingsPanel.classList.add('open'); settingsOverlay.classList.add('open'); }
function closeSettings(){ settingsPanel.classList.remove('open'); settingsOverlay.classList.remove('open'); }
btnSettings.onclick = openSettings;
btnCloseSettings.onclick = closeSettings;
settingsOverlay.onclick = closeSettings;

applySettings();
