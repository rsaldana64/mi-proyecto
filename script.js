(function () {
  "use strict";

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===========================
     Modo oscuro / claro
     =========================== */
  const themeToggle = document.getElementById("theme-toggle");

  function setTheme(theme, save) {
    root.setAttribute("data-theme", theme);
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
    );
    if (save) {
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {
        /* almacenamiento no disponible: el tema solo dura esta visita */
      }
    }
  }

  setTheme(root.getAttribute("data-theme") || "light", false);

  themeToggle.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next, true);
    showToast(next === "dark" ? "🌙 Modo oscuro activado" : "☀️ Modo claro activado");
  });

  // Si el usuario no eligió tema, seguimos el del sistema
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    let saved = null;
    try {
      saved = localStorage.getItem("theme");
    } catch (err) {
      /* ignorar */
    }
    if (!saved) setTheme(e.matches ? "dark" : "light", false);
  });

  /* ===========================
     Menú móvil
     =========================== */
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
  }

  menuToggle.addEventListener("click", function () {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ===========================
     Header, enlace activo y botón "arriba"
     =========================== */
  const header = document.getElementById("header");
  const toTop = document.getElementById("to-top");
  const sections = document.querySelectorAll("main section[id]");
  const links = navLinks.querySelectorAll("a");

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 20);
    toTop.classList.toggle("show", y > 500);

    let current = "";
    sections.forEach(function (sec) {
      if (y >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ===========================
     Efecto de escritura
     =========================== */
  const roles = [
    "Desarrollador/a Web",
    "Diseñador/a de interfaces",
    "Aprendiz constante",
    "Amante del código limpio",
  ];
  const typed = document.getElementById("typed");

  if (prefersReducedMotion) {
    typed.textContent = roles[0];
  } else {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    (function type() {
      const word = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      typed.textContent = word.slice(0, charIndex);

      let delay = deleting ? 45 : 90;
      if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = 1600;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 350;
      }
      setTimeout(type, delay);
    })();
  }

  /* ===========================
     Animaciones al hacer scroll
     =========================== */
  function animateCount(el) {
    const target = Number(el.dataset.count);
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  function activate(section) {
    section.classList.add("visible");
    section.querySelectorAll(".skill").forEach(function (skill) {
      skill.querySelector(".fill").style.width = skill.dataset.level + "%";
    });
    section.querySelectorAll("[data-count]").forEach(animateCount);
  }

  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            activate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(activate);
  }

  /* ===========================
     Filtro de proyectos
     =========================== */
  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".card");

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const category = btn.dataset.filter;

      filters.forEach(function (b) {
        const isActive = b === btn;
        b.classList.toggle("active", isActive);
        b.setAttribute("aria-pressed", String(isActive));
      });

      cards.forEach(function (card) {
        const show = category === "todos" || card.dataset.category === category;
        card.classList.toggle("hide", !show);
        card.classList.remove("appear");
        if (show) {
          void card.offsetWidth; // reinicia la animación
          card.classList.add("appear");
        }
      });
    });
  });

  /* ===========================
     Efecto 3D en tarjetas
     =========================== */
  if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(800px) rotateX(" + -y * 8 + "deg) rotateY(" + x * 8 + "deg) translateY(-6px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ===========================
     Formulario de contacto
     =========================== */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  // Cambia este correo por el tuyo
  const CONTACT_EMAIL = "tu-correo@ejemplo.com";

  const validators = {
    name: function (v) {
      return v.trim().length >= 2 ? "" : "Escribe tu nombre (mínimo 2 letras).";
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Escribe un correo válido.";
    },
    message: function (v) {
      return v.trim().length >= 10 ? "" : "El mensaje debe tener al menos 10 caracteres.";
    },
  };

  function validateField(input) {
    const msg = validators[input.name](input.value);
    const field = input.closest(".field");
    field.classList.toggle("invalid", Boolean(msg));
    field.querySelector(".error").textContent = msg;
    input.setAttribute("aria-invalid", String(Boolean(msg)));
    return !msg;
  }

  form.querySelectorAll("input, textarea").forEach(function (input) {
    input.addEventListener("blur", function () {
      validateField(input);
    });
    input.addEventListener("input", function () {
      if (input.closest(".field").classList.contains("invalid")) validateField(input);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const inputs = Array.from(form.querySelectorAll("input, textarea"));
    const valid = inputs.map(validateField).every(Boolean);

    if (!valid) {
      status.textContent = "Revisa los campos marcados.";
      const firstInvalid = form.querySelector(".invalid input, .invalid textarea");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const data = new FormData(form);
    const subject = encodeURIComponent("Mensaje de " + data.get("name"));
    const body = encodeURIComponent(data.get("message") + "\n\n— " + data.get("name") + " (" + data.get("email") + ")");

    status.textContent = "¡Gracias! Se abrirá tu aplicación de correo para enviar el mensaje.";
    showToast("✉️ ¡Mensaje listo para enviar!");
    window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
    form.reset();
  });

  /* ===========================
     Utilidades
     =========================== */
  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
