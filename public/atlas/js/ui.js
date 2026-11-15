// Small helpers for status messages, band buttons and information cards.

import { CONFIG } from "./config.js";
import { hms, dms } from "./astro.js";

export const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const busy = new Map();
let transient = "";
let transientTimer = 0;
function renderStatus() {
  const text = [...busy.values(), transient].filter(Boolean).join(" · ");
  const el = $("status");
  el.textContent = text;
  el.style.display = text ? "block" : "none";
}
export function setBusy(key, text) { if (text) busy.set(key, text); else busy.delete(key); renderStatus(); }
export function say(msg, ms) {
  transient = msg;
  clearTimeout(transientTimer);
  if (msg && ms) transientTimer = setTimeout(() => { transient = ""; renderStatus(); }, ms);
  renderStatus();
}
export const ui = { setBusy, say };

export function buildBandButtons(onSelect) {
  const wrap = $("bands");
  CONFIG.bands.forEach((band, i) => {
    const btn = document.createElement("button");
    btn.className = "band" + (i === 0 ? " active" : "");
    btn.dataset.id = band.id;
    btn.innerHTML = `<span>${esc(band.name)}</span><small>${esc(band.range)}</small>`;
    btn.addEventListener("click", () => onSelect(band.id));
    wrap.appendChild(btn);
  });
}
export function setActiveBand(id) {
  document.querySelectorAll(".band").forEach((el) => el.classList.toggle("active", el.dataset.id === id));
}

const pad = (n) => String(n).padStart(2, "0");
export function setTimeInput(ms) {
  const d = new Date(ms);
  $("time").value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const time = $("pill-time"), date = $("pill-date");
  if (time) time.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  if (date) date.textContent = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const AU_KM = 149597870.7;
export function hideInfo() { $("info").classList.add("hidden"); }
function row(label, value) { return value ? `<tr><th>${esc(label)}</th><td>${value}</td></tr>` : ""; }

export function showTileCard(tile, { onInspect }) {
  const el = $("info");
  el.classList.remove("hidden");
  el.innerHTML = `
    <div class="info-head"><h3>Tile ${esc(tile.name)}</h3><button class="btn close" aria-label="Close">×</button></div>
    <p class="type">InfraSphere tile (HEALPix order ${tile.order}, about 0.46° across)</p>
    <table>${row("Centre (J2000)", `${hms(tile.ra)}, ${dms(tile.dec)}`)}</table>
    <div class="row" style="margin-top:10px"><button class="btn primary" id="tile-inspect">Inspect SPHEREx epochs</button></div>
    <p class="note">Inspect lists every SPHEREx exposure that covered this tile and shows them side by side.</p>`;
  el.querySelector(".close").addEventListener("click", hideInfo);
  el.querySelector("#tile-inspect").addEventListener("click", onInspect);
}

export function showSolarInfo(o) {
  const el = $("info");
  el.classList.remove("hidden");
  const kind = o.kind === "asteroid" ? (o.near ? "Near-Earth asteroid" : "Asteroid") : o.kind === "sun" ? "Star (the Sun)" : o.kind === "moon" ? "Moon" : "Planet";
  const dist = o.kind === "moon" ? `${Math.round(o.dist * AU_KM).toLocaleString("en-US")} km` : `${o.dist.toFixed(3)} AU (${(o.dist * 8.317).toFixed(1)} light-minutes)`;
  el.innerHTML = `
    <div class="info-head"><h3>${esc(o.name)}</h3><button class="btn close" aria-label="Close">×</button></div>
    <p class="type">${esc(kind)}</p>
    <table>
      ${row("Position (J2000)", `${hms(o.ra)}, ${dms(o.dec)}`)}
      ${row("Distance from Earth", dist)}
      ${row("Apparent magnitude", o.mag !== null && o.mag !== undefined ? o.mag.toFixed(1) : "")}
      ${row("Absolute magnitude H", o.H !== undefined ? o.H.toFixed(1) : "")}
    </table>
    <p class="note">${o.kind === "asteroid"
      ? "Position computed from the JPL orbit for the time shown (approximate, within about an arcminute for most main-belt asteroids)."
      : "Position computed for the time shown."} SPHEREx catches moving objects only in single exposures, so they are not part of the combined sky map.</p>
    <div class="links"><a href="${esc(CONFIG.irsaPage)}" target="_blank" rel="noopener">SPHEREx data at IRSA</a></div>`;
  el.querySelector(".close").addEventListener("click", hideInfo);
}
