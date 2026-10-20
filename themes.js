// Theme branding stays in sync with the existing, persisted wallpaper setting.
function syncTheme() {
  let settings = {};
  try { settings = JSON.parse(localStorage.getItem('nw:settings')) || {}; } catch {}
  const key = ['starlight','mischevious'].includes(settings.wallpaper) ? settings.wallpaper : 'moonlight';
  const name = key.toUpperCase();
  document.documentElement.dataset.identity = key;
  document.title = name + ' OS';
  const favicon = document.querySelector('link[rel="icon"]');
  const logo = '/' + key + '-logo.svg?v=themes9';
  if (favicon.getAttribute('href') !== logo) favicon.setAttribute('href', logo);
  for (const img of document.querySelectorAll('img')) {
    if (/\/(moonlight|starlight|mischevious)-logo\.svg/.test(img.getAttribute('src') || '')) {
      if (img.getAttribute('src') !== logo) img.setAttribute('src', logo);
    }
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const edits = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('script,style,textarea,input,[contenteditable]')) continue;
    const next = node.nodeValue.replace(/(?:MOONLIGHT|STARLIGHT|MISCHEVIOUS) (OS|BROWSER)/g, name + ' $1').replace(/(?:MOONLIGHT|STARLIGHT|MISCHEVIOUS) \/ DESKTOP EDITION/g, name + ' / DESKTOP EDITION');
    if (next !== node.nodeValue) edits.push([node,next]);
  }
  for (const [node,value] of edits) node.nodeValue = value;
  for (const el of document.querySelectorAll('[aria-label]')) {
    const old = el.getAttribute('aria-label');
    const next = old.replace(/(?:MOONLIGHT|STARLIGHT|MISCHEVIOUS) OS/g, name + ' OS');
    if (next !== old) el.setAttribute('aria-label', next);
  }
}
let queued = false;
function scheduleTheme() {
  if (queued) return;
  queued = true;
  queueMicrotask(() => { queued = false; syncTheme(); });
}
new MutationObserver(scheduleTheme).observe(document.body, {childList:true, subtree:true});
document.addEventListener('moonlight:scene', scheduleTheme);
window.addEventListener('storage', scheduleTheme);
syncTheme();
