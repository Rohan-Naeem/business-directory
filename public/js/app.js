// Mirror root app.js for public folder access
(function () {
  const script = document.createElement('script');
  script.src = '../js/app.js';
  document.head.appendChild(script);
})();
