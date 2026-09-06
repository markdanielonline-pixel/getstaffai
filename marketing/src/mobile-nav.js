// Universal Mobile Navigation Toggle for StaffAi
(function initMobileNav() {
  function setupMenuToggle() {
    document.addEventListener('click', (e) => {
      const menuBtn = e.target.closest('.menu');
      const header = document.querySelector('header');
      if (!header) return;

      // Click on Menu Button
      if (menuBtn) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = header.classList.toggle('menu-open');
        menuBtn.textContent = isOpen ? '✕' : '☰';
        menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        return;
      }

      // Click on a nav link inside the open mobile menu
      if (e.target.closest('header.menu-open nav a')) {
        header.classList.remove('menu-open');
        const btn = header.querySelector('.menu');
        if (btn) btn.textContent = '☰';
        return;
      }

      // Click outside header closes menu
      if (header.classList.contains('menu-open') && !e.target.closest('header')) {
        header.classList.remove('menu-open');
        const btn = header.querySelector('.menu');
        if (btn) btn.textContent = '☰';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMenuToggle);
  } else {
    setupMenuToggle();
  }
})();