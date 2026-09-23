document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('nav ul');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }
});
