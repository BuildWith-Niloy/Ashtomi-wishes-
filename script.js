(() => {
  "use strict";

  // Read the recipient's name from ?to=username (falls back to "x")
  const params = new URLSearchParams(window.location.search);
  const recipient = (params.get("to") || "").trim() || "x";

  const typedMessage = document.getElementById("typedMessage");
  const lineEls = Array.from(document.querySelectorAll(".typed-line"));
  const signoffEl = document.querySelector(".signoff");
  const petalLayer = document.getElementById("petalLayer");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isSmall = window.innerWidth < 650;

  const flowers = ["✿", "❀", "✽", "✾", "❁"];
  const colors = [
    "#7a1d14", "#9a3a22", "#8a4a1a",
    "#6e2a18", "#5c1a12", "#7d5216"
  ];

  const pick = list => list[Math.floor(Math.random() * list.length)];

  // Greeting text
  function wishLines(name) {
    return [
      `Dear ${name},`,
      "— ❀ —",
      "Hi there, as shiuli blossoms scatter and dhaak beats dance in the autumn air, may Maa Durga’s boundless grace fill your day with warmth, joy, and bright new beginnings.",
      "Shubho Maha Ashtami."
    ];
  }

  const pause = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

  // Runs once the greeting has finished typing
  function onTypingDone() {
    if (typedMessage) typedMessage.classList.add("is-done");
    if (!signoffEl || reducedMotion) return;

    const r = signoffEl.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 0, 14);
  }

  async function typeWish() {
    const lines = wishLines(recipient);

    if (lineEls.length === 0) {
      console.error("Greeting elements not found in index.html");
      return;
    }

    // Clear previous text
    lineEls.forEach(line => {
      const text = line.querySelector(".typed-text");
      const cursor = line.querySelector(".cursor");

      if (text) text.textContent = "";
      if (cursor) cursor.classList.add("hidden");
    });

    // Show immediately when reduced motion is enabled
    if (reducedMotion) {
      lineEls.forEach((line, i) => {
        const text = line.querySelector(".typed-text");
        if (text) text.textContent = lines[i] || "";
      });
      onTypingDone();
      return;
    }

    // Type each line
    for (let i = 0; i < lines.length && i < lineEls.length; i++) {
      const line = lineEls[i];
      const text = line.querySelector(".typed-text");
      const cursor = line.querySelector(".cursor");

      if (!text) continue;
      if (cursor) cursor.classList.remove("hidden");

      for (const character of lines[i]) {
        text.textContent += character;
        await pause(
          character === "," || character === "." ? 105 : 25
        );
      }

      if (cursor) cursor.classList.add("hidden");

      if (i + 1 < lines.length && i + 1 < lineEls.length) {
        const nextCursor =
          lineEls[i + 1].querySelector(".cursor");

        if (nextCursor) nextCursor.classList.remove("hidden");
        await pause(i === 1 ? 220 : 160);
      }
    }

    onTypingDone();
  }

  // Small burst of petals and sparks from a point on screen
  function burst(x, y, flowerCount, sparkCount) {
    if (!petalLayer || reducedMotion) return;

    const box = petalLayer.getBoundingClientRect();
    const originX = x - box.left;
    const originY = y - box.top;

    const spawn = isFlower => {
      const el = document.createElement("span");
      const angle = Math.random() * Math.PI * 2;
      const distance = 60 + Math.random() * 120;

      el.className = isFlower ? "burst flower-burst" : "burst spark-burst";
      el.setAttribute("aria-hidden", "true");
      el.style.left = `${originX}px`;
      el.style.top = `${originY}px`;
      el.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
      el.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
      el.style.setProperty("--rot", `${-180 + Math.random() * 360}deg`);

      if (isFlower) {
        el.textContent = pick(flowers);
        el.style.color = pick(colors);
        el.style.fontSize = `${14 + Math.random() * 10}px`;
      }

      el.addEventListener("animationend", () => el.remove());
      petalLayer.appendChild(el);
    };

    for (let i = 0; i < flowerCount; i++) spawn(true);
    for (let i = 0; i < sparkCount; i++) spawn(false);
  }

  // Ambient falling petals and rising sparks
  if (petalLayer && !reducedMotion) {
    for (let i = 0; i < (isSmall ? 13 : 22); i++) {
      const petal = document.createElement("span");

      petal.className = "petal";
      petal.setAttribute("aria-hidden", "true");
      petal.textContent = pick(flowers);

      petal.style.left = `${Math.random() * 100}%`;
      petal.style.fontSize = `${13 + Math.random() * 17}px`;
      petal.style.setProperty("--petal-color", pick(colors));
      petal.style.setProperty("--duration", `${9 + Math.random() * 12}s`);
      petal.style.setProperty("--delay", `${-Math.random() * 18}s`);
      petal.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
      petal.style.setProperty("--petal-opacity", `${0.28 + Math.random() * 0.45}`);

      petalLayer.appendChild(petal);
    }

    for (let i = 0; i < (isSmall ? 12 : 20); i++) {
      const spark = document.createElement("span");

      spark.className = "spark";
      spark.setAttribute("aria-hidden", "true");

      spark.style.left = `${Math.random() * 100}%`;
      spark.style.setProperty("--duration", `${7 + Math.random() * 8}s`);
      spark.style.setProperty("--delay", `${-Math.random() * 15}s`);
      spark.style.setProperty("--drift", `${-40 + Math.random() * 80}px`);
      spark.style.setProperty("--spark-opacity", `${0.5 + Math.random() * 0.45}`);

      petalLayer.appendChild(spark);
    }
  }

  // Tap or click anywhere to scatter petals and sparks from that spot
  document.addEventListener("pointerdown", event => {
    burst(event.clientX, event.clientY, 6, 8);
  });

  typeWish();
})();
