// Suppress RSC (React Server Components) fetch errors in static export
// These errors occur because Next.js tries to fetch RSC data that doesn't exist in static export

(function() {
  'use strict';
  
  // Override fetch to catch and suppress RSC-related 404 errors
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    
    // Check if this is an RSC data request
    if (typeof url === 'string' && (url.includes('_rsc=') || url.includes('index.txt'))) {
      // Return a rejected promise that we'll catch silently
      return Promise.reject(new Error('RSC data not available in static export')).catch(() => {
        // Return a mock response to prevent console errors
        return new Response(null, { status: 404, statusText: 'Not Found' });
      });
    }
    
    // For other requests, use original fetch but catch 404s silently
    return originalFetch.apply(this, args).catch(error => {
      // Only suppress 404s for RSC-related requests
      if (error.message && error.message.includes('404')) {
        console.debug('Suppressed 404 for:', url);
      }
      throw error;
    });
  };
  
  // Also suppress errors from link prefetch
  document.addEventListener('error', function(e) {
    const target = e.target;
    if (target && target.tagName === 'LINK' && target.rel === 'prefetch') {
      const href = target.href;
      if (href && (href.includes('_rsc=') || href.includes('index.txt'))) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }, true);
})();

