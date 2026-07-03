(function () {
  "use strict";

  /* ---------------- Sticky header shadow ---------------- */
  var header = document.querySelector(".site-header");
  function onScrollHeader() {
    if (window.scrollY > 12) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  document.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------- Mobile nav toggle ---------------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "إغلاق القائمة" : "فتح القائمة",
    );
  });

  // Close mobile nav after selecting a link
  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------------- Scroll reveal animations ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------- Testimonials slider ---------------- */
  var track = document.getElementById("testiTrack");
  var dotsWrap = document.getElementById("testiDots");
  var prevBtn = document.getElementById("testiPrev");
  var nextBtn = document.getElementById("testiNext");

  if (track) {
    var slides = Array.prototype.slice.call(track.children);
    var current = 0;
    var autoTimer;

    slides.forEach(function (_, i) {
      var dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", function () {
        goTo(i);
        resetAuto();
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      // RTL-aware translate: track uses row layout, so shift by percentage
      track.style.transform = "translateX(" + current * 100 + "%)";
      dots.forEach(function (d, i) {
        d.classList.toggle("active", i === current);
      });
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () {
        goTo(current + 1);
      }, 6000);
    }

    prevBtn.addEventListener("click", function () {
      goTo(current - 1);
      resetAuto();
    });
    nextBtn.addEventListener("click", function () {
      goTo(current + 1);
      resetAuto();
    });

    goTo(0);
    resetAuto();
  }

  /* ---------------- Booking form ---------------- */
  var form = document.getElementById("bookingForm");
  var statusEl = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        statusEl.textContent = "يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح.";
        statusEl.className = "form-status error";
        return;
      }

      // Fire Google Ads / GA4 lead conversion event
      if (window.dataLayer) {
        window.dataLayer.push({
          event: "generate_lead",
          form_id: "bookingForm",
          service_type: document.getElementById("serviceType").value,
        });
      }

      statusEl.textContent = "تم إرسال طلبك بنجاح! سنتواصل معك خلال دقائق.";
      statusEl.className = "form-status success";
      form.reset();
    });
  }

  /* ---------------- CTA click tracking (Google Ads) ---------------- */
  document.querySelectorAll(".cta-track").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: "book_click",
          cta_location: btn.getAttribute("data-cta") || "unknown",
        });
      }
    });
  });

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Only one policy item open at a time ---------------- */
  var policyItems = document.querySelectorAll(".policy-item");
  policyItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        policyItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });
})();
