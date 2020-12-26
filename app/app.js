(function() {
  const d = new Date().toLocaleString('en-US', {weekday: 'long'});
  document.getElementById('welcome-msg').innerHTML = 'Happy ' + d + '! :)';
})();