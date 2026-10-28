// Tagged ad links: kaboombit.com/go/<channel> (TRACK-2026-10-14-INSTALL-SOURCE).
// Sends a phone straight to its store with the channel tag, so App Store Connect and Google Play
// Console can count installs per ad channel. No cookies, no pixels, nothing stored.
// Until the apps are live (LIVE = false) the page only shows the two store buttons as "coming soon".
(function () {
  var STORE = {
    LIVE: true,
    appleId: '',        // App Store app id (digits). Empty until the iPhone app is released: the App Store button stays hidden
    appleToken: '',     // provider token (pt=…), from App Store Connect → campaign link
    playPackage: 'com.kaboombit.app'
  };
  function tag(name, fallback) { return (document.body.getAttribute('data-' + name) || fallback || '').replace(/[^a-z0-9_-]/gi, ''); }
  var channel = tag('channel', 'web');
  // utm_* tags for the Google Play referrer (Play Console counts installs by them). Links only, nothing stored.
  var utm = [['utm_source', tag('source', channel)], ['utm_medium', tag('medium')], ['utm_campaign', tag('campaign')], ['utm_content', tag('content')]]
    .filter(function (p) { return p[1]; })
    .map(function (p) { return p[0] + '=' + p[1]; }).join('&');

  function appleLink() {
    if (!STORE.appleId) return '';
    var q = 'ct=' + encodeURIComponent(channel) + '&mt=8' + (STORE.appleToken ? '&pt=' + encodeURIComponent(STORE.appleToken) : '');
    return 'https://apps.apple.com/app/apple-store/id' + STORE.appleId + '?' + q;
  }
  function playLink() {
    return 'https://play.google.com/store/apps/details?id=' + encodeURIComponent(STORE.playPackage) +
      '&referrer=' + encodeURIComponent(utm);
  }

  var ua = navigator.userAgent || '';
  var ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var android = /Android/.test(ua);
  var apple = appleLink();
  var play = playLink();

  if (STORE.LIVE) {
    if (ios && apple) { location.replace(apple); return; }
    if (android) { location.replace(play); return; }
  }

  var a = document.getElementById('go-apple');
  var g = document.getElementById('go-play');
  var note = document.getElementById('go-note');
  if (STORE.LIVE) {
    if (a && apple) a.href = apple;
    else if (a) a.style.display = 'none'; // iPhone app not released yet: Google Play only
    if (g) g.href = play;
  } else {
    [a, g].forEach(function (b) { if (b) { b.removeAttribute('href'); b.setAttribute('aria-disabled', 'true'); b.classList.add('is-soon'); } });
    if (note) note.hidden = false;
  }
})();
