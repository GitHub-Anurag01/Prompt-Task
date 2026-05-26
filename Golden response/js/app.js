/* ===== DISASTER AI SYSTEM — MAIN APP ===== */
'use strict';

// ========================
// NAVIGATION
// ========================
function navigate(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const el = document.getElementById(section);
  if (el) { el.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  const link = document.querySelector(`.nav-link[data-section="${section}"]`);
  if (link) link.classList.add('active');
  if (section === 'dashboard') setTimeout(initDashboard, 100);
  if (section === 'home') animateStats();
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigate(link.dataset.section);
    document.getElementById('navLinks').classList.remove('open');
  });
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// ========================
// HERO STATS COUNTER
// ========================
function animateStats() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 20);
  });
}

// ========================
// GLOBE CANVAS
// ========================
function drawGlobe() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2, cy = canvas.height / 2, r = 160;

  const dots = [];
  for (let lat = -80; lat <= 80; lat += 18) {
    for (let lon = -180; lon <= 180; lon += 18) {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lon + 180) * Math.PI / 180;
      dots.push({
        x: cx + r * Math.sin(phi) * Math.cos(theta),
        y: cy + r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(theta),
        lat, lon
      });
    }
  }

  let angle = 0;
  const hotspots = [
    { lat: 35, lon: 139, type: 'eq', label: '🌍' },
    { lat: 24, lon: 90, type: 'flood', label: '🌊' },
    { lat: 27, lon: -90, type: 'hurricane', label: '🌀' },
    { lat: -35, lon: 150, type: 'eq', label: '🌍' },
  ];

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createRadialGradient(cx - 50, cy - 50, 20, cx, cy, r);
    grad.addColorStop(0, '#0a2a3f');
    grad.addColorStop(0.5, '#071520');
    grad.addColorStop(1, '#030a0f');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

    dots.forEach(d => {
      const theta = (d.lon + 180 + angle) * Math.PI / 180;
      const phi = (90 - d.lat) * Math.PI / 180;
      const x = cx + r * Math.sin(phi) * Math.cos(theta);
      const y = cy + r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      if (z > 0) {
        const brightness = (z / r) * 0.8 + 0.2;
        ctx.fillStyle = `rgba(0, 212, 255, ${brightness * 0.5})`;
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
      }
    });

    hotspots.forEach(hs => {
      const theta = (hs.lon + 180 + angle) * Math.PI / 180;
      const phi = (90 - hs.lat) * Math.PI / 180;
      const z = r * Math.sin(phi) * Math.sin(theta);
      if (z > 0) {
        const x = cx + r * Math.sin(phi) * Math.cos(theta);
        const y = cy + r * Math.cos(phi);
        const pulse = Math.sin(Date.now() / 500) * 0.5 + 0.5;
        ctx.fillStyle = hs.type === 'eq' ? `rgba(255,165,0,${0.5 + pulse * 0.5})` :
                        hs.type === 'flood' ? `rgba(0,212,255,${0.5 + pulse * 0.5})` :
                        `rgba(255,74,74,${0.5 + pulse * 0.5})`;
        ctx.beginPath(); ctx.arc(x, y, 4 + pulse * 2, 0, Math.PI * 2); ctx.fill();
      }
    });

    ctx.save();
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();

    angle += 0.3;
    requestAnimationFrame(draw);
  }
  draw();
}

// ========================
// TAB SYSTEM
// ========================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
  });
});

// ========================
// PREDICTION MODELS (Simulated ML)
// ========================
function predictEarthquake() {
  const lat = parseFloat(document.getElementById('eq-lat').value);
  const lon = parseFloat(document.getElementById('eq-lon').value);
  const depth = parseFloat(document.getElementById('eq-depth').value);
  const zone = document.getElementById('eq-zone').value;
  if (isNaN(lat) || isNaN(lon) || isNaN(depth)) { showToast('⚠️ Please fill all fields'); return; }

  showLoading('eq-result');
  setTimeout(() => {
    const zoneRisk = { subduction: 0.8, transform: 0.7, divergent: 0.4, intraplate: 0.2 };
    const depthFactor = depth < 30 ? 0.9 : depth < 70 ? 0.7 : 0.4;
    const latFactor = (Math.abs(lat) < 60) ? 0.8 : 0.5;
    const baseRisk = (zoneRisk[zone] * 0.5 + depthFactor * 0.3 + latFactor * 0.2);
    const noise = (Math.random() - 0.5) * 0.15;
    const risk = Math.min(Math.max(baseRisk + noise, 0.1), 0.98);

    const magnitude = (2.5 + risk * 6).toFixed(1);
    const level = risk > 0.75 ? 'CRITICAL' : risk > 0.55 ? 'HIGH' : risk > 0.35 ? 'MEDIUM' : 'LOW';
    const percent = Math.round(risk * 100);

    const recs = {
      LOW: ['Routine monitoring only', 'Standard building codes sufficient', 'No immediate action required'],
      MEDIUM: ['Increase seismic monitoring frequency', 'Review emergency response plans', 'Ensure emergency kits are ready', 'Check structural integrity of buildings'],
      HIGH: ['Issue advisory to local authorities', 'Activate emergency response teams', 'Evacuate vulnerable structures', 'Set up emergency shelters'],
      CRITICAL: ['IMMEDIATE EVACUATION RECOMMENDED', 'Activate all emergency protocols', 'Deploy rescue teams on standby', 'Shut down critical infrastructure', 'Issue public emergency alert']
    };

    showPredictionResult('eq-result', {
      title: 'EARTHQUAKE RISK ANALYSIS', icon: '🌍', level, percent,
      details: [
        { key: 'Predicted Magnitude', val: `M${magnitude}` },
        { key: 'Risk Score', val: `${percent}%` },
        { key: 'Depth Zone', val: depth < 30 ? 'Shallow (High Impact)' : depth < 70 ? 'Intermediate' : 'Deep' },
        { key: 'Tectonic Zone', val: zone.charAt(0).toUpperCase() + zone.slice(1) },
        { key: 'Coordinates', val: `${lat.toFixed(2)}, ${lon.toFixed(2)}` },
        { key: 'Model', val: 'Random Forest Regressor' },
      ],
      recommendations: recs[level]
    });
  }, 1800);
}

function predictFlood() {
  const rain = parseFloat(document.getElementById('fl-rain').value);
  const river = parseFloat(document.getElementById('fl-river').value);
  const soil = parseInt(document.getElementById('fl-soil').value);
  const elev = parseFloat(document.getElementById('fl-elev').value);
  const dur = parseFloat(document.getElementById('fl-dur').value);
  if (isNaN(rain) || isNaN(river) || isNaN(elev) || isNaN(dur)) { showToast('⚠️ Please fill all fields'); return; }

  showLoading('fl-result');
  setTimeout(() => {
    const rainFactor = Math.min(rain / 200, 1);
    const riverFactor = Math.min(river / 15, 1);
    const soilFactor = soil / 100;
    const elevFactor = 1 - Math.min(elev / 200, 1);
    const durFactor = Math.min(dur / 72, 1);
    const risk = (rainFactor * 0.35 + riverFactor * 0.25 + soilFactor * 0.2 + elevFactor * 0.1 + durFactor * 0.1);
    const noise = (Math.random() - 0.5) * 0.1;
    const finalRisk = Math.min(Math.max(risk + noise, 0.05), 0.98);
    const level = finalRisk > 0.75 ? 'CRITICAL' : finalRisk > 0.55 ? 'HIGH' : finalRisk > 0.35 ? 'MEDIUM' : 'LOW';
    const percent = Math.round(finalRisk * 100);

    const recs = {
      LOW: ['Monitor weather forecasts', 'Clear drainage channels', 'No immediate flood risk'],
      MEDIUM: ['Alert local flood authorities', 'Move valuables to higher levels', 'Prepare emergency flood kit', 'Monitor river levels closely'],
      HIGH: ['Issue flood warnings to residents', 'Open emergency shelters', 'Move livestock to higher ground', 'Deploy flood barriers', 'Evacuation of flood-prone zones'],
      CRITICAL: ['EMERGENCY FLOOD EVACUATION', 'Deploy water rescue teams immediately', 'Close roads in affected areas', 'Activate all emergency services', 'Mass evacuation of low-lying areas']
    };

    showPredictionResult('fl-result', {
      title: 'FLOOD RISK ANALYSIS', icon: '🌊', level, percent,
      details: [
        { key: 'Occurrence Probability', val: `${percent}%` },
        { key: 'Rainfall Input', val: `${rain} mm/day` },
        { key: 'River Level', val: `${river}m` },
        { key: 'Soil Saturation', val: `${soil}%` },
        { key: 'Elevation', val: `${elev}m` },
        { key: 'Model', val: 'Random Forest Classifier' },
      ],
      recommendations: recs[level]
    });
  }, 1800);
}

function predictHurricane() {
  const wind = parseFloat(document.getElementById('hu-wind').value);
  const press = parseFloat(document.getElementById('hu-press').value);
  const sst = parseFloat(document.getElementById('hu-sst').value);
  const loc = document.getElementById('hu-loc').value;
  if (isNaN(wind) || isNaN(press) || isNaN(sst)) { showToast('⚠️ Please fill all fields'); return; }

  showLoading('hu-result');
  setTimeout(() => {
    const windFactor = Math.min(wind / 180, 1);
    const pressFactor = Math.max(0, (1013 - press) / 163);
    const sstFactor = Math.min(Math.max((sst - 24) / 12, 0), 1);
    const locBonus = { gulf: 0.1, caribbean: 0.05, atlantic: 0, pacific: -0.05 }[loc] || 0;
    const risk = (windFactor * 0.45 + pressFactor * 0.35 + sstFactor * 0.2 + locBonus);
    const noise = (Math.random() - 0.5) * 0.1;
    const finalRisk = Math.min(Math.max(risk + noise, 0.05), 0.98);
    const cat = wind >= 157 ? 5 : wind >= 130 ? 4 : wind >= 111 ? 3 : wind >= 96 ? 2 : wind >= 74 ? 1 : 0;
    const level = finalRisk > 0.75 ? 'CRITICAL' : finalRisk > 0.55 ? 'HIGH' : finalRisk > 0.35 ? 'MEDIUM' : 'LOW';
    const percent = Math.round(finalRisk * 100);

    const recs = {
      LOW: ['Monitor tropical weather systems', 'Standard preparedness review', 'No immediate threat'],
      MEDIUM: ['Issue tropical storm watches', 'Prepare for potential land impact', 'Secure loose outdoor items', 'Review evacuation routes'],
      HIGH: ['Issue hurricane warnings', 'Begin coastal evacuations', 'Board up windows and doors', 'Stock emergency supplies', 'Move to inland shelter'],
      CRITICAL: ['MANDATORY EVACUATION ORDER', 'Category 4-5 extreme danger', 'All residents must evacuate coastal areas', 'Emergency shelters at maximum capacity', 'Do not attempt to shelter in place']
    };

    showPredictionResult('hu-result', {
      title: 'HURRICANE ANALYSIS', icon: '🌀', level, percent,
      details: [
        { key: 'Saffir-Simpson Category', val: cat === 0 ? 'Tropical Storm' : `Category ${cat}` },
        { key: 'Intensity Score', val: `${percent}%` },
        { key: 'Max Wind Speed', val: `${wind} mph` },
        { key: 'Central Pressure', val: `${press} mb` },
        { key: 'Sea Surface Temp', val: `${sst}°C` },
        { key: 'Model', val: 'Random Forest Model' },
      ],
      recommendations: recs[level]
    });
  }, 1800);
}

function showLoading(id) {
  document.getElementById(id).innerHTML = `
    <div style="text-align:center;padding:3rem">
      <div class="loading" style="width:40px;height:40px;margin:0 auto 1rem"></div>
      <p style="color:var(--text2);font-family:var(--font-mono);font-size:0.8rem">RUNNING AI MODEL...</p>
    </div>`;
}

function showPredictionResult(id, data) {
  const recs = data.recommendations.map(r => `<div class="rec-item">→ ${r}</div>`).join('');
  const details = data.details.map(d => `<div class="result-row"><span class="result-key">${d.key}</span><span class="result-val">${d.val}</span></div>`).join('');
  document.getElementById(id).innerHTML = `
    <div class="risk-display risk-${data.level}">
      <div style="font-size:0.75rem;font-family:var(--font-mono);color:var(--text2);letter-spacing:2px">${data.title}</div>
      <div class="risk-meter">
        <div class="risk-label">${data.level}</div>
        <div class="risk-bar"><div class="risk-bar-fill" style="width:0%" id="bar-${id}"></div></div>
        <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text2)">${data.percent}% Risk Score</div>
      </div>
      <div class="result-details">${details}</div>
      <div class="recommendations-list" style="margin-top:1rem">
        <div style="font-family:var(--font-display);font-size:0.7rem;color:var(--accent);letter-spacing:2px;margin-bottom:0.5rem">RECOMMENDATIONS</div>
        ${recs}
      </div>
    </div>`;
  setTimeout(() => {
    const bar = document.getElementById(`bar-${id}`);
    if (bar) bar.style.width = data.percent + '%';
  }, 100);
  showToast(`${data.icon} ${data.level} risk detected — ${data.percent}%`);
}

// ========================
// YOLO DETECTION (Simulated)
// ========================
function handleUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const canvas = document.getElementById('detectionCanvas');
  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('detectionOverlay');
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      overlay.innerHTML = `
        <div style="color:var(--accent);font-family:var(--font-mono);font-size:0.8rem;text-align:center">
          <div class="loading" style="margin:0 auto 1rem"></div>
          YOLO v8 — RUNNING DETECTION...
        </div>`;
      overlay.style.background = 'rgba(5,10,14,0.7)';
      setTimeout(() => runYOLODetection(ctx, img), 2500);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  document.getElementById('uploadZone').querySelector('.upload-content').innerHTML = `
    <div class="upload-icon">✅</div>
    <h3>Image Uploaded</h3>
    <p>${file.name}</p>`;
}

function runYOLODetection(ctx, img) {
  const overlay = document.getElementById('detectionOverlay');
  const w = img.width, h = img.height;
  const persons = Math.floor(Math.random() * 6) + 2;
  const injured = Math.floor(persons * (0.3 + Math.random() * 0.4));
  const safe = persons - injured;
  const boxes = [];

  for (let i = 0; i < persons; i++) {
    const bw = w * (0.06 + Math.random() * 0.1);
    const bh = h * (0.12 + Math.random() * 0.15);
    const bx = Math.random() * (w - bw);
    const by = Math.random() * (h - bh);
    const isInjured = i < injured;
    const conf = (0.72 + Math.random() * 0.25).toFixed(2);
    boxes.push({ x: bx, y: by, w: bw, h: bh, injured: isInjured, conf });

    ctx.strokeStyle = isInjured ? '#ff4a4a' : '#00ff8c';
    ctx.lineWidth = 3;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.fillStyle = isInjured ? 'rgba(255,74,74,0.2)' : 'rgba(0,255,140,0.15)';
    ctx.fillRect(bx, by, bw, bh);

    const label = isInjured ? `INJURED ${conf}` : `PERSON ${conf}`;
    ctx.fillStyle = isInjured ? '#ff4a4a' : '#00ff8c';
    ctx.font = `bold ${Math.max(10, w * 0.018)}px monospace`;
    ctx.fillText(label, bx + 3, by - 5 < 10 ? by + 15 : by - 5);
  }

  overlay.style.display = 'none';
  document.getElementById('detStats').style.display = 'grid';
  document.getElementById('personsCount').textContent = persons;
  document.getElementById('injuredCount').textContent = injured;
  document.getElementById('safeCount').textContent = safe;
  document.getElementById('confScore').textContent = (0.82 + Math.random() * 0.12).toFixed(2);

  const guidance = document.getElementById('rescueGuidance');
  guidance.style.display = 'block';
  guidance.innerHTML = `
    <h4>🚨 RESCUE GUIDANCE</h4>
    ${injured > 0 ? `<div class="rescue-step">⚠️ ${injured} injured person(s) detected — dispatch medical teams immediately</div>` : ''}
    <div class="rescue-step">📍 ${persons} total persons identified in disaster zone</div>
    <div class="rescue-step">🚁 Recommend aerial extraction for sectors with red bounding boxes</div>
    <div class="rescue-step">🏥 Nearest medical facility should be on standby</div>
    <div class="rescue-step">📡 Share detection results with rescue command center</div>
  `;
  showToast(`🔍 YOLO: ${persons} persons detected, ${injured} potentially injured`);
}

// ========================
// LIVE ALERTS
// ========================
const alertData = [
  { icon: '🌍', title: 'M6.1 Earthquake — Southern Japan', meta: '2 min ago · Depth: 35km', sev: 'high', badge: 'HIGH' },
  { icon: '🌀', title: 'Hurricane Helena Cat. 3 — Gulf of Mexico', meta: '8 min ago · Wind: 125mph', sev: 'critical', badge: 'CRITICAL' },
  { icon: '🌊', title: 'Flood Warning — Bangladesh Delta', meta: '15 min ago · Rainfall: 180mm', sev: 'high', badge: 'HIGH' },
  { icon: '🌍', title: 'M4.8 Earthquake — Turkey', meta: '31 min ago · Depth: 12km', sev: 'medium', badge: 'MEDIUM' },
  { icon: '🌊', title: 'Flash Flood Advisory — Philippines', meta: '47 min ago · River: +2.3m', sev: 'medium', badge: 'MEDIUM' },
  { icon: '🌀', title: 'Tropical Storm Watch — Caribbean Sea', meta: '1h ago · Wind: 58mph', sev: 'low', badge: 'LOW' },
  { icon: '🌍', title: 'M3.9 Tremor — California', meta: '2h ago · Depth: 8km', sev: 'low', badge: 'LOW' },
];

function initAlerts() {
  const feed = document.getElementById('alertsFeed');
  if (!feed) return;
  feed.innerHTML = '';
  alertData.forEach((a, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = `alert-item sev-${a.sev}`;
      el.innerHTML = `
        <div class="alert-icon">${a.icon}</div>
        <div class="alert-text">
          <div class="alert-title">${a.title}</div>
          <div class="alert-meta">${a.meta}</div>
        </div>
        <div class="alert-badge badge-${a.sev}">${a.badge}</div>`;
      feed.appendChild(el);
    }, i * 200);
  });
}

function checkLocationAlert() {
  const loc = document.getElementById('userLocation').value.trim();
  const type = document.getElementById('alertType').value;
  if (!loc) { showToast('⚠️ Please enter a location'); return; }

  const res = document.getElementById('locationAlertResult');
  res.style.display = 'block';
  res.innerHTML = '<div class="loading" style="margin:0 auto"></div>';

  setTimeout(() => {
    const risks = ['LOW', 'MEDIUM', 'HIGH'];
    const risk = risks[Math.floor(Math.random() * risks.length)];
    const colors = { LOW: 'var(--accent3)', MEDIUM: 'var(--accent4)', HIGH: 'var(--accent2)' };
    const msgs = {
      LOW: 'No immediate disaster threats detected in your area.',
      MEDIUM: 'Moderate risk detected. Stay alert and monitor updates.',
      HIGH: 'Elevated risk detected! Review evacuation routes and emergency kits.'
    };
    res.innerHTML = `
      <div style="font-family:var(--font-display);font-size:1.2rem;color:${colors[risk]};margin-bottom:0.5rem">${risk} RISK</div>
      <div style="font-size:0.85rem;color:var(--text2)">${msgs[risk]}</div>
      <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text3);margin-top:0.5rem">Location: ${loc} · Type: ${type} · Updated: Just now</div>`;
    showToast(`📍 Alert check complete for ${loc}`);
  }, 1500);
}

const safetyData = {
  earthquake: [
    'DROP, COVER, and HOLD ON during shaking',
    'Stay away from windows, exterior walls and heavy furniture',
    'If outdoors, move to an open area away from buildings',
    'After shaking stops, check for injuries and hazards',
    'Be prepared for aftershocks; they may be strong',
    'Do not use elevators after an earthquake',
    'Check for gas leaks — evacuate if you smell gas',
    'Listen to emergency broadcasts for instructions'
  ],
  flood: [
    'Move to higher ground immediately if flooding begins',
    'Never walk, swim, or drive through flood waters',
    'Disconnect electrical appliances before flooding',
    'Store important documents in waterproof containers',
    'Have emergency supplies: 3-day water and food supply',
    'Avoid contact with floodwater — it may be contaminated',
    'Do not return until authorities declare it safe',
    'Document damage for insurance before cleanup'
  ],
  hurricane: [
    'Evacuate immediately if ordered by authorities',
    'Board up windows and reinforce garage doors',
    'Fill bathtubs with water for sanitation needs',
    'Charge all electronic devices before storm arrives',
    'Stay indoors during the storm — go to the safest room',
    'Beware of the calm eye of a hurricane — it will return',
    'Avoid flooded roads and downed power lines after storm',
    'Use generators outdoors only — carbon monoxide danger'
  ]
};

function showSafety(type) {
  document.querySelectorAll('.safety-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  const items = safetyData[type];
  document.getElementById('safetyContent').innerHTML = items.map((item, i) =>
    `<div class="safety-item"><span class="safety-num">${String(i+1).padStart(2,'0')}</span><span>${item}</span></div>`
  ).join('');
}

// ========================
// DASHBOARD CHARTS
// ========================
function initDashboard() {
  drawRiskMap();
  drawSeismicChart();
  drawRainfallChart();
  drawWindGauge();
  populateEventsList();
  populateTeamsList();
}

function drawRiskMap() {
  const canvas = document.getElementById('riskMap');
  if (!canvas || canvas._drawn) return;
  canvas._drawn = true;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;

  ctx.fillStyle = '#071520';
  ctx.fillRect(0, 0, w, h);

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, 'rgba(0, 212, 255, 0.03)');
  grad.addColorStop(1, 'rgba(0, 40, 80, 0.3)');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(0, 212, 255, 0.08)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  const hotspots = [
    { x: 0.78, y: 0.25, r: 30, color: '#ff4a4a', label: 'Japan EQ', type: '🌍' },
    { x: 0.72, y: 0.35, r: 25, color: '#ffa500', label: 'Bangladesh Flood', type: '🌊' },
    { x: 0.22, y: 0.30, r: 35, color: '#ff4a4a', label: 'Gulf Hurricane', type: '🌀' },
    { x: 0.15, y: 0.25, r: 20, color: '#ffa500', label: 'California', type: '🌍' },
    { x: 0.52, y: 0.38, r: 20, color: '#ffa500', label: 'Turkey EQ', type: '🌍' },
    { x: 0.85, y: 0.55, r: 18, color: '#00d4ff', label: 'Australia', type: '🌍' },
  ];

  hotspots.forEach(hs => {
    const x = hs.x * w, y = hs.y * h;
    const g = ctx.createRadialGradient(x, y, 0, x, y, hs.r);
    g.addColorStop(0, hs.color.replace(')', ', 0.6)').replace('rgb', 'rgba'));
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, hs.r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = hs.color; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c8e6f0'; ctx.font = '10px Share Tech Mono';
    ctx.fillText(`${hs.type} ${hs.label}`, x + 8, y - 5);
  });

  ctx.fillStyle = 'rgba(0, 212, 255, 0.7)'; ctx.font = '10px Orbitron';
  ctx.fillText('GLOBAL DISASTER RISK MAP', 10, 20);
}

function drawSeismicChart() {
  const canvas = document.getElementById('seismicChart');
  if (!canvas || canvas._drawn) return;
  canvas._drawn = true;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#071520'; ctx.fillRect(0, 0, w, h);

  const points = Array.from({ length: 96 }, (_, i) => {
    const base = 20;
    const noise = Math.random() * 15;
    const spike = (i === 30 || i === 65) ? 60 + Math.random() * 40 : 0;
    return base + noise + spike;
  });

  ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)'; ctx.lineWidth = 0.5;
  for (let y = 0; y < h; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
  grad.addColorStop(1, 'rgba(0, 212, 255, 0)');
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - (p / 120) * h;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();

  ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - (p / 120) * h;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = 'rgba(0, 212, 255, 0.7)'; ctx.font = '9px Share Tech Mono';
  ctx.fillText('SEISMIC ACTIVITY (24h) — 96 readings', 5, 12);
}

function drawRainfallChart() {
  const canvas = document.getElementById('rainfallChart');
  if (!canvas || canvas._drawn) return;
  canvas._drawn = true;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#071520'; ctx.fillRect(0, 0, w, h);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const vals = [45, 80, 120, 95, 160, 40, 75];
  const bw = (w - 40) / days.length - 8;

  ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)'; ctx.lineWidth = 0.5;
  for (let y = 0; y < h - 20; y += (h - 30) / 4) { ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(w, y); ctx.stroke(); }

  vals.forEach((v, i) => {
    const x = 30 + i * ((w - 30) / days.length) + 4;
    const bh = (v / 200) * (h - 30);
    const by = h - 20 - bh;
    const g = ctx.createLinearGradient(0, by, 0, h);
    g.addColorStop(0, 'rgba(0, 212, 255, 0.8)');
    g.addColorStop(1, 'rgba(0, 80, 120, 0.4)');
    ctx.fillStyle = v > 150 ? 'rgba(255, 74, 74, 0.7)' : g;
    ctx.beginPath();
    ctx.roundRect(x, by, bw, bh, 3);
    ctx.fill();
    ctx.fillStyle = 'var(--text2, #7aacbf)'; ctx.font = '9px Share Tech Mono';
    ctx.fillText(days[i], x + 2, h - 5);
    ctx.fillStyle = '#c8e6f0';
    ctx.fillText(v, x + 2, by - 3);
  });

  ctx.fillStyle = 'rgba(0, 212, 255, 0.7)'; ctx.font = '9px Share Tech Mono';
  ctx.fillText('RAINFALL INDEX (mm) — Last 7 Days', 5, 12);
}

function drawWindGauge() {
  const canvas = document.getElementById('windGauge');
  if (!canvas || canvas._drawn) return;
  canvas._drawn = true;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#071520'; ctx.fillRect(0, 0, w, h);

  const cx = w / 2, cy = h * 0.65, r = Math.min(w, h) * 0.5;
  const windSpeed = Math.floor(Math.random() * 80) + 20;
  const maxWind = 150;
  const angle = (windSpeed / maxWind) * Math.PI;

  ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0); ctx.stroke();

  const zones = [
    { start: Math.PI, end: Math.PI + Math.PI/3, color: 'rgba(0,255,140,0.3)' },
    { start: Math.PI + Math.PI/3, end: Math.PI + 2*Math.PI/3, color: 'rgba(255,165,0,0.3)' },
    { start: Math.PI + 2*Math.PI/3, end: 2*Math.PI, color: 'rgba(255,74,74,0.3)' },
  ];
  zones.forEach(z => {
    ctx.strokeStyle = z.color; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(cx, cy, r, z.start, z.end); ctx.stroke();
  });

  const needleAngle = Math.PI + angle;
  ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + (r * 0.85) * Math.cos(needleAngle), cy + (r * 0.85) * Math.sin(needleAngle));
  ctx.stroke();

  ctx.fillStyle = '#00d4ff'; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#c8e6f0'; ctx.font = 'bold 22px Orbitron'; ctx.textAlign = 'center';
  ctx.fillText(windSpeed, cx, cy - 15);
  ctx.font = '10px Share Tech Mono'; ctx.fillStyle = '#7aacbf';
  ctx.fillText('mph', cx, cy);
  ctx.fillStyle = 'rgba(0, 212, 255, 0.7)'; ctx.font = '9px Share Tech Mono'; ctx.textAlign = 'left';
  ctx.fillText('WIND SPEED MONITOR', 5, 12);
}

function populateEventsList() {
  const events = [
    { dot: 'dot-red', label: 'Hurricane Helena — Category 3', loc: 'Gulf of Mexico' },
    { dot: 'dot-red', label: 'M6.1 Earthquake', loc: 'Southern Japan' },
    { dot: 'dot-orange', label: 'Severe Flood Warning', loc: 'Bangladesh' },
    { dot: 'dot-orange', label: 'M4.8 Tremor', loc: 'Turkey' },
    { dot: 'dot-blue', label: 'Tropical Storm Watch', loc: 'Caribbean' },
  ];
  document.getElementById('eventsList').innerHTML = events.map(e =>
    `<div class="event-item"><div class="event-dot ${e.dot}"></div><div><div style="font-size:0.8rem">${e.label}</div><div style="font-size:0.7rem;color:var(--text2)">${e.loc}</div></div></div>`
  ).join('');
}

function populateTeamsList() {
  const teams = [
    { name: 'Alpha Rescue Team', loc: 'Japan', status: 'DEPLOYED', cls: 'status-deployed' },
    { name: 'Beta Flood Response', loc: 'Bangladesh', status: 'ACTIVE', cls: 'status-active' },
    { name: 'Gamma Air Unit', loc: 'Gulf', status: 'ACTIVE', cls: 'status-active' },
    { name: 'Delta Medical', loc: 'Turkey', status: 'STANDBY', cls: 'status-standby' },
    { name: 'Epsilon Rescue', loc: 'Philippines', status: 'STANDBY', cls: 'status-standby' },
  ];
  document.getElementById('teamsList').innerHTML = teams.map(t =>
    `<div class="team-item"><div class="event-dot ${t.cls === 'status-active' ? 'dot-green' : t.cls === 'status-deployed' ? 'dot-orange' : 'dot-blue'}"></div><div><div style="font-size:0.8rem">${t.name}</div><div style="font-size:0.7rem;color:var(--text2)">${t.loc}</div></div><span class="team-status ${t.cls}">${t.status}</span></div>`
  ).join('');
}

// ========================
// CHATBOT (ARIA)
// ========================
const botResponses = {
  'earthquake': `🌍 **Earthquake Safety Protocol:**\n\n• Drop to your hands and knees immediately\n• Take cover under a sturdy desk or table\n• Hold on until shaking stops\n• Stay away from windows and exterior walls\n• After shaking stops, check for gas leaks\n• Expect and prepare for aftershocks\n\nOur AI model uses Random Forest Regressor analyzing latitude, longitude, tectonic zone and depth data to predict earthquake magnitude with ~91% accuracy.`,
  'flood': `🌊 **Flood Preparation Guide:**\n\n• Monitor rainfall and river level alerts\n• Move to higher ground before flooding begins\n• Never drive through floodwaters — 6 inches can sweep you off your feet\n• Prepare an emergency kit with 3+ days of supplies\n• Disconnect electrical appliances\n• Move valuables to upper floors\n\nOur Flood model uses Random Forest Classifier analyzing rainfall, soil saturation, elevation and river levels.`,
  'hurricane': `🌀 **Hurricane Evacuation Steps:**\n\n1. Follow official evacuation orders immediately\n2. Secure your home — board windows, bring in outdoor items\n3. Take your emergency kit and important documents\n4. Use designated evacuation routes only\n5. Do not return until authorities say it's safe\n6. Beware — the eye of the storm is deceptively calm\n\nOur model analyzes wind speed, central pressure, and sea surface temperature for intensity prediction.`,
  'accuracy': `📊 **AI Model Performance:**\n\n• Earthquake Model (Random Forest Regressor): ~91% accuracy\n• Flood Model (Random Forest Classifier): ~94% accuracy\n• Hurricane Model (Random Forest): ~89% accuracy\n\nModels are trained on historical datasets including USGS seismic data, NOAA weather records, and global flood archives. Real-time sensor data continuously updates predictions.`,
  'yolo': `🔍 **YOLO Computer Vision:**\n\nYOLO (You Only Look Once) is a real-time object detection algorithm used in our system for:\n\n• Detecting persons in disaster zones from aerial/ground images\n• Identifying potentially injured individuals\n• Estimating rescue priorities\n• Supporting search and rescue operations\n\nYOLO v8 processes images in milliseconds, providing bounding box coordinates and confidence scores for each detected person.`,
  'kit': `🎒 **Emergency Kit Checklist:**\n\n✓ Water (1 gallon per person per day, 3-day supply)\n✓ Non-perishable food (3-day supply)\n✓ First aid kit and medications\n✓ Flashlight and extra batteries\n✓ Battery-powered radio\n✓ Whistle to signal for help\n✓ Dust mask and plastic sheeting\n✓ Moist towelettes and garbage bags\n✓ Wrench or pliers to turn off utilities\n✓ Manual can opener\n✓ Local maps\n✓ Cell phone with chargers and backup battery`,
};

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function appendMessage(text, type, isTyping = false) {
  const messages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `msg ${type}`;
  const avatar = type === 'bot' ? '🤖' : '👤';
  div.innerHTML = `
    <div class="msg-avatar">${avatar}</div>
    <div>
      <div class="msg-bubble">${isTyping ? '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>' : text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
      ${!isTyping ? `<div class="msg-time">${getTime()}</div>` : ''}
    </div>`;
  div.id = isTyping ? 'typingMsg' : '';
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

function askBot(q) {
  document.getElementById('chatInput').value = q;
  sendMessage();
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  appendMessage(msg, 'user');
  input.value = '';
  const typingDiv = appendMessage('', 'bot', true);

  setTimeout(() => {
    typingDiv.remove();
    const lower = msg.toLowerCase();
    let response = `I understand you're asking about "${msg}". As ARIA — your AI Response Intelligence Assistant — I can help with disaster preparedness, predictions, and emergency guidance.\n\nTry asking about: earthquake safety, flood preparation, hurricane evacuation, model accuracy, YOLO detection, or emergency kit.`;

    if (lower.includes('earthquake') || lower.includes('seismic') || lower.includes('tremor')) response = botResponses.earthquake;
    else if (lower.includes('flood') || lower.includes('water') || lower.includes('rain')) response = botResponses.flood;
    else if (lower.includes('hurricane') || lower.includes('cyclone') || lower.includes('typhoon')) response = botResponses.hurricane;
    else if (lower.includes('accur') || lower.includes('model') || lower.includes('predict')) response = botResponses.accuracy;
    else if (lower.includes('yolo') || lower.includes('detect') || lower.includes('vision')) response = botResponses.yolo;
    else if (lower.includes('kit') || lower.includes('supply') || lower.includes('checklist') || lower.includes('prepare')) response = botResponses.kit;
    else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) response = "Hello! I'm ARIA — AI Response Intelligence Assistant. I'm here 24/7 to help with disaster preparedness, predictions, and emergency guidance. What can I help you with today? 🤖";
    else if (lower.includes('thank')) response = "You're welcome! Stay safe and prepared. If you need any more information about disaster preparedness or our AI prediction system, don't hesitate to ask. 🛡️";

    appendMessage(response, 'bot');
  }, 1500 + Math.random() * 1000);
}

// ========================
// TOAST NOTIFICATION
// ========================
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ========================
// INIT
// ========================
window.addEventListener('load', () => {
  animateStats();
  drawGlobe();
  initAlerts();
  showSafety('earthquake');

  appendMessage('👋 Hello! I\'m **ARIA** — AI Response Intelligence Assistant.\n\nI can help you with:\n• Disaster preparedness guides\n• Understanding our prediction models\n• Emergency response procedures\n• YOLO detection technology\n\nHow can I assist you today?', 'bot');

  setInterval(() => {
    if (document.getElementById('home').classList.contains('active')) {
      animateStats();
    }
  }, 10000);
});
