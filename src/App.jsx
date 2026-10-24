import { useEffect, useRef } from "react";

import FACE from "./assets/face.png"; // transparent PNG cut-out; replace the file to change the face

export default function ChhatRunner() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const x = cv.getContext("2d");
    const W = 360, H = 640, G = 520;
    const face = new Image();
    face.src = FACE;

    let best = 0, st = "ready", sc = 0, coins = 0, sp = 5, t = 0, last = 0;
    let ob = [], cn = [], nextOb = 0, py = G, vy = 0, air = false, jumps = 0, raf;

    const bld = Array.from({ length: 14 }, (_, i) => ({ w: 40 + Math.random() * 50, h: 80 + Math.random() * 130, c: i % 3 }));
    const bc = ["#a9c7d6", "#c9b8a4", "#8fb3a8"];

    const reset = () => { ob = []; cn = []; sc = 0; coins = 0; sp = 5; py = G; vy = 0; jumps = 0; nextOb = 300; st = "play"; };
    const jump = () => {
      if (st === "ready" || st === "over") { if (st === "over" && t < 30) return; reset(); return; }
      if (jumps < 2) { vy = jumps ? -12 : -14.5; jumps++; air = true; }
    };
    const over = () => { st = "over"; t = 0; best = Math.max(best, Math.floor(sc)); };

    const spawn = () => {
      const h = 34 + Math.random() * 26, w = 34 + Math.random() * 14;
      ob.push({ x: W + 20, w, h });
      if (Math.random() < 0.7) {
        const cx = W + 20 + w / 2 - 30;
        for (let i = 0; i < 3; i++) cn.push({ x: cx + i * 30, y: G - h - 70 - Math.sin((i / 2) * Math.PI) * 40, got: false });
      }
      nextOb = W + 20 + (220 + Math.random() * 180) * (sp / 5);
    };

    const update = (d) => {
      t += d; sc += d * sp * 0.05; sp = Math.min(11, 5 + sc / 150);
      nextOb -= sp * d;
      if (nextOb <= W + 20 && ob.length < 4) spawn();
      vy += 0.7 * d; py += vy * d;
      if (py >= G) { py = G; vy = 0; air = false; jumps = 0; }
      ob.forEach((o) => (o.x -= sp * d));
      cn.forEach((c) => (c.x -= sp * d));
      ob = ob.filter((o) => o.x > -80);
      cn = cn.filter((c) => c.x > -30 && !c.got);
      const px = 70, pw = 26;
      ob.forEach((o) => { if (px + pw / 2 > o.x + 4 && px - pw / 2 < o.x + o.w - 4 && py > G - o.h + 6) over(); });
      cn.forEach((c) => { if (Math.abs(c.x - px) < 22 && Math.abs(c.y - (py - 50)) < 40) { c.got = true; coins++; sc += 10; } });
    };

    const player = () => {
      const px = 70, sw = air ? 0 : Math.sin(t * 0.45) * 14, bob = air ? 0 : Math.abs(Math.sin(t * 0.45)) * 3;
      const hip = py - 30 - bob, skin = "#c98f66";
      x.lineCap = "round"; x.lineWidth = 11; x.strokeStyle = skin;
      x.beginPath();
      x.moveTo(px - 4, hip); x.lineTo(px - 4 + (air ? -10 : sw), py - 4);
      x.moveTo(px + 4, hip); x.lineTo(px + 4 + (air ? 12 : -sw), py - 4);
      x.stroke();
      x.fillStyle = "#2b2b2b";
      x.fillRect(px - 4 + (air ? -10 : sw) - 8, py - 8, 16, 8);
      x.fillRect(px + 4 + (air ? 12 : -sw) - 8, py - 8, 16, 8);
      x.fillStyle = skin; x.beginPath(); x.roundRect(px - 17, hip - 40, 34, 44, 8); x.fill();
      x.fillStyle = "#1c1c1c"; x.beginPath(); x.roundRect(px - 19, hip - 6, 38, 26, 6); x.fill();
      x.strokeStyle = skin; x.lineWidth = 8; x.beginPath();
      x.moveTo(px - 14, hip - 32); x.lineTo(px - 22 + (air ? -8 : -sw * 0.7), hip - 8);
      x.moveTo(px + 14, hip - 32); x.lineTo(px + 22 + (air ? 8 : sw * 0.7), hip - 8);
      x.stroke();
      const hw = 64, hh = 86, top = hip - 34 - hh;
      x.fillStyle = skin; x.fillRect(px - 9, hip - 46, 18, 16);
      if (face.complete && face.naturalWidth) x.drawImage(face, px - hw / 2, top, hw, hh);
    };

    const draw = () => {
      const g = x.createLinearGradient(0, 0, 0, G);
      g.addColorStop(0, "#7fc8e8"); g.addColorStop(1, "#f5d9a8");
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.fillStyle = "#fff8"; x.beginPath(); x.arc(290, 90, 26, 0, 7); x.fill();
      const bx = -((sc * 3) % 1000) % 900;
      for (let k = 0; k < 2; k++) {
        let cx = bx + k * 900;
        bld.forEach((b) => {
          x.fillStyle = bc[b.c]; x.fillRect(cx, G - b.h, b.w, b.h);
          x.fillStyle = "#0002"; x.fillRect(cx + 8, G - b.h + 14, b.w - 16, 10);
          cx += b.w + 14;
        });
      }
      x.fillStyle = "#b9814d"; x.fillRect(0, G, W, H - G);
      x.fillStyle = "#8f6034"; x.fillRect(0, G, W, 8);
      x.fillStyle = "#0003";
      const gx = -((sc * sp * 0.6) % 60);
      for (let i = 0; i < 8; i++) x.fillRect(gx + i * 60, G + 40, 30, 4);
      ob.forEach((o) => {
        x.fillStyle = "#d98a3d"; x.fillRect(o.x, G - o.h, o.w, o.h);
        x.strokeStyle = "#7a4a1c"; x.lineWidth = 3; x.strokeRect(o.x + 1.5, G - o.h + 1.5, o.w - 3, o.h - 3);
        x.beginPath(); x.moveTo(o.x, G - o.h); x.lineTo(o.x + o.w, G); x.moveTo(o.x + o.w, G - o.h); x.lineTo(o.x, G); x.stroke();
      });
      cn.forEach((c) => {
        x.fillStyle = "#ffc933"; x.beginPath(); x.arc(c.x, c.y, 9, 0, 7); x.fill();
        x.strokeStyle = "#c28a00"; x.lineWidth = 2; x.stroke();
      });
      player();
      x.fillStyle = "#fff"; x.textAlign = "left"; x.font = "bold 22px Georgia,serif"; x.fillText(Math.floor(sc), 16, 38);
      x.font = "15px Georgia,serif"; x.fillText("Coins " + coins, 16, 60);
      x.textAlign = "right"; x.fillText("Best " + best, W - 16, 38);
      if (st !== "play") {
        x.fillStyle = "#000a"; x.fillRect(40, 200, W - 80, 170);
        x.fillStyle = "#fff"; x.textAlign = "center";
        x.font = "bold 28px Georgia,serif"; x.fillText(st === "ready" ? "Chhat Runner" : "Game over", W / 2, 250);
        x.font = "16px Georgia,serif";
        if (st === "over") x.fillText("Score " + Math.floor(sc) + "  ·  Coins " + coins, W / 2, 282);
        x.fillText("Tap to " + (st === "ready" ? "start" : "run again"), W / 2, st === "ready" ? 290 : 314);
        x.fillText("Tap twice in the air to double jump", W / 2, st === "ready" ? 318 : 344);
      }
    };

    const loop = (n) => {
      const d = Math.min(2.5, (n - last) / 16.67 || 1);
      last = n;
      if (st === "play") update(d); else t += d;
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onKey = (e) => { if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump(); } };
    const onDown = (e) => { e.preventDefault(); jump(); };
    cv.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      cv.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#1d2b3a", touchAction: "manipulation", userSelect: "none" }}>
      <canvas ref={ref} width={360} height={640} style={{ height: "100%", maxWidth: "100%", aspectRatio: "9/16", display: "block" }} />
    </div>
  );
}
