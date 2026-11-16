(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }

  var standalone =
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone;
  if (standalone) return; // app already install hai

  var deferred = null;
  var btn = null;

  function show(onclick) {
    if (btn) btn.remove();
    btn = document.createElement('button');
    btn.textContent = '📲 App install karo';
    btn.setAttribute(
      'style',
      'position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom));z-index:99999;' +
        'padding:12px 18px;border:0;border-radius:999px;background:#f59e0b;color:#111;' +
        'font:600 15px system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.35);cursor:pointer'
    );
    btn.onclick = onclick;
    document.body.appendChild(btn);
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    show(function () {
      deferred.prompt();
      deferred.userChoice.then(function () {
        deferred = null;
        if (btn) btn.remove();
      });
    });
  });

  window.addEventListener('appinstalled', function () {
    if (btn) btn.remove();
  });

  // iPhone/iPad par browser install prompt nahi deta, isliye hint dikhate hain.
  if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
    window.addEventListener('load', function () {
      show(function () {
        alert('Safari mein neeche Share button dabao, phir "Add to Home Screen" chuno.');
      });
    });
  }
})();
