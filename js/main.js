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

    let lastScrollY = window.scrollY;
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

      lastScrollY = scrollY;
    }
  }

  // --------------------------------------------------------------------------
  // FAQ Accordion
  // --------------------------------------------------------------------------
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

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

})();
