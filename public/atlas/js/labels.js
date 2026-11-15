// Draws horizon directions and astronomical reference points on the overlay canvas.
import { D2R, eqToAltAzVec } from "./astro.js";
export function drawReferencePoints(ctx, view, latDeg, lst, enabled) {
  const pts = { ncp:["NCP",0,90], scp:["SCP",0,-90], ngp:["NGP",192.85948,27.12825], sgp:["SGP",12.85948,-27.12825], nep:["NEP",270,66.5607], sep:["SEP",90,-66.5607] };
  ctx.save(); ctx.font = "600 12px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
  for (const [key, [name, ra, dec]] of Object.entries(pts)) {
    if (!enabled[key]) continue;
    const p = view.project(eqToAltAzVec(ra, dec, latDeg, lst));
    if (!p || p[0] < -30 || p[0] > view.W + 30 || p[1] < -30 || p[1] > view.H + 30) continue;
    ctx.strokeStyle = "#f6c85f"; ctx.fillStyle = "#f6c85f"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, 2 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p[0]-8,p[1]); ctx.lineTo(p[0]+8,p[1]); ctx.moveTo(p[0],p[1]-8); ctx.lineTo(p[0],p[1]+8); ctx.stroke();
    ctx.fillText(name, p[0]+8, p[1]-8);
  }
  ctx.restore();
}
export function drawDirections(ctx, view) {
  ctx.font = "600 15px 'Segoe UI', system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ["N","NE","E","SE","S","SW","W","NW"].forEach((name, i) => {
    const a = i * 45 * D2R, p = view.project([Math.cos(a), Math.sin(a), 0]);
    if (!p || p[0] < -40 || p[0] > view.W + 40 || p[1] < -40 || p[1] > view.H + 40) return;
    ctx.fillStyle = name === "N" ? "#f2557a" : name.length === 1 ? "#f1e8ea" : "rgba(241,232,234,0.65)";
    ctx.fillText(name, p[0], p[1]-16); ctx.fillRect(p[0]-0.5,p[1]-6,1,6);
  });
}
