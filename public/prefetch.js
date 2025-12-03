// Advanced prefetching for faster navigation
(function() {
  'use strict';
  
  const prefetchCache = new Set();
  const prefetchDelay = 100; // ms delay before prefetching
  
  function prefetchPage(href) {
    if (prefetchCache.has(href)) return;
    prefetchCache.add(href);
    
    // Use link prefetch
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = 'document';
    document.head.appendChild(link);
    
    // Also try to fetch and cache in service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      fetch(href, { method: 'HEAD' }).catch(() => {});
    }
  }
  
  // Prefetch links on mouseenter with delay
  document.addEventListener('DOMContentLoaded', function() {
    // Get base path for GitHub Pages
    const basePath = window.location.pathname.split('/').slice(0, 2).join('/') || '';
    
    const links = document.querySelectorAll('a[href^="/"]');
    const timeouts = new Map();
    
    links.forEach(function(link) {
      const href = link.getAttribute('href');
      if (!href || href.includes('#') || link.getAttribute('target') === '_blank') {
        return;
      }
      
      // Skip prefetching for non-existent admin sub-routes
      // Only prefetch actual routes (not /admin/bookings, /admin/calendar, etc.)
      if (href.startsWith('/admin/') && href !== '/admin/') {
        return;
      }
      
      // Normalize href with base path and ensure trailing slash for static export
      let normalizedHref = basePath ? basePath + href : href;
      if (!normalizedHref.endsWith('/') && !normalizedHref.includes('#')) {
        normalizedHref += '/';
      }
      
      link.addEventListener('mouseenter', function() {
        const timeoutId = setTimeout(() => {
          prefetchPage(normalizedHref);
          timeouts.set(link, timeoutId);
        }, prefetchDelay);
      }, { passive: true });
      
      link.addEventListener('mouseleave', function() {
        const timeoutId = timeouts.get(link);
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeouts.delete(link);
        }
      }, { passive: true });
      
      // Prefetch on touchstart for mobile
      link.addEventListener('touchstart', function() {
        prefetchPage(normalizedHref);
      }, { passive: true, once: true });
    });
    
    // Prefetch visible links in viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const href = entry.target.getAttribute('href');
            if (href && href.startsWith('/')) {
              // Skip non-existent admin sub-routes
              if (href.startsWith('/admin/') && href !== '/admin/') {
                return;
              }
              let normalizedHref = basePath ? basePath + href : href;
              if (!normalizedHref.endsWith('/') && !normalizedHref.includes('#')) {
                normalizedHref += '/';
              }
              setTimeout(() => prefetchPage(normalizedHref), 500);
            }
          }
        });
      }, { rootMargin: '50px' });
      
      links.forEach(link => observer.observe(link));
    }
  });
})();

