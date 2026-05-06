import { useEffect, useRef } from "react";

export default function PerlinBackground({
  color1 = "#00add4",
  color2 = "#05070a",
  resolution = 4,
  noiseScale = 0.035,
  speed = 0.015,
  contrast = 2.2,
  softness = 0.35,
  fps = 30,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });

    let frameId;
    let timeoutId;
    let t = 0;

    const lerp = (a, b, n) => a + (b - a) * n;
    const fade = (n) => n * n * (3 - 2 * n);

    const hash = (x, y) => {
      const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return s - Math.floor(s);
    };

    const noise = (x, y) => {
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const sx = fade(x - x0);
      const sy = fade(y - y0);

      const n00 = hash(x0, y0);
      const n10 = hash(x0 + 1, y0);
      const n01 = hash(x0, y0 + 1);
      const n11 = hash(x0 + 1, y0 + 1);

      return lerp(lerp(n00, n10, sx), lerp(n01, n11, sx), sy);
    };

    const hexToRgb = (hex) => {
      const n = parseInt(hex.replace("#", ""), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };

    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    const resize = () => {
      canvas.width = Math.ceil(window.innerWidth / resolution);
      canvas.height = Math.ceil(window.innerHeight / resolution);
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      ctx.imageSmoothingEnabled = true;
    };

    const smoothstep = (edge0, edge1, x) => {
      x = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return x * x * (3 - 2 * x);
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const image = ctx.createImageData(w, h);
      const data = image.data;

      let i = 0;

      for (let y = 0; y < h; y++) {
        const ny = y * noiseScale;

        for (let x = 0; x < w; x++) {
          const nx = x * noiseScale;

          let n =
            noise(nx + t, ny + t * 0.7) * 0.65 +
            noise(nx * 2.1 - t * 0.4, ny * 2.1 + t) * 0.25 +
            noise(nx * 4.2 + t * 0.2, ny * 4.2 - t * 0.3) * 0.1;

          n = (n - 0.5) * contrast + 0.5;
          n = smoothstep(softness, 1 - softness, n);
          n = Math.max(0, Math.min(1, n));

          data[i++] = lerp(c2[0], c1[0], n);
          data[i++] = lerp(c2[1], c1[1], n);
          data[i++] = lerp(c2[2], c1[2], n);
          data[i++] = 255;
        }
      }

      ctx.putImageData(image, 0, 0);
      t += speed;

      timeoutId = setTimeout(() => {
        frameId = requestAnimationFrame(draw);
      }, 1000 / fps);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
      window.removeEventListener("resize", resize);
    };
  }, [color1, color2, resolution, noiseScale, speed, contrast, softness, fps]);

  return <canvas ref={canvasRef} className="perlin-bg" />;
}