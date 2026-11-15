import { D2R } from "./astro.js";

export function drawDirections(ctx, view) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ["N", "NE", "E", "SE", "S", "SW", "W", "NW"].forEach((name, i) => {
    const angle = i * 45 * D2R;
    const point = view.project([Math.cos(angle), Math.sin(angle), 0]);
    if (!point || point[0] < -40 || point[0] > view.W + 40 || point[1] < -40 || point[1] > view.H + 40) return;
    const main = name.length === 1;
    ctx.font = (main ? "700 18px" : "600 13px") + " 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = main ? "#d4606b" : "rgba(212,96,107,0.6)";
    ctx.beginPath();
    ctx.arc(point[0], point[1], main ? 2.4 : 1.8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText(name, point[0], point[1] + (main ? 19 : 15));
  });
}
