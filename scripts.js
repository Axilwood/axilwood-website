// scripts.js
document.addEventListener("DOMContentLoaded", function() {
  // Add fade-in effect to the body
  document.body.classList.add('loaded');

  // Fetch and inject header
  fetch('/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
    });

  // Fetch and inject footer
  fetch('/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-placeholder').innerHTML = data;
    });
});