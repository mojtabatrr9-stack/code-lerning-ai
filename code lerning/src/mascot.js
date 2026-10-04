/* =====================================================================
   هوشیکا · شخصیت برند
   ربات معلم: SVG اختصاصی، حالت‌های احساسی، حباب گفتگو و آواتار رقبا
   ===================================================================== */
(function () {
  'use strict';

  /* گرادیان‌های مشترک؛ یک بار در بدنهٔ صفحه تزریق می‌شوند */
  function sprite() {
    return '' +
      '<svg class="hk-sprite" width="0" height="0" aria-hidden="true" focusable="false">' +
      '<defs>' +
      '<linearGradient id="hkMetal" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#33507f"/><stop offset="0.45" stop-color="#1a2b4d"/><stop offset="1" stop-color="#0e1a33"/>' +
      '</linearGradient>' +
      '<linearGradient id="hkVisor" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#071228"/><stop offset="1" stop-color="#0d1d3c"/>' +
      '</linearGradient>' +
      '<linearGradient id="hkIcy" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#e8f7ff"/><stop offset="1" stop-color="#4de2ff"/>' +
      '</linearGradient>' +
      '<linearGradient id="hkCap" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#8b7dff"/><stop offset="1" stop-color="#4a3fbb"/>' +
      '</linearGradient>' +
      '<radialGradient id="hkGlow"><stop offset="0" stop-color="#4de2ff" stop-opacity="0.55"/>' +
      '<stop offset="1" stop-color="#4de2ff" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="hkBody" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#2a4272"/><stop offset="1" stop-color="#101b36"/>' +
      '</linearGradient>' +
      '</defs></svg>';
  }

  /* ------------------------------------------------------------ ربات کامل */
  function svg(opt) {
    opt = opt || {};
    var m = opt.mood || 'idle';
    var cls = 'hk-robot mood-' + m + (opt.cls ? ' ' + opt.cls : '');
    var style = opt.size ? ' style="--hk-size:' + opt.size + '"' : '';
    return '' +
      '<span class="' + cls + '"' + style + ' data-mood="' + m + '">' +
      '<svg viewBox="0 0 220 250" role="img" aria-label="هوشیکا، ربات معلم">' +
      /* هاله‌ها */
      '<circle class="hk-halo" cx="110" cy="118" r="96" fill="url(#hkGlow)"/>' +
      '<g class="hk-ring">' +
      '<circle cx="110" cy="120" r="88" fill="none" stroke="#4de2ff" stroke-opacity="0.18" stroke-width="1.2" stroke-dasharray="6 10"/>' +
      '<circle cx="110" cy="120" r="74" fill="none" stroke="#8b7dff" stroke-opacity="0.14" stroke-width="1" stroke-dasharray="3 12"/>' +
      '</g>' +
      /* آنتن */
      '<g class="hk-antenna">' +
      '<path d="M110 52 L110 30" stroke="#8fa9d6" stroke-width="3" stroke-linecap="round"/>' +
      '<circle class="hk-orb" cx="110" cy="24" r="7" fill="url(#hkIcy)"/>' +
      '<circle cx="110" cy="24" r="12" fill="#4de2ff" fill-opacity="0.16"/>' +
      '</g>' +
      /* کلاه فارغ‌التحصیلی */
      '<g class="hk-cap" transform="rotate(-9 110 30)">' +
      '<rect x="86" y="24" width="48" height="13" rx="5" fill="#1b2b4c" stroke="#8b7dff" stroke-opacity="0.55"/>' +
      '<path d="M110 4 L166 20 L110 36 L54 20 Z" fill="url(#hkCap)"/>' +
      '<path d="M166 20 L172 46" stroke="#e8f7ff" stroke-width="2.4" stroke-linecap="round"/>' +
      '<circle cx="172" cy="50" r="5" fill="#9bff7a"/>' +
      '</g>' +
      /* سر */
      '<rect x="52" y="52" width="116" height="90" rx="32" fill="url(#hkMetal)" stroke="#6f9bd6" stroke-opacity="0.45" stroke-width="1.4"/>' +
      '<rect x="40" y="80" width="12" height="30" rx="6" fill="#233a63"/>' +
      '<rect x="168" y="80" width="12" height="30" rx="6" fill="#233a63"/>' +
      /* ویزر */
      '<rect x="66" y="72" width="88" height="48" rx="20" fill="url(#hkVisor)" stroke="#4de2ff" stroke-opacity="0.28"/>' +
      /* چشم‌های باز */
      '<g class="hk-eyes-open">' +
      '<rect class="hk-eye-l" x="80" y="86" width="20" height="16" rx="8" fill="url(#hkIcy)"/>' +
      '<rect class="hk-eye-r" x="120" y="86" width="20" height="16" rx="8" fill="#8b7dff"/>' +
      '</g>' +
      /* چشم‌های خوشحال */
      '<g class="hk-eyes-happy">' +
      '<path d="M80 96 q10 -14 20 0" fill="none" stroke="#4de2ff" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M120 96 q10 -14 20 0" fill="none" stroke="#8b7dff" stroke-width="4" stroke-linecap="round"/>' +
      '</g>' +
      /* چشم‌های متفکر */
      '<g class="hk-eyes-think">' +
      '<circle cx="88" cy="94" r="6" fill="#4de2ff"/>' +
      '<circle cx="132" cy="94" r="6" fill="#8b7dff"/>' +
      '<circle class="hk-dots" cx="110" cy="132" r="3" fill="#4de2ff"/>' +
      '</g>' +
      /* دهان‌ها */
      '<path class="hk-mouth-smile" d="M96 134 q14 12 28 0" fill="none" stroke="#9fd8ff" stroke-width="3.4" stroke-linecap="round"/>' +
      '<ellipse class="hk-mouth-o" cx="110" cy="136" rx="8" ry="9" fill="#0b1830" stroke="#9fd8ff" stroke-width="2.6"/>' +
      '<path class="hk-mouth-flat" d="M98 136 h24" fill="none" stroke="#9fd8ff" stroke-width="3.4" stroke-linecap="round"/>' +
      /* بدن */
      '<rect x="60" y="146" width="100" height="80" rx="28" fill="url(#hkBody)" stroke="#6f9bd6" stroke-opacity="0.4" stroke-width="1.4"/>' +
      '<rect x="82" y="164" width="56" height="34" rx="12" fill="#08152c" stroke="#4de2ff" stroke-opacity="0.3"/>' +
      '<polyline class="hk-core" points="90,184 98,184 103,172 110,194 117,178 123,184 130,184" fill="none" stroke="#9bff7a" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<circle class="hk-led" cx="110" cy="210" r="4" fill="#9bff7a"/>' +
      /* بازوها */
      '<rect class="hk-arm-l" x="34" y="158" width="22" height="52" rx="11" fill="#1f3560" stroke="#6f9bd6" stroke-opacity="0.3"/>' +
      '<rect class="hk-arm-r" x="164" y="158" width="22" height="52" rx="11" fill="#1f3560" stroke="#6f9bd6" stroke-opacity="0.3"/>' +
      /* پاهای شناور */
      '<rect x="86" y="228" width="18" height="16" rx="8" fill="#182a4d"/>' +
      '<rect x="116" y="228" width="18" height="16" rx="8" fill="#182a4d"/>' +
      '<ellipse class="hk-shadow" cx="110" cy="246" rx="52" ry="6" fill="#4de2ff" fill-opacity="0.16"/>' +
      /* جرقه‌ها (حالت افتخار) */
      '<g class="hk-sparks">' +
      '<path d="M42 62 l5 10 10 5 -10 5 -5 10 -5 -10 -10 -5 10 -5z" fill="#ffc94d"/>' +
      '<path d="M180 96 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#9bff7a"/>' +
      '</g>' +
      '</svg>' +
      '</span>';
  }

  /* ------------------------------------------------------------ سر ربات (لوگو) */
  function head(size) {
    var s = size || 34;
    return '' +
      '<svg class="hk-head" width="' + s + '" height="' + s + '" viewBox="0 0 64 64" aria-hidden="true">' +
      '<rect x="6" y="18" width="52" height="38" rx="14" fill="url(#hkMetal)" stroke="#4de2ff" stroke-opacity="0.5"/>' +
      '<rect x="14" y="27" width="15" height="12" rx="6" fill="url(#hkIcy)"/>' +
      '<rect x="35" y="27" width="15" height="12" rx="6" fill="#8b7dff"/>' +
      '<path d="M32 18 V8" stroke="#8fa9d6" stroke-width="2.6" stroke-linecap="round"/>' +
      '<circle cx="32" cy="6" r="4" fill="#9bff7a"/>' +
      '<path d="M24 46 q8 6 16 0" fill="none" stroke="#9fd8ff" stroke-width="2.4" stroke-linecap="round"/>' +
      '</svg>';
  }

  /* ------------------------------------------------------------ آواتار رقبا */
  function avatar(kind, color) {
    var k = (kind || 'robot-a').slice(-1);
    var eyes = {
      a: '<rect x="13" y="24" width="11" height="9" rx="4.5" fill="#4de2ff"/><rect x="30" y="24" width="11" height="9" rx="4.5" fill="#4de2ff"/>',
      b: '<circle cx="18" cy="28" r="5" fill="#9bff7a"/><circle cx="36" cy="28" r="5" fill="#9bff7a"/>',
      c: '<path d="M12 30 q6 -9 12 0" fill="none" stroke="#ffc94d" stroke-width="3" stroke-linecap="round"/><path d="M30 30 q6 -9 12 0" fill="none" stroke="#ffc94d" stroke-width="3" stroke-linecap="round"/>',
      d: '<rect x="13" y="24" width="11" height="9" rx="4.5" fill="#ff7bb0"/><rect x="30" y="24" width="11" height="9" rx="4.5" fill="#4de2ff"/>',
      e: '<circle cx="18" cy="28" r="5" fill="#8b7dff"/><circle cx="36" cy="28" r="3.5" fill="#8b7dff"/>',
      f: '<rect x="13" y="25" width="11" height="7" rx="3.5" fill="#b4d9ff"/><rect x="30" y="25" width="11" height="7" rx="3.5" fill="#b4d9ff"/>'
    }[k] || '<rect x="13" y="24" width="11" height="9" rx="4.5" fill="#4de2ff"/><rect x="30" y="24" width="11" height="9" rx="4.5" fill="#8b7dff"/>';
    var c = color || '#4de2ff';
    return '' +
      '<svg class="hk-avatar" viewBox="0 0 56 56" aria-hidden="true">' +
      '<circle cx="28" cy="28" r="28" fill="' + c + '" fill-opacity="0.14"/>' +
      '<rect x="8" y="16" width="40" height="30" rx="12" fill="url(#hkMetal)" stroke="' + c + '" stroke-opacity="0.5"/>' +
      eyes +
      '<path d="M22 40 q6 5 12 0" fill="none" stroke="#9fd8ff" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M28 16 V9" stroke="#8fa9d6" stroke-width="2" stroke-linecap="round"/>' +
      '<circle cx="28" cy="7" r="3" fill="' + c + '"/>' +
      '</svg>';
  }

  /* ------------------------------------------------------------ حباب گفتگو */
  function bubble(text, opt) {
    opt = opt || {};
    return '' +
      '<div class="hk-say ' + (opt.cls || '') + '" data-typing="' + (opt.type === false ? '0' : '1') + '">' +
      '<div class="hk-say-body"><p class="hk-say-text">' + text + '</p></div>' +
      '<span class="hk-say-tail"></span>' +
      '</div>';
  }

  /* تایپ تدریجی متن؛ اگر کاربر انیمیشن نخواهد، مستقیم نوشته می‌شود */
  function type(el, text, speed) {
    if (!el) return;
    var node = el.querySelector('.hk-say-text') || el;
    if (window.HSKFX && !window.HSKFX.motionOn()) { node.textContent = text; return; }
    node.textContent = '';
    var i = 0, step = speed || 14;
    clearInterval(node._hskT);
    node._hskT = setInterval(function () {
      i++;
      node.textContent = text.slice(0, i);
      if (i >= text.length) clearInterval(node._hskT);
    }, step);
  }

  /* تغییر حالت ربات + واکنش کوتاه */
  function mood(root, name, hold) {
    var nodes = root ? [root] : Array.prototype.slice.call(document.querySelectorAll('.hk-robot'));
    nodes.forEach(function (n) {
      if (!n) return;
      Array.prototype.slice.call(n.classList).forEach(function (c) {
        if (c.indexOf('mood-') === 0) n.classList.remove(c);
      });
      n.classList.add('mood-' + (name || 'idle'));
      n.setAttribute('data-mood', name || 'idle');
      if (hold) {
        clearTimeout(n._hskMood);
        n._hskMood = setTimeout(function () { mood(n, 'idle'); }, hold);
      }
    });
  }
  function react(name, hold) { mood(null, name, hold || 1600); }

  window.HKSAY = { sprite: sprite, svg: svg, head: head, avatar: avatar, bubble: bubble, type: type, mood: mood, react: react };
})();
