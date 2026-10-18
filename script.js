(() => {
  "use strict";

  // Read the recipient's name from ?to=username (falls back to "x")
  const params = new URLSearchParams(window.location.search);
  const recipient = (params.get("to") || "").trim() || "x";

  const lineEls = Array.from(
    document.querySelectorAll(".typed-line")
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

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
  }

  // Falling petals and rising golden sparks
  const petalLayer = document.getElementById("petalLayer");

  if (petalLayer && !reducedMotion) {
    const flowers = ["✿", "❀", "✽", "✾", "❁"];
    const colors = [
      "#a92e22", "#cd633b", "#d99a45",
      "#f4dfb8", "#ba4a31", "#e5b85f"
    ];

    const isSmall = window.innerWidth < 650;

    for (let i = 0; i < (isSmall ? 13 : 22); i++) {
      const petal = document.createElement("span");

      petal.className = "petal";
      petal.setAttribute("aria-hidden", "true");
      petal.textContent =
        flowers[Math.floor(Math.random() * flowers.length)];

      petal.style.left = `${Math.random() * 100}%`;
      petal.style.fontSize = `${13 + Math.random() * 17}px`;

      petal.style.setProperty(
        "--petal-color",
        colors[Math.floor(Math.random() * colors.length)]
      );
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

  typeWish();
})();
