/* =========================================================
   PIYUSH & KRIPANSHA WEDDING WEBSITE
   Clean, consolidated interactions
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Scroll reveal */
  const animatedElements = document.querySelectorAll(
    ".reveal, .image-reveal, .gallery-item, .function-card, .feature-copy"
  );

  document.querySelectorAll(".gallery-item").forEach((item, index) => {
    item.style.transitionDelay = `${(index % 3) * 100}ms`;
  });

  document.querySelectorAll(".function-card").forEach((card, index) => {
    card.style.transitionDelay = `${(index % 2) * 120}ms`;
  });

  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    animatedElements.forEach((element) => observer.observe(element));
  } else {
    animatedElements.forEach((element) => element.classList.add("is-visible"));
  }

  /* Smooth internal navigation */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  /* Image fallback */
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.classList.add("image-unavailable");
      img.alt = img.alt || "Wedding photograph";
    });
  });

  /* Background music */
  const music = document.getElementById("weddingMusic");
  const musicToggle = document.getElementById("musicToggle");
  const musicLabel = document.getElementById("musicLabel");

  if (music && musicToggle && musicLabel) {
    musicToggle.addEventListener("click", async () => {
      if (music.paused) {
        try {
          await music.play();
          musicLabel.textContent = "Pause Music";
          musicToggle.setAttribute("aria-label", "Pause wedding music");
          musicToggle.setAttribute("aria-pressed", "true");
        } catch (error) {
          musicLabel.textContent = "Try Again";
          console.warn("Music could not be played. Check music.mp3.", error);
        }
      } else {
        music.pause();
        musicLabel.textContent = "Play Music";
        musicToggle.setAttribute("aria-label", "Play wedding music");
        musicToggle.setAttribute("aria-pressed", "false");
      }
    });
  }

  /* Wedding envelope: attach each button once */
  const intro = document.getElementById("envelopeIntro");
  const envelope = document.getElementById("openInvitation");
  const openText = document.getElementById("openInvitationText");

  if (intro && envelope && openText) {
    document.body.classList.add("invitation-locked");
    let isOpening = false;

    const openWeddingInvitation = (event) => {
      event.preventDefault();
      if (isOpening) return;
      isOpening = true;

      intro.classList.add("is-opening");
      const firstDelay = reduceMotion ? 80 : 1800;
      const exitDelay = reduceMotion ? 100 : 900;

      window.setTimeout(() => intro.classList.add("is-leaving"), firstDelay);
      window.setTimeout(() => {
        intro.remove();
        document.body.classList.remove("invitation-locked");
      }, firstDelay + exitDelay);
    };

    envelope.addEventListener("click", openWeddingInvitation);
    openText.addEventListener("click", openWeddingInvitation);
  }

  /* Falling rose petals */
  const petalContainer = document.getElementById("petalContainer");

  if (petalContainer && !reduceMotion) {
    const isMobile = window.matchMedia("(max-width: 600px)").matches;
    const petalCount = isMobile ? 9 : 18;

    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement("span");
      petal.className = "rose-petal";
      if (i % 4 === 0) petal.classList.add("petal-light");

      const size = 9 + Math.random() * 12;
      const duration = 9 + Math.random() * 11;

      petal.style.setProperty("--left", `${Math.random() * 100}%`);
      petal.style.setProperty("--size", `${size}px`);
      petal.style.setProperty("--duration", `${duration}s`);
      petal.style.setProperty("--delay", `${-(Math.random() * duration)}s`);
      petal.style.setProperty("--sway-duration", `${2.5 + Math.random() * 3}s`);
      petal.style.setProperty("--rotation", `${Math.random() * 360}deg`);
      petal.style.setProperty("--drift", `${-70 + Math.random() * 140}px`);
      petal.style.setProperty("--opacity", `${0.35 + Math.random() * 0.4}`);
      petalContainer.appendChild(petal);
    }
  }

  /* Countdown — wedding date/time in India Standard Time */
  const WEDDING_DATE = "2026-12-04T19:00:00+05:30";
  const weddingDate = new Date(WEDDING_DATE);
  const dateText = document.getElementById("weddingDateText");
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const countdownMessage = document.getElementById("countdown-message");

  if (dateText) {
    dateText.textContent = weddingDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata"
    });
  }

  const updateCountdown = () => {
    const remaining = weddingDate.getTime() - Date.now();

    if (remaining <= 0) {
      if (daysEl) daysEl.textContent = "000";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";
      if (countdownMessage) {
        countdownMessage.textContent = "Today is the beginning of our forever! ♡";
      }
      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    if (daysEl) daysEl.textContent = String(Math.floor(totalSeconds / 86400)).padStart(3, "0");
    if (hoursEl) hoursEl.textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(totalSeconds % 60).padStart(2, "0");
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  /* Scratch-to-reveal card */
  const scratchCard = document.getElementById("scratchCard");
  const canvas = document.getElementById("scratchCanvas");
  const resetButton = document.getElementById("scratchReset");
  const instruction = document.getElementById("scratchInstruction");

  if (scratchCard && canvas && resetButton && instruction) {
    const ctx = canvas.getContext("2d");

    if (ctx) {
      let isScratching = false;
      let revealed = false;
      let lastCheck = 0;

      const paintScratchSurface = () => {
        const rect = scratchCard.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalCompositeOperation = "source-over";

        const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
        gradient.addColorStop(0, "#7c3548");
        gradient.addColorStop(0.48, "#54212f");
        gradient.addColorStop(1, "#35131f");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, rect.width, rect.height);

        /* Fine champagne-gold flecks */
        for (let i = 0; i < 70; i++) {
          const x = Math.random() * rect.width;
          const y = Math.random() * rect.height;
          ctx.beginPath();
          ctx.arc(x, y, Math.random() * 1.1 + 0.25, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(246, 218, 163, 0.48)";
          ctx.fill();
        }

        ctx.globalCompositeOperation = "destination-out";
        revealed = false;
        isScratching = false;
        scratchCard.classList.remove("is-revealed");
        instruction.style.opacity = "1";
        canvas.style.opacity = "1";
        canvas.style.pointerEvents = "auto";
      };

      const getPoint = (event) => {
        const rect = canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
      };

      const revealCountdown = () => {
        if (revealed) return;
        revealed = true;
        scratchCard.classList.add("is-revealed");
        instruction.style.opacity = "0";
        canvas.style.opacity = "0";
        canvas.style.pointerEvents = "none";
      };

      const checkScratchProgress = () => {
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let transparent = 0;
        let sampled = 0;

        for (let i = 3; i < pixels.length; i += 16) {
          sampled++;
          if (pixels[i] < 40) transparent++;
        }

        if (sampled && transparent / sampled > 0.32) revealCountdown();
      };

      const scratchAt = (event) => {
        const point = getPoint(event);
        ctx.beginPath();
        ctx.arc(point.x, point.y, 24, 0, Math.PI * 2);
        ctx.fill();

        const now = performance.now();
        if (now - lastCheck > 180) {
          lastCheck = now;
          checkScratchProgress();
        }
      };

      canvas.addEventListener("pointerdown", (event) => {
        if (revealed) return;
        isScratching = true;
        if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
        scratchAt(event);
        event.preventDefault();
      });

      canvas.addEventListener("pointermove", (event) => {
        if (!isScratching || revealed) return;
        scratchAt(event);
        event.preventDefault();
      });

      const stopScratching = () => { isScratching = false; };
      canvas.addEventListener("pointerup", stopScratching);
      canvas.addEventListener("pointercancel", stopScratching);
      canvas.addEventListener("lostpointercapture", stopScratching);
      resetButton.addEventListener("click", paintScratchSurface);

      paintScratchSurface();

      if ("ResizeObserver" in window) {
        const resizeObserver = new ResizeObserver(() => {
          if (!revealed && !isScratching) paintScratchSurface();
        });
        resizeObserver.observe(scratchCard);
      } else {
        window.addEventListener("resize", () => {
          if (!revealed && !isScratching) paintScratchSurface();
        });
      }

      /* Tiny decorative petals inside the scratch card */
      if (!reduceMotion) {
        for (let i = 0; i < 5; i++) {
          const petal = document.createElement("span");
          petal.className = "scratch-decor-petal";
          petal.style.left = `${10 + Math.random() * 80}%`;
          petal.style.animationDelay = `${Math.random() * 8}s`;
          petal.style.animationDuration = `${7 + Math.random() * 5}s`;
          scratchCard.appendChild(petal);
        }
      }
    }
  }

  /* Gallery lightbox */
  const galleryImages = Array.from(document.querySelectorAll(".gallery-item img"));
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let currentPhotoIndex = 0;
  let previousFocus = null;

  const showGalleryPhoto = (index) => {
    if (!galleryImages.length || !lightboxImage) return;
    currentPhotoIndex = (index + galleryImages.length) % galleryImages.length;
    const selectedImage = galleryImages[currentPhotoIndex];
    lightboxImage.src = selectedImage.currentSrc || selectedImage.src;
    lightboxImage.alt = selectedImage.alt || "Wedding photograph";
    if (lightboxCounter) lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${galleryImages.length}`;
  };

  const openGalleryPhoto = (index) => {
    if (!lightbox || !lightboxClose) return;
    previousFocus = document.activeElement;
    showGalleryPhoto(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightboxClose.focus();
  };

  const closeGalleryPhoto = () => {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    if (lightboxImage) lightboxImage.removeAttribute("src");
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
  };

  galleryImages.forEach((img, index) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openGalleryPhoto(index));
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeGalleryPhoto);
  if (lightboxPrev) lightboxPrev.addEventListener("click", () => showGalleryPhoto(currentPhotoIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener("click", () => showGalleryPhoto(currentPhotoIndex + 1));

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeGalleryPhoto();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox?.classList.contains("open")) closeGalleryPhoto();
    if (event.key === "ArrowLeft" && lightbox?.classList.contains("open")) showGalleryPhoto(currentPhotoIndex - 1);
    if (event.key === "ArrowRight" && lightbox?.classList.contains("open")) showGalleryPhoto(currentPhotoIndex + 1);
  });
});
