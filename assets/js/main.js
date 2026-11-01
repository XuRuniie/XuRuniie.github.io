(() => {
  'use strict';
  const filters = document.querySelector('.publication-filters');
  if (filters) {
    const publications = [...document.querySelectorAll('.publication')];
    const announcement = document.querySelector('.filter-announcement');
    const filter = (value, announce) => {
      let visible = 0;
      publications.forEach(article => {
        article.hidden = value === 'selected' && article.dataset.selected !== 'true';
        if (!article.hidden) visible += 1;
      });
      filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
      if (announce && announcement) announcement.textContent = `${visible} ${value === 'selected' ? 'selected ' : ''}publications shown.`;
    };
    filters.hidden = false;
    filter('selected', false);
    filters.addEventListener('click', event => {
      const button = event.target.closest('button[data-filter]');
      if (button) filter(button.dataset.filter, true);
    });
  }

  document.querySelectorAll('.copy-citation').forEach(button => {
    button.addEventListener('click', async () => {
      const original = button.innerHTML;
      try {
        await navigator.clipboard.writeText(button.dataset.citation);
        button.textContent = 'Copied ✓';
      } catch {
        const article = button.closest('article');
        let citation = article.querySelector('.citation-fallback');
        if (!citation) {
          citation = document.createElement('textarea');
          citation.className = 'citation-fallback';
          citation.setAttribute('aria-label', 'Citation — select and copy');
          citation.readOnly = true;
          citation.style.cssText = 'width:100%;min-height:100px;margin-top:12px;padding:10px;border:1px solid #ddd;font:11px/1.6 monospace;';
          citation.value = button.dataset.citation;
          article.querySelector('.publication-body').appendChild(citation);
        }
        citation.focus();
        citation.select();
        button.textContent = 'Select & copy';
      }
      window.setTimeout(() => { button.innerHTML = original; }, 2500);
    });
  });

  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-10% 0px -55% 0px', threshold: 0 });
    links.forEach(link => { const section = document.querySelector(link.hash); if (section) observer.observe(section); });
  }
})();
