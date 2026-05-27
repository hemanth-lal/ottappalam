const assemblyData = [
  { year: 2006, ldf: 55.7, udf: 34.3, bjp: 8.6, bjpVotes: 9759, validVotes: 113950, electors: 159447, turnout: 71.5, marginPct: 21.4 },
  { year: 2011, ldf: 49.5, udf: 39.4, bjp: 7.3, bjpVotes: 9631, validVotes: 131434, electors: 175065, turnout: 75.1, marginPct: 10.0 },
  { year: 2016, ldf: 45.0, udf: 34.2, bjp: 18.5, bjpVotes: 27605, validVotes: 149200, electors: 196700, turnout: 76.4, marginPct: 10.8 },
  { year: 2021, ldf: 46.7, udf: 37.3, bjp: 15.6, bjpVotes: 25056, validVotes: 160294, electors: 200302, turnout: 80.5, marginPct: 9.5 },
  { year: 2026, ldf: 44.3, udf: 28.6, bjp: 25.0, bjpVotes: 42476, validVotes: 168969, electors: 210225, turnout: 81.14, marginPct: 15.7 }
];

const stateBjpData = [
  { year: 2006, bjp: 4.7 },
  { year: 2011, bjp: 6.0 },
  { year: 2016, bjp: 10.6 },
  { year: 2021, bjp: 11.4 },
  { year: 2026, bjp: 11.5 }
];

const result2026 = [
  { name: "Adv. K. Premkumar", party: "CPI(M)", votes: 75362, share: 44.3 },
  { name: "P.K. Sasi P.K.S", party: "IND", votes: 48585, share: 28.6 },
  { name: "Major Ravi", party: "BJP", votes: 42476, share: 25.0 },
  { name: "Sasi P.K", party: "IND", votes: 1062, share: 0.6 },
  { name: "K.P. Rajeesh", party: "BSP", votes: 1025, share: 0.6 },
  { name: "Muhammed Asharaf V.H", party: "IND", votes: 459, share: 0.3 }
];

const fmt = new Intl.NumberFormat("en-IN");

function setActiveNav() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".primary-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function addText(svg, text, x, y, attrs = {}) {
  const el = svgEl("text", { x, y, ...attrs });
  el.textContent = text;
  svg.appendChild(el);
  return el;
}

function renderShareLines(target) {
  const width = 760;
  const height = 330;
  const pad = { top: 22, right: 30, bottom: 46, left: 46 };
  const maxY = 60;
  const minX = 2006;
  const maxX = 2026;
  const x = (year) => pad.left + ((year - minX) / (maxX - minX)) * (width - pad.left - pad.right);
  const y = (value) => pad.top + (1 - value / maxY) * (height - pad.top - pad.bottom);
  const series = [
    { key: "ldf", label: "LDF/CPI(M)", color: "#243248" },
    { key: "udf", label: "UDF/anti-left lane", color: "#8b857c" },
    { key: "bjp", label: "BJP", color: "#5c1a1b" }
  ];
  const svg = svgEl("svg", { viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": "Vote share trend from 2006 to 2026" });
  [0, 15, 30, 45, 60].forEach((tick) => {
    svg.appendChild(svgEl("line", { x1: pad.left, y1: y(tick), x2: width - pad.right, y2: y(tick), stroke: "#d8d4cb", "stroke-dasharray": "4 5" }));
    addText(svg, `${tick}%`, 8, y(tick) + 4, { fill: "#8b857c", "font-size": 11, "font-family": "monospace" });
  });
  series.forEach((s) => {
    const points = assemblyData.map((d) => `${x(d.year)},${y(d[s.key])}`).join(" ");
    svg.appendChild(svgEl("polyline", { points, fill: "none", stroke: s.color, "stroke-width": s.key === "bjp" ? 4 : 2.5, "stroke-linecap": "round", "stroke-linejoin": "round" }));
    assemblyData.forEach((d) => {
      svg.appendChild(svgEl("circle", { cx: x(d.year), cy: y(d[s.key]), r: s.key === "bjp" ? 5 : 4, fill: s.color }));
    });
    const last = assemblyData[assemblyData.length - 1];
    addText(svg, s.label, x(last.year) - 86, y(last[s.key]) - 11, { fill: s.color, "font-size": 12, "font-family": "Inter, sans-serif", "font-weight": 700 });
  });
  assemblyData.forEach((d) => {
    addText(svg, String(d.year), x(d.year) - 15, height - 15, { fill: "#3f3d3a", "font-size": 12, "font-family": "monospace" });
  });
  target.replaceChildren(svg);
}

function renderBjpVotes(target) {
  const width = 760;
  const height = 300;
  const pad = { top: 18, right: 22, bottom: 44, left: 52 };
  const max = 45000;
  const slot = (width - pad.left - pad.right) / assemblyData.length;
  const svg = svgEl("svg", { viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": "BJP vote count in Ottappalam" });
  [0, 15000, 30000, 45000].forEach((tick) => {
    const gy = pad.top + (1 - tick / max) * (height - pad.top - pad.bottom);
    svg.appendChild(svgEl("line", { x1: pad.left, y1: gy, x2: width - pad.right, y2: gy, stroke: "#d8d4cb", "stroke-dasharray": "4 5" }));
    addText(svg, fmt.format(tick), 4, gy + 4, { fill: "#8b857c", "font-size": 11, "font-family": "monospace" });
  });
  assemblyData.forEach((d, i) => {
    const barW = slot * 0.62;
    const x = pad.left + i * slot + (slot - barW) / 2;
    const barH = (d.bjpVotes / max) * (height - pad.top - pad.bottom);
    const y = height - pad.bottom - barH;
    svg.appendChild(svgEl("rect", { x, y, width: barW, height: barH, fill: d.year === 2026 ? "#5c1a1b" : "#8b857c" }));
    addText(svg, fmt.format(d.bjpVotes), x - 4, y - 8, { fill: "#1a1817", "font-size": 12, "font-family": "monospace", "font-weight": 700 });
    addText(svg, String(d.year), x + 4, height - 15, { fill: "#3f3d3a", "font-size": 12, "font-family": "monospace" });
  });
  target.replaceChildren(svg);
}

function renderTurnoutScatter(target) {
  const width = 720;
  const height = 300;
  const pad = { top: 20, right: 30, bottom: 48, left: 54 };
  const minX = 70;
  const maxX = 83;
  const maxY = 28;
  const x = (v) => pad.left + ((v - minX) / (maxX - minX)) * (width - pad.left - pad.right);
  const y = (v) => pad.top + (1 - v / maxY) * (height - pad.top - pad.bottom);
  const svg = svgEl("svg", { viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": "Turnout and BJP share correlation" });
  [70, 75, 80].forEach((tick) => {
    svg.appendChild(svgEl("line", { x1: x(tick), y1: pad.top, x2: x(tick), y2: height - pad.bottom, stroke: "#d8d4cb", "stroke-dasharray": "3 6" }));
    addText(svg, `${tick}%`, x(tick) - 12, height - 20, { fill: "#8b857c", "font-size": 11, "font-family": "monospace" });
  });
  [0, 10, 20].forEach((tick) => {
    svg.appendChild(svgEl("line", { x1: pad.left, y1: y(tick), x2: width - pad.right, y2: y(tick), stroke: "#d8d4cb", "stroke-dasharray": "3 6" }));
    addText(svg, `${tick}%`, 18, y(tick) + 4, { fill: "#8b857c", "font-size": 11, "font-family": "monospace" });
  });
  assemblyData.forEach((d) => {
    svg.appendChild(svgEl("circle", { cx: x(d.turnout), cy: y(d.bjp), r: d.year === 2026 ? 8 : 6, fill: d.year === 2026 ? "#5c1a1b" : "#243248" }));
    addText(svg, String(d.year), x(d.turnout) + 10, y(d.bjp) + 4, { fill: "#1a1817", "font-size": 12, "font-family": "monospace", "font-weight": 700 });
  });
  addText(svg, "Turnout", width - 96, height - 4, { fill: "#8b857c", "font-size": 11, "font-family": "monospace" });
  addText(svg, "BJP share", 4, 14, { fill: "#8b857c", "font-size": 11, "font-family": "monospace" });
  target.replaceChildren(svg);
}

function renderResultBars(target) {
  const width = 760;
  const rowH = 43;
  const height = 34 + result2026.length * rowH;
  const max = Math.max(...result2026.map((d) => d.share));
  const svg = svgEl("svg", { viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": "Ottappalam 2026 candidate vote share" });
  result2026.forEach((d, i) => {
    const y = 22 + i * rowH;
    const barW = (d.share / max) * 440;
    addText(svg, d.name, 0, y + 14, { fill: "#1a1817", "font-size": 13, "font-family": "Inter, sans-serif", "font-weight": d.party === "BJP" ? 800 : 600 });
    svg.appendChild(svgEl("rect", { x: 235, y, width: barW, height: 18, fill: d.party === "BJP" ? "#5c1a1b" : d.party === "CPI(M)" ? "#243248" : "#8b857c" }));
    addText(svg, `${d.share.toFixed(1)}%`, 235 + barW + 10, y + 14, { fill: "#1a1817", "font-size": 12, "font-family": "monospace", "font-weight": 700 });
    addText(svg, fmt.format(d.votes), 682, y + 14, { fill: "#8b857c", "font-size": 12, "font-family": "monospace", "text-anchor": "end" });
  });
  target.replaceChildren(svg);
}

function renderStateCompare(target) {
  const width = 720;
  const height = 290;
  const pad = { top: 20, right: 28, bottom: 46, left: 44 };
  const max = 28;
  const combined = assemblyData.map((d, i) => ({ year: d.year, ott: d.bjp, state: stateBjpData[i].bjp }));
  const x = (year) => pad.left + ((year - 2006) / 20) * (width - pad.left - pad.right);
  const y = (v) => pad.top + (1 - v / max) * (height - pad.top - pad.bottom);
  const svg = svgEl("svg", { viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": "Ottappalam BJP share compared with Kerala BJP share" });
  [0, 10, 20].forEach((tick) => {
    svg.appendChild(svgEl("line", { x1: pad.left, y1: y(tick), x2: width - pad.right, y2: y(tick), stroke: "#d8d4cb", "stroke-dasharray": "4 5" }));
    addText(svg, `${tick}%`, 10, y(tick) + 4, { fill: "#8b857c", "font-size": 11, "font-family": "monospace" });
  });
  [
    { key: "ott", label: "Ottappalam BJP", color: "#5c1a1b", width: 4 },
    { key: "state", label: "Kerala BJP", color: "#243248", width: 2.5 }
  ].forEach((s) => {
    const points = combined.map((d) => `${x(d.year)},${y(d[s.key])}`).join(" ");
    svg.appendChild(svgEl("polyline", { points, fill: "none", stroke: s.color, "stroke-width": s.width, "stroke-linejoin": "round", "stroke-linecap": "round" }));
    combined.forEach((d) => svg.appendChild(svgEl("circle", { cx: x(d.year), cy: y(d[s.key]), r: s.key === "ott" ? 5 : 4, fill: s.color })));
    const last = combined[combined.length - 1];
    addText(svg, s.label, x(last.year) - 120, y(last[s.key]) - 11, { fill: s.color, "font-size": 12, "font-family": "Inter, sans-serif", "font-weight": 700 });
  });
  combined.forEach((d) => addText(svg, String(d.year), x(d.year) - 15, height - 15, { fill: "#3f3d3a", "font-size": 12, "font-family": "monospace" }));
  target.replaceChildren(svg);
}

function renderCharts() {
  document.querySelectorAll("[data-chart]").forEach((target) => {
    const type = target.getAttribute("data-chart");
    if (type === "share-lines") renderShareLines(target);
    if (type === "bjp-votes") renderBjpVotes(target);
    if (type === "turnout-scatter") renderTurnoutScatter(target);
    if (type === "result-bars") renderResultBars(target);
    if (type === "state-compare") renderStateCompare(target);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  renderCharts();
});
