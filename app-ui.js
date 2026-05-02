/* ============================================================
   MINTYNEX — UI & ANIMATIONS  (app-ui.js) [ENHANCED]
   + Premium/Free access control
   + Trial popup on login
   + Admin premium monitoring tab
   ============================================================ */

/* ── Premium State ── */
var PREMIUM = {
  active: false,     // is user premium/trial?
  isTrial: false,
  trialDaysLeft: 7,
  plan: 'free',      // 'free' | 'trial' | 'monthly' | 'yearly'
  trialShown: false
};

/* Pages that require premium */
var PREMIUM_PAGES = ['binder', 'trade', 'mart', 'messages', 'notifs'];
var PREMIUM_ACTIONS = ['proposetrade','addcart','buynow','friend'];

/* ─────────────────────────────────────────────
   TOAST NOTIFICATIONS
───────────────────────────────────────────── */
let toastTimer = null;
window.showToast = function(msg, type) {
  type = type || '';
  const el = document.getElementById('toast');
  if (!el) return;
  if (toastTimer) clearTimeout(toastTimer);
  el.textContent = msg;
  el.className = 'toast' + (type ? ' ' + type : '');
  el.classList.add('on');
  toastTimer = setTimeout(() => el.classList.remove('on'), 3000);
};

/* ─────────────────────────────────────────────
   PREMIUM GATE
───────────────────────────────────────────── */
window.openPremiumModal = function(reason) {
  reason = reason || 'Unlock full access';
  const m = document.getElementById('premiumModal');
  if (m) {
    document.getElementById('premReasonText').textContent = reason;
    m.style.display = 'flex';
    setTimeout(() => m.classList.add('on'), 10);
  }
};
window.closePremiumModal = function() {
  const m = document.getElementById('premiumModal');
  if (m) { m.classList.remove('on'); setTimeout(() => m.style.display = 'none', 250); }
};

window.activateTrial = function() {
  PREMIUM.active = true;
  PREMIUM.isTrial = true;
  PREMIUM.plan = 'trial';
  PREMIUM.trialDaysLeft = 7;
  closePremiumModal();
  closeTrialPopup();
  updatePremiumBadge();
  showToast('🎉 7-day trial activated! Enjoy Premium!', 'grn');
};

window.activatePremium = function(plan) {
  PREMIUM.active = true;
  PREMIUM.isTrial = false;
  PREMIUM.plan = plan || 'monthly';
  closePremiumModal();
  updatePremiumBadge();
  showToast('✅ Premium activated! Welcome to MintyNex Premium!', 'grn');
};

function updatePremiumBadge() {
  const badge = document.getElementById('premBadge');
  if (!badge) return;
  if (PREMIUM.plan === 'trial') {
    badge.textContent = 'TRIAL';
    badge.className = 'premium-nav-badge';
  } else if (PREMIUM.plan !== 'free') {
    badge.textContent = 'PREMIUM';
    badge.className = 'premium-nav-badge';
  } else {
    badge.textContent = 'FREE';
    badge.className = 'free-badge';
  }
}

function checkPremiumGate(pageId) {
  if (PREMIUM.active) return true;
  if (PREMIUM_PAGES.includes(pageId)) {
    openPremiumModal('Access ' + pageId.charAt(0).toUpperCase() + pageId.slice(1));
    return false;
  }
  return true;
}

/* ─────────────────────────────────────────────
   TRIAL POPUP (post-login)
───────────────────────────────────────────── */
window.closeTrialPopup = function() {
  const p = document.getElementById('trialPopup');
  if (p) p.classList.remove('on');
  PREMIUM.trialShown = true;
};

function showTrialPopup() {
  if (PREMIUM.trialShown || PREMIUM.active) return;
  const p = document.getElementById('trialPopup');
  if (p) setTimeout(() => p.classList.add('on'), 900);
}

/* ─────────────────────────────────────────────
   BOTTOM NAVIGATION
───────────────────────────────────────────── */
function initBottomNav() {
  document.querySelectorAll('.gbn[data-pg]').forEach(btn => {
    btn.addEventListener('click', () => showPg(btn.getAttribute('data-pg')));
  });
}

/* ─────────────────────────────────────────────
   PAGE SWITCHING
───────────────────────────────────────────── */
window.showPg = function(id) {
  if (!id) return;
  if (!checkPremiumGate(id)) return;

  document.querySelectorAll('.pg').forEach(p => p.classList.remove('on'));
  const target = document.getElementById('pg-' + id);
  if (target) {
    target.classList.add('on');
    const scr = target.querySelector('.scr');
    if (scr) scr.scrollTop = 0;
  }
  document.querySelectorAll('.gbn').forEach(b => b.classList.toggle('on', b.getAttribute('data-pg') === id));
  document.querySelectorAll('.dta').forEach(b => b.classList.toggle('on', b.getAttribute('data-pg') === id));
  document.querySelectorAll('.sni[data-pg]').forEach(b => b.classList.toggle('on', b.getAttribute('data-pg') === id));

  if (id === 'feed') renderFeed();
  if (id === 'binder') renderBinder();
  if (id === 'players' || id === 'trade') { if (typeof renderPartners === 'function') renderPartners(TRAINERS); }
};

/* ─────────────────────────────────────────────
   PROFILE / TRADE / ADMIN TABS
───────────────────────────────────────────── */
window.profTab = function(tab) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.toggle('on', t.getAttribute('data-tab') === tab));
  document.querySelectorAll('.ptab-sec').forEach(s => s.classList.toggle('on', s.id === 'pt-' + tab));
};
window.tradeTab = function(tab) {
  document.querySelectorAll('#tradeTabs .atab').forEach(t => t.classList.toggle('on', t.getAttribute('data-tt') === tab));
  document.querySelectorAll('.tt-s').forEach(s => s.classList.toggle('on', s.id === 'tt-' + tab));
};
window.toggleDrop = function() {
  const dr = document.getElementById('avDrop');
  if (dr) dr.classList.toggle('on');
};

/* ─────────────────────────────────────────────
   MODALS
───────────────────────────────────────────── */
window.openCard = function(idx) {
  const cards = [
    { name:'Charizard VMAX', grade:'PSA 10', val:'$310', em:'🔥' },
    { name:'Lugia V Alt Art', grade:'BGS 9.5', val:'$260', em:'💎' },
    { name:'Rayquaza VMAX',  grade:'PSA 9',  val:'$195', em:'🐉' },
  ];
  const card = cards[idx] || cards[0];
  const nm = document.getElementById('mNm'); const gr = document.getElementById('mGr');
  const gr2 = document.getElementById('mGr2'); const em = document.getElementById('mEm');
  if (nm) nm.textContent = card.name;
  if (gr) gr.textContent = card.grade;
  if (gr2) gr2.textContent = card.grade;
  if (em) em.innerHTML = `<div style="font-size:56px;text-align:center;line-height:1">${card.em}</div>`;
  const modal = document.getElementById('cardModal');
  if (modal) modal.classList.add('on');
};

let VERIFY_STEP = 0;
window.openVerify = function() { VERIFY_STEP=0; showVerifyStep(0); const m=document.getElementById('verifyModal'); if(m) m.classList.add('on'); };
window.closeVerify = function() { const m=document.getElementById('verifyModal'); if(m) m.classList.remove('on'); };
window.nextVerifyStep = function() { showVerifyStep(VERIFY_STEP+1); };
window.showVerifyStep = function(step) {
  VERIFY_STEP = step;
  document.querySelectorAll('.verify-step').forEach((s,i) => s.classList.toggle('on', i===step));
  document.querySelectorAll('.vp-step').forEach((s,i) => { s.classList.toggle('done', i<step); s.classList.toggle('active', i===step); });
};

/* ─────────────────────────────────────────────
   LOGIN / LOGOUT
───────────────────────────────────────────── */
window.doLogin = function() {
  const u = document.getElementById('tUser');
  const p = document.getElementById('tPass');
  if (!u || !p) return;
  if (u.value.trim() && p.value.trim()) {
    USER.nm = u.value.trim();
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('shell').classList.add('on');
    if (typeof applyUserToUI === 'function') applyUserToUI();
    showPg('feed');
    updatePremiumBadge();
    showToast('Welcome back, ' + USER.nm + '! ⚡', 'grn');
    showTrialPopup();
  } else {
    showToast('Enter username and password', 'red');
  }
};

window.doRegister = function() {
  const u = document.getElementById('rUser');
  const e = document.getElementById('rEmail');
  const p = document.getElementById('rPass');
  if (!u || !e || !p) return;
  if (u.value.trim() && e.value.trim() && p.value.trim()) {
    USER.nm = u.value.trim();
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('shell').classList.add('on');
    if (typeof applyUserToUI === 'function') applyUserToUI();
    showPg('feed');
    updatePremiumBadge();
    showToast('Welcome to MintyNex! 🎉', 'grn');
    PREMIUM.trialShown = false;
    showTrialPopup();
  } else {
    showToast('Fill in all fields', 'red');
  }
};

window.doLogout = function() {
  if (!confirm('Log out of MintyNex?')) return;
  IS_IN=false; IS_ADM=false;
  PREMIUM.active=false; PREMIUM.plan='free'; PREMIUM.trialShown=false;
  document.getElementById('shell').classList.remove('on');
  document.getElementById('adm').classList.remove('on');
  document.getElementById('login-screen').classList.remove('hidden');
  const u=document.getElementById('tUser'); if(u) u.value='';
  const p=document.getElementById('tPass'); if(p) p.value='';
};

window.doAdminLogin = function() {
  const u = document.getElementById('aUser');
  const p = document.getElementById('aPass');
  if (u && p && (u.value==='admin' || u.value==='admin@mintynex.com') && p.value==='admin123') {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('adm').classList.add('on');
    showToast('Admin panel loaded', 'grn');
    renderPremiumAdminTab();
  } else {
    showToast('Invalid admin credentials', 'red');
  }
};
window.admBack = function() {
  document.getElementById('adm').classList.remove('on');
  document.getElementById('shell').classList.add('on');
  PREMIUM.active = true; PREMIUM.plan = 'monthly'; // admin gets full access
  showPg('feed');
};
window.showSec = function(sec) {
  document.querySelectorAll('#admTabs .atab').forEach(t => t.classList.toggle('on', t.getAttribute('data-as')===sec));
  document.querySelectorAll('.adm-sec').forEach(s => s.classList.toggle('on', s.id==='as-'+sec));
  if (sec === 'premium') renderPremiumAdminTab();
};

/* ─────────────────────────────────────────────
   ADMIN PREMIUM MONITORING TAB
───────────────────────────────────────────── */
var PREMIUM_USERS = [
  { nm:'TrainerAsh_KE', plan:'Trial', daysLeft:5, joined:'3 days ago', revenue:'—', status:'trial' },
  { nm:'ShinySister_TZ', plan:'Monthly', daysLeft:18, joined:'2 weeks ago', revenue:'$9.99', status:'active' },
  { nm:'PokeKing_NG', plan:'Yearly', daysLeft:312, joined:'3 months ago', revenue:'$89.99', status:'active' },
  { nm:'CardQueenZA', plan:'Monthly', daysLeft:0, joined:'1 month ago', revenue:'$9.99', status:'expired' },
  { nm:'MintFresh_KE', plan:'Trial', daysLeft:2, joined:'5 days ago', revenue:'—', status:'trial' },
  { nm:'EliteEdge_ZA', plan:'Yearly', daysLeft:201, joined:'5 months ago', revenue:'$89.99', status:'active' },
];

function renderPremiumAdminTab() {
  const sec = document.getElementById('as-premium');
  if (!sec) return;
  const totalRev = '$199.96';
  const active = PREMIUM_USERS.filter(u => u.status==='active').length;
  const trial = PREMIUM_USERS.filter(u => u.status==='trial').length;
  const expired = PREMIUM_USERS.filter(u => u.status==='expired').length;

  sec.innerHTML = `
    <div style="font-weight:800;font-size:15px;margin-bottom:10px">💎 Premium Subscriptions</div>
    <div class="g4" style="margin-bottom:12px">
      <div class="stat-b adm-premium-stat"><div class="stat-v" style="color:#f59e0b">${active}</div><div class="stat-l">Active</div></div>
      <div class="stat-b adm-premium-stat"><div class="stat-v" style="color:#fbbf24">${trial}</div><div class="stat-l">Trial</div></div>
      <div class="stat-b adm-premium-stat"><div class="stat-v" style="color:#ed4245">${expired}</div><div class="stat-l">Expired</div></div>
      <div class="stat-b adm-premium-stat"><div class="stat-v" style="color:#3ba55c">${totalRev}</div><div class="stat-l">Revenue</div></div>
    </div>
    <div class="card" style="margin-bottom:10px">
      <div style="font-weight:700;font-size:13px;margin-bottom:10px">📊 Revenue Chart (mock)</div>
      <div style="display:flex;align-items:flex-end;gap:6px;height:70px;padding:0 4px">
        ${['Jan','Feb','Mar','Apr','May','Jun'].map((m,i) => {
          const h = [30,45,38,60,72,88][i];
          return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
            <div style="width:100%;background:rgba(88,101,242,0.5);border-radius:3px 3px 0 0;height:${h}%;transition:height .5s"></div>
            <div style="font-size:8px;color:#80848e">${m}</div>
          </div>`;
        }).join('')}
      </div>
    </div>
    <div class="card">
      <div style="font-weight:700;font-size:13px;margin-bottom:10px">👥 Subscribers</div>
      ${PREMIUM_USERS.map(u => `
        <div class="adm-prem-row">
          <div>
            <div class="adm-prem-user">${u.nm}</div>
            <div class="adm-prem-meta">${u.plan} · Joined ${u.joined} · ${u.revenue}</div>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <span class="prem-status-${u.status}">${
              u.status==='active' ? '✓ Active' :
              u.status==='trial' ? `⏳ ${u.daysLeft}d left` : '✕ Expired'
            }</span>
            <button class="btn bgh bxs" onclick="showToast('Managing ${u.nm}...','')">Manage</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="card" style="margin-top:10px">
      <div style="font-weight:700;font-size:13px;margin-bottom:10px">⚙️ Premium Settings</div>
      <div class="lrow" style="justify-content:space-between"><span style="font-size:12px">Enable 7-day free trial</span><div class="tog on" data-action="toggle"><div class="tog-d"></div></div></div>
      <div class="lrow" style="justify-content:space-between"><span style="font-size:12px">Monthly plan ($9.99)</span><div class="tog on" data-action="toggle"><div class="tog-d"></div></div></div>
      <div class="lrow" style="justify-content:space-between"><span style="font-size:12px">Yearly plan ($89.99 / save 25%)</span><div class="tog on" data-action="toggle"><div class="tog-d"></div></div></div>
      <div class="lrow" style="justify-content:space-between"><span style="font-size:12px">Show upgrade prompt on app open</span><div class="tog on" data-action="toggle"><div class="tog-d"></div></div></div>
    </div>
  `;
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.feat-card,.card,.post,.ni,.tc,.tcg');
  els.forEach(el => el.classList.add('reveal'));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────────── */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target; const raw = el.textContent;
      const num = parseFloat(raw.replace(/[^0-9.]/g,''));
      if (isNaN(num)) return;
      const sfx = raw.replace(/[\d.]/g,''); const isF = raw.includes('.');
      let start = null;
      const step = ts => {
        if (!start) start=ts;
        const p = Math.min((ts-start)/1200,1), v = (1-Math.pow(1-p,3))*num;
        el.textContent = (isF ? v.toFixed(1) : Math.floor(v)) + sfx;
        if (p<1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step); obs.unobserve(el);
    });
  }, { threshold:0.5 });
  document.querySelectorAll('.hstat-val,.stat-v').forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────
   PULL TO REFRESH
───────────────────────────────────────────── */
function initPullToRefresh() {
  const scr = document.querySelector('#pg-feed .scr');
  if (!scr) return;
  let startY=0, pulling=false;
  const indicator = document.querySelector('.ptr-indicator');
  scr.addEventListener('touchstart', e => { if (scr.scrollTop===0) startY=e.touches[0].clientY; }, {passive:true});
  scr.addEventListener('touchmove', e => {
    if (!startY) return;
    if (e.touches[0].clientY - startY > 40 && scr.scrollTop===0) { pulling=true; if(indicator) indicator.classList.add('visible'); }
  }, {passive:true});
  scr.addEventListener('touchend', () => {
    if (pulling) {
      pulling=false; startY=0;
      if (indicator) { setTimeout(()=>indicator.classList.remove('visible'),1200); setTimeout(()=>{renderFeed();showToast('Feed refreshed ✓','grn');},800); }
    }
    startY=0;
  });
}

/* ─────────────────────────────────────────────
   PHOTO UPLOAD
───────────────────────────────────────────── */
window.triggerUpload = function(type) {
  const input = document.getElementById(type==='avatar'?'avatarFileInput':'bannerFileInput');
  if (input) input.click();
};
window.handlePhotoUpload = function(input, type) {
  const file=input.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload = e => {
    if (type==='avatar') {
      document.querySelectorAll('.avbtn,.dh-av').forEach(el => {
        if (el.tagName==='IMG') el.src=e.target.result;
        else { el.style.backgroundImage=`url(${e.target.result})`; el.style.backgroundSize='cover'; }
      });
    }
    if (type==='banner') { const ban=document.querySelector('.prof-ban'); if(ban){ban.style.backgroundImage=`url(${e.target.result})`;ban.style.backgroundSize='cover';} }
    showToast(type==='avatar'?'Avatar updated! 📸':'Banner updated! 🖼️','grn');
  };
  reader.readAsDataURL(file);
};

function initButtonAnimations() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn,.pab,.gbn');
    if (!btn) return;
    btn.style.transform='scale(0.94)';
    setTimeout(()=>{btn.style.transform='';},120);
  });
}
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target=document.querySelector(link.getAttribute('href'));
      if (target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});}
    });
  });
}

/* ─────────────────────────────────────────────
   GLOBAL CLICK DELEGATION
───────────────────────────────────────────── */
document.addEventListener('click', function(e) {
  // Page navigation
  const navEl = e.target.closest('[data-pg]');
  if (navEl && !navEl.closest('.drop') && !navEl.closest('.share-sheet-inner')) {
    showPg(navEl.getAttribute('data-pg')); return;
  }
  // Avatar dropdown
  if (e.target.closest('.avbtn')||e.target.id==='avBtn') { toggleDrop(); return; }
  if (!e.target.closest('.drop-wrap')) { const dr=document.getElementById('avDrop'); if(dr) dr.classList.remove('on'); }

  // Action delegation
  const actEl = e.target.closest('[data-action]');
  if (actEl) {
    const act=actEl.getAttribute('data-action');
    const nm=actEl.getAttribute('data-nm')||'';
    const idx=parseInt(actEl.getAttribute('data-idx')||'-1',10);

    // Premium-gated actions
    if (PREMIUM_ACTIONS.includes(act) && !PREMIUM.active) {
      openPremiumModal('Unlock ' + act.replace(/([A-Z])/g,' $1').trim());
      return;
    }

    if (act==='like' && idx>=0 && POSTS[idx]) {
      actEl.classList.toggle('liked');
      POSTS[idx].liked=actEl.classList.contains('liked');
      POSTS[idx].likes+=POSTS[idx].liked?1:-1;
      const span=actEl.querySelector('span'); if(span) span.textContent=POSTS[idx].likes;
      const svg=actEl.querySelector('svg');
      if(svg){svg.style.animation='none';void svg.offsetWidth;svg.style.animation='';svg.setAttribute('fill',POSTS[idx].liked?'currentColor':'none');}
      if(POSTS[idx].liked) showToast('❤️ Liked!','');
    }
    if (act==='opencomments' && idx>=0) openComments(idx);
    if (act==='submitcomment') submitComment();
    if (act==='submitpost') submitPost();
    if (act==='share' && idx>=0) openShareSheet(idx);
    if (act==='proposetrade') { proposeTrade(); }
    if (act==='friend') showToast('Friend request sent to '+(nm||'trainer')+'!','grn');
    if (act==='contact' || act==='addcart') showToast('Added to cart! 🛒','grn');
    if (act==='buynow') showToast('Purchase flow coming soon!','grn');
    if (act==='approve') showToast('Approved! ✓','grn');
    if (act==='reject') showToast('Rejected.','red');
    if (act==='accept') showToast('Trade accepted! 🤝','grn');
    if (act==='decline') showToast('Trade declined.','red');
    if (act==='markmet') showToast('Trade marked as completed! ✓','grn');
    if (act==='publishshop'||act==='publishmart') showToast('Listing published! ✓','grn');
    if (act==='applysanction') showToast('Sanction applied.','red');
    if (act==='keeppost') showToast('Post kept.','grn');
    if (act==='removepost') { actEl.closest('.card')?.remove(); showToast('Post removed.','red'); }
    if (act==='dismissreport') showToast('Report dismissed.','grn');
    if (act==='banuserfrompanel') showToast('User sanctioned.','red');
    if (act==='markallread') {
      document.querySelectorAll('.ni.unread').forEach(n=>n.classList.remove('unread'));
      const nb=document.getElementById('nBdg'); if(nb) nb.style.display='none';
    }
    if (act==='toggle') actEl.classList.toggle('on');
    if (act==='removip') actEl.closest('.card')?.remove();
    if (act==='addcard') showToast('Card picker coming soon!','grn');
    if (act==='uploadavatar') triggerUpload('avatar');
    if (act==='uploadbanner') triggerUpload('banner');
    if (act==='openverify') openVerify();
    if (act==='closeverify') closeVerify();
    if (act==='nextstep') nextVerifyStep();
    if (act==='prevstep') showVerifyStep(Math.max(0,VERIFY_STEP-1));
    if (act==='saveprofile') saveProfile();
    if (act==='sendmsg') sendMessage();
    if (act==='filtertrainers') doSearch('');
    if (act==='clearfilters') clearSearch('');
    if (act==='resolvedispute') { showToast('Dispute resolved ✓','grn'); actEl.closest('.card').style.opacity='0.5'; }
    if (act==='escalatedispute') showToast('Dispute escalated 🔺','');
    if (act==='viewtrade') showToast('Opening trade details...','');
    if (act==='closealert') { const al=actEl.closest('.alert-banner'); if(al) al.style.display='none'; }
    if (act==='startTrial') activateTrial();
    if (act==='openPremium') openPremiumModal('Upgrade to MintyNex Premium');
    return;
  }

  // Close share sheet
  const sheet=document.getElementById('shareSheet');
  if (sheet && e.target===sheet) closeShareSheet();
  // Close premium modal
  const pm=document.getElementById('premiumModal');
  if (pm && e.target===pm) closePremiumModal();

  // Close modals on backdrop
  document.querySelectorAll('.modal-bg').forEach(m => { if(e.target===m) m.classList.remove('on'); });
  if (e.target.closest('.mc')) {
    e.target.closest('.mc').closest('.modal-bg')?.classList.remove('on');
    e.target.closest('.mc').closest('.modal')?.closest('.modal-bg')?.classList.remove('on');
  }

  // Profile/trade tabs
  const ptabEl=e.target.closest('#profTabs .ptab');
  if (ptabEl){profTab(ptabEl.getAttribute('data-tab'));return;}
  const ttabEl=e.target.closest('#tradeTabs .atab');
  if (ttabEl){tradeTab(ttabEl.getAttribute('data-tt'));return;}
  const atabEl=e.target.closest('#admTabs .atab');
  if (atabEl){showSec(atabEl.getAttribute('data-as'));return;}

  if (e.target.id==='admBackBtn'||e.target.closest('#admBackBtn')) admBack();
  if (e.target.id==='admLogoutBtn'||e.target.closest('#admLogoutBtn')) { if(confirm('Log out?')) doLogout(); }
  if (e.target.id==='tradeFromBinder') { showPg('trade'); document.getElementById('cardModal')?.classList.remove('on'); }
  if (e.target.id==='searchBtn') doSearch('');
  if (e.target.id==='clearBtn') clearSearch('');
  if (e.target.id==='tSearchBtn') doSearch('t');
  if (e.target.id==='tClearBtn') clearSearch('t');
  if (e.target.id==='msgSendBtn') sendMessage();
  if (e.target.id==='commentSendBtn') submitComment();
  if (e.target.id==='postBtn') submitPost();
  if (e.target.id==='prevBtn') { if(pg>0){pg--;renderBinder();} }
  if (e.target.id==='nextBtn') { if(pg<TP-1){pg++;renderBinder();} }
});

document.addEventListener('keydown', e => {
  if (e.key!=='Enter') return;
  const id=document.activeElement?.id||'';
  if (id==='tUser'||id==='tPass') doLogin();
  if (id==='aUser'||id==='aPass') doAdminLogin();
  if (id==='msgInput'){e.preventDefault();sendMessage();}
  if (id==='commentInput'){e.preventDefault();submitComment();}
  if (id==='postInput'){e.preventDefault();submitPost();}
});

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initBottomNav();
  initReveal();
  initCounters();
  initSmoothLinks();
  initButtonAnimations();
  initPullToRefresh();

  const ai=document.getElementById('avatarFileInput');
  if(ai) ai.addEventListener('change',function(){handlePhotoUpload(this,'avatar');});
  const bi=document.getElementById('bannerFileInput');
  if(bi) bi.addEventListener('change',function(){handlePhotoUpload(this,'banner');});

  // OTP auto-advance
  document.querySelectorAll('.otp-box').forEach((box,i,all) => {
    box.addEventListener('input',()=>{if(box.value&&i<all.length-1) all[i+1].focus();});
    box.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!box.value&&i>0) all[i-1].focus();});
  });
  // Dispute filter
  document.querySelectorAll('.dispute-filter-btn').forEach(btn => {
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.dispute-filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      showToast('Filtered: '+btn.textContent.trim(),'');
    });
  });
  // Plan selector in premium modal
  document.querySelectorAll('.plan-opt').forEach(opt => {
    opt.addEventListener('click',()=>{
      document.querySelectorAll('.plan-opt').forEach(o=>o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
});
