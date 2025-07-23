document.addEventListener("DOMContentLoaded", function () {
  // ========== Preloader ==========
  const initPreloader = () => {
    const preloader = document.querySelector(".preloader");
    if (!preloader) return;

    window.addEventListener("load", function () {
      setTimeout(() => {
        preloader.classList.add("fade-out");
        setTimeout(() => {
          preloader.style.display = "none";
        }, 500);
      }, 1000);
    });
  };

  const statItems = document.querySelectorAll(".hero-stats .stat-item");
  const maxTilt = 45; // Extreme 45 degree maximum tilt

  statItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Create shadow element
    const shadow = document.createElement("div");
    shadow.className = "stat-item-shadow";
    item.appendChild(shadow);

    item.addEventListener("mousemove", (e) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate position (-1.5 to 1.5 for extra range)
      const relX = (x - centerX) / (centerX / 1.5);
      const relY = (y - centerY) / (centerY / 1.5);

      // Update mouse position
      item.style.setProperty("--mouse-x", `${x}px`);
      item.style.setProperty("--mouse-y", `${y}px`);

      // Calculate extreme tilt with perspective distortion
      const tiltX = Math.min(Math.max(relY * -maxTilt, -maxTilt), maxTilt);
      const tiltY = Math.min(Math.max(relX * maxTilt, -maxTilt), maxTilt);
      const tiltZ = relX * (maxTilt / 2); // Z-rotation

      // Apply extreme tilt
      item.style.setProperty("--tilt-x", `${tiltX}deg`);
      item.style.setProperty("--tilt-y", `${tiltY}deg`);
      item.style.setProperty("--tilt-z", `${tiltZ}deg`);

      // Dynamic shadow position
      const shadowX = relX * 40;
      const shadowY = relY * 40;
      shadow.style.opacity = "0.8";
      shadow.style.transform = `translateX(${shadowX}px) translateY(${shadowY}px)`;

      // Extreme content pop
      item.querySelector(
        ".stat-number"
      ).style.transform = `translateZ(120px) scale(1.15)`;
      item.querySelector(
        ".stat-label"
      ).style.transform = `translateZ(80px) scale(1.1)`;

      // Edge glow effect
      item.style.boxShadow = `
                ${shadowX}px ${shadowY}px 60px rgba(0, 0, 0, 0.5),
                inset 0 0 40px rgba(255, 255, 255, 0.1)
            `;
    });

    item.addEventListener("mouseleave", () => {
      // Reset with dramatic bounce
      item.style.setProperty("--tilt-x", "0deg");
      item.style.setProperty("--tilt-y", "0deg");
      item.style.setProperty("--tilt-z", "0deg");

      // Reset shadow
      shadow.style.opacity = "0";
      shadow.style.transform = "translateX(0) translateY(0)";

      // Reset content
      item.querySelector(".stat-number").style.transform =
        "translateZ(100px) scale(1)";
      item.querySelector(".stat-label").style.transform =
        "translateZ(60px) scale(1)";

      // Reset shadow
      item.style.boxShadow = "0 30px 60px rgba(0, 0, 0, 0.3)";
    });
  });

  // ========== Theme Toggle ==========
  const initThemeToggle = () => {
    const themeSwitch = document.getElementById("theme-switch");
    const body = document.body;

    if (!themeSwitch) return;

    // Fungsi untuk apply tema
    const applyTheme = (isDark) => {
      if (isDark) {
        body.classList.add("dark-mode");
        if (themeSwitch) themeSwitch.checked = true;
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        body.classList.remove("dark-mode");
        if (themeSwitch) themeSwitch.checked = false;
        document.documentElement.setAttribute("data-theme", "light");
      }
    };

    // ========== Dark and Light Toggle ==========
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      applyTheme(savedTheme === "dark");
    }
    else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      applyTheme(systemPrefersDark);

      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (!localStorage.getItem("theme")) {
            applyTheme(e.matches);
          }
        });
    }

    if (themeSwitch) {
      themeSwitch.addEventListener("change", function () {
        const isDark = this.checked;
        applyTheme(isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
      });
    }
  };

  // ========== Mobile Navigation ==========
  const initMobileNav = () => {
    const burger = document.querySelector(".burger");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-links li");

    if (!burger || !navLinks) return;

    burger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      burger.classList.toggle("toggle");

      navItems.forEach((link, index) => {
        link.style.animation = link.style.animation
          ? ""
          : `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
      });
    });

    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        navLinks.classList.remove("active");
        burger.classList.remove("toggle");
        navItems.forEach((link) => {
          link.style.animation = "";
        });
      });
    });
  };

  // ========== Scroll Effects ==========
  const initScrollEffects = () => {
    window.addEventListener("scroll", () => {
      const nav = document.querySelector("nav");
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 50);

      const backToTop = document.querySelector(".back-to-top");
      if (backToTop) {
        backToTop.classList.toggle("active", window.scrollY > 300);
      }
    });

    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
        }
      });
    });
  };

  // ========== Animations ==========
  const initAnimations = () => {
    const animateCounters = () => {
      const counters = document.querySelectorAll(".stat-number");
      const speed = 200;

      counters.forEach((counter) => {
        const target = +counter.getAttribute("data-count");
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          setTimeout(animateCounters, 1);
        } else {
          counter.innerText = target;
        }
      });
    };

    // Timeline Progress Animation
    const timelineProgress = document.querySelector(".timeline-progress");
    if (timelineProgress) {
      setTimeout(() => {
        timelineProgress.style.width = "50%";

        document.querySelectorAll(".timeline-marker").forEach((marker) => {
          const percent = marker.getAttribute("data-percent");
          marker.style.left = `${percent}%`;
        });
      }, 500);
    }

    // Animate on Scroll
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");

      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementPosition < windowHeight - 100) {
          element.classList.add("animated");

          if (element.classList.contains("stat-number")) {
            animateCounters();
          }
        }
      });
    };

    animateOnScroll();
    window.addEventListener("scroll", animateOnScroll);
  };

  // ========== Interactive Components ==========
  const initInteractiveComponents = () => {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.getAttribute("data-tab");

        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        button.classList.add("active");
        document.getElementById(tabId).classList.add("active");
      });
    });

    // Solutions Accordion
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const accordionItem = header.parentElement;
        const accordionContent = header.nextElementSibling;

        document.querySelectorAll(".accordion-item").forEach((item) => {
          if (item !== accordionItem) {
            item.classList.remove("active");
            item.querySelector(".accordion-content").style.maxHeight = null;
          }
        });

        accordionItem.classList.toggle("active");

        if (accordionItem.classList.contains("active")) {
          accordionContent.style.maxHeight =
            accordionContent.scrollHeight + "px";
        } else {
          accordionContent.style.maxHeight = null;
        }
      });
    });

    // Gallery Filter
    const filterButtons = document.querySelectorAll(".filter-button");
    const galleryItems = document.querySelectorAll(".gallery-item");

    if (filterButtons.length && galleryItems.length) {
      filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
          filterButtons.forEach((btn) => btn.classList.remove("active"));

          button.classList.add("active");

          const filterValue = button.getAttribute("data-filter");

          galleryItems.forEach((item) => {
            item.style.display =
              filterValue === "all" ||
              item.getAttribute("data-category") === filterValue
                ? "block"
                : "none";
          });
        });
      });
    }

    // Lightbox for Gallery
    const galleryExpands = document.querySelectorAll(".gallery-expand");

    galleryExpands.forEach((expand) => {
      expand.addEventListener("click", function (e) {
        e.preventDefault();

        const imageUrl = this.getAttribute("href");
        const lightbox = document.createElement("div");
        lightbox.className = "lightbox";
        lightbox.innerHTML = `
                    <div class="lightbox-content">
                        <img src="${imageUrl}" alt="Gallery Image">
                        <span class="close-lightbox">&times;</span>
                    </div>
                `;

        document.body.appendChild(lightbox);

        lightbox
          .querySelector(".close-lightbox")
          .addEventListener("click", () => {
            lightbox.remove();
          });

        lightbox.addEventListener("click", (e) => {
          if (e.target === lightbox) {
            lightbox.remove();
          }
        });
      });
    });

    const floatObjects = document.querySelectorAll(".float-object");

    floatObjects.forEach((obj, index) => {
      obj.style.animationDelay = `${index * 2}s`;
      obj.style.animationDuration = `${5 + Math.random() * 5}s`;
    });
  };

  // ========== Particles.js ==========
  const initParticles = () => {
    if (!document.getElementById("particles-js")) return;

    particlesJS("particles-js", {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: {
          value: 0.5,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.1 },
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: true, speed: 2, size_min: 0.1 },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          random: true,
          out_mode: "out",
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 1 } },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    });
  };

  // ========== Form Handling ==========
  const initForms = () => {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;

        alert(
          `Terima kasih ${name}! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.`
        );

        // Reset form
        contactForm.reset();
      });
    }

    // Newsletter subscription
    document
      .querySelectorAll(".newsletter-form, .footer-newsletter-form")
      .forEach((form) => {
        form.addEventListener("submit", function (e) {
          e.preventDefault();

          const emailInput = this.querySelector('input[type="email"]');
          const email = emailInput.value;

          alert(`Terima kasih telah berlangganan dengan email ${email}!`);

          emailInput.value = "";
        });
      });
  };

  // ========== Parallax Effects ==========
  const initParallax = () => {
    const updateParallax = () => {
      const scrollPosition = window.pageYOffset;

      const header = document.querySelector(".hero-section");
      if (header) {
        header.style.backgroundPositionY = scrollPosition * 0.5 + "px";
      }

      document.querySelectorAll(".parallax-section").forEach((section) => {
        const parallaxBg = section.querySelector(".parallax-bg");
        if (parallaxBg) {
          const depth =
            parseFloat(parallaxBg.getAttribute("data-depth")) || 0.1;
          parallaxBg.style.transform = `translateY(${
            -scrollPosition * depth
          }px)`;
        }
      });

      document.querySelectorAll(".parallax-layer").forEach((layer) => {
        const depth = parseFloat(layer.getAttribute("data-depth")) || 0.1;
        layer.style.transform = `translateY(${scrollPosition * depth}px)`;
      });
    };

    updateParallax();
    window.addEventListener("scroll", updateParallax);
  };

  // ========== Initialize All Functions ==========
  initPreloader();
  initThemeToggle();
  initMobileNav();
  initScrollEffects();
  initAnimations();
  initInteractiveComponents();
  initParticles();
  initForms();
  initParallax();
});
