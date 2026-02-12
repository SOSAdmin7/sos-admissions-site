/* ==========================================================================
   SOS Admissions - Main JavaScript
   ========================================================================== */

(function() {
  'use strict';

  // --------------------------------------------------------------------------
  // DOM Ready
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initStickyHeader();
    initFaqAccordion();
    initSmoothScroll();
    initTestimonialFilter();
    initEventTracking();
    initYouTubeFacade();
  });

  // --------------------------------------------------------------------------
  // Mobile Menu
  // --------------------------------------------------------------------------
  function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.mobile-nav__overlay');

    if (!menuBtn || !mobileNav) return;

    menuBtn.addEventListener('click', toggleMenu);

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Close menu when clicking a link
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        closeMenu();
      }
    });

    function toggleMenu() {
      const isOpen = mobileNav.classList.contains('active');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    function openMenu() {
      menuBtn.classList.add('active');
      mobileNav.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menuBtn.classList.remove('active');
      mobileNav.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // --------------------------------------------------------------------------
  // Sticky Header
  // --------------------------------------------------------------------------
  function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    function handleScroll() {
      const scrollY = window.scrollY;

      // Add shadow when scrolled
      if (scrollY > 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }
  }

  // --------------------------------------------------------------------------
  // FAQ Accordion
  // --------------------------------------------------------------------------
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq__item');
    if (!faqItems.length) return;

    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');

      if (!question || !answer) return;

      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(function(otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Smooth Scroll
  // --------------------------------------------------------------------------
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#" or empty
        if (href === '#' || href === '') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // Testimonial Category Filter
  // --------------------------------------------------------------------------
  function initTestimonialFilter() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    if (!filterTabs.length) return;

    const testimonialCards = document.querySelectorAll('.testimonial-card[data-category]');
    if (!testimonialCards.length) return;

    filterTabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        const category = this.getAttribute('data-filter');

        // Update active tab
        filterTabs.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');

        // Filter cards
        testimonialCards.forEach(function(card) {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // YouTube Facade (lazy-load iframe on click)
  // --------------------------------------------------------------------------
  function initYouTubeFacade() {
    var facade = document.getElementById('yt-facade');
    if (!facade) return;

    function loadVideo() {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/4J77y_ghB4k?autoplay=1';
      iframe.title = 'Interview SOS Client Testimonials';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border-radius:12px;';
      facade.innerHTML = '';
      facade.appendChild(iframe);
    }

    facade.addEventListener('click', loadVideo);
  }

  // --------------------------------------------------------------------------
  // GA4 Custom Event Tracking
  // --------------------------------------------------------------------------
  function initEventTracking() {
    if (typeof gtag !== 'function') return;

    // Track audience splitter clicks (job vs admissions)
    document.querySelectorAll('.splitter__card a, .splitter__card .btn').forEach(function(el) {
      el.addEventListener('click', function() {
        var card = this.closest('.splitter__card');
        var audience = card && card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : 'unknown';
        gtag('event', 'splitter_click', { audience: audience });
      });
    });

    // Track "Free Consultation" / booking CTA clicks
    document.querySelectorAll('a[href*="book.html"], .header__cta-btn').forEach(function(el) {
      el.addEventListener('click', function() {
        gtag('event', 'book_call_click', { link_text: this.textContent.trim() });
      });
    });

    // Track phone number clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(function(el) {
      el.addEventListener('click', function() {
        gtag('event', 'phone_click', { phone_number: this.href.replace('tel:', '') });
      });
    });

    // Track form submissions
    document.querySelectorAll('form').forEach(function(form) {
      form.addEventListener('submit', function() {
        var formType = this.querySelector('[name="Service Type"]');
        gtag('event', 'form_submit', {
          form_location: window.location.pathname,
          service_type: formType ? formType.value : 'N/A'
        });
      });
    });
  }

})();
