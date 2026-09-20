/* asklins — 主题切换 / 滚动揭示 / 指针光斑 / 导航高亮 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme ---------- */
  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* 隐私模式下写入会抛错，忽略即可 */
      }
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = document.querySelectorAll("[data-reveal]");
  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealables.forEach(function (el) {
      io.observe(el);
    });
  }

  /* hero 遮罩上升：等字体与首帧稳定后统一触发 */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      root.classList.add("is-ready");
      document.querySelectorAll(".hero [data-reveal]").forEach(function (el) {
        el.classList.add("is-in");
      });
    });
  });

  /* ---------- pointer spotlight ---------- */
  var spot = document.querySelector(".spot");
  if (spot && !reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var pending = false;
    var x = 0;
    var y = 0;
    window.addEventListener(
      "pointermove",
      function (e) {
        x = e.clientX;
        y = e.clientY;
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () {
          spot.style.setProperty("--mx", x + "px");
          spot.style.setProperty("--my", y + "px");
          pending = false;
        });
      },
      { passive: true }
    );
  }

  /* ---------- topbar hairline ---------- */
  var bar = document.querySelector(".topbar");
  if (bar) {
    var onScroll = function () {
      bar.dataset.stuck = window.scrollY > 4 ? "true" : "false";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- scroll spy ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var targets = links
    .map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if (links.length && targets.length && "IntersectionObserver" in window) {
    var visible = new Set();
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        var current = targets.find(function (t) {
          return visible.has(t.id);
        });
        links.forEach(function (a) {
          var on = !!current && a.getAttribute("href") === "#" + current.id;
          if (on) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    targets.forEach(function (t) {
      spy.observe(t);
    });
  }
})();
