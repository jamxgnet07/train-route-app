const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
const themeToggle = document.getElementById("themeToggle");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

const mockTrains = [
  {
    number: "12627",
    name: "Karnataka Express",
    from: "MAS",
    to: "SBC",
    duration: "05h 40m",
    classes: "SL, 3A, 2A",
    stations: ["MGR Chennai Central", "Arakkonam", "Katpadi", "Jolarpettai", "Bengaluru"],
  },
  {
    number: "12007",
    name: "Shatabdi Express",
    from: "MAS",
    to: "SBC",
    duration: "04h 55m",
    classes: "CC, EC",
    stations: ["MGR Chennai Central", "Katpadi", "Kuppam", "Bengaluru"],
  },
];

document.getElementById("searchTrainsBtn").addEventListener("click", () => {
  const from = document.getElementById("fromStation").value.trim();
  const to = document.getElementById("toStation").value.trim();
  const results = document.getElementById("betweenResults");

  if (!from || !to) {
    results.innerHTML = `<div class="empty-state">Please enter both source and destination stations.</div>`;
    return;
  }

  results.innerHTML = mockTrains.map(train => `
    <article class="result-card">
      <div class="result-top">
        <div>
          <h4 class="result-title">${train.number} · ${train.name}</h4>
          <p class="result-subtitle">${train.from} → ${train.to} · ${train.duration}</p>
        </div>
        <div class="badge-row">
          <span class="badge">${train.classes}</span>
        </div>
      </div>
      <strong>Route preview</strong>
      <ol class="station-list">
        ${train.stations.map(station => `<li>${station}</li>`).join("")}
      </ol>
    </article>
  `).join("");
});

document.getElementById("searchScheduleBtn").addEventListener("click", () => {
  const trainNumber = document.getElementById("trainNumber").value.trim();
  const results = document.getElementById("scheduleResults");

  if (!trainNumber) {
    results.innerHTML = `<div class="empty-state">Please enter a train number.</div>`;
    return;
  }

  results.innerHTML = `
    <article class="result-card">
      <h4 class="result-title">Train ${trainNumber} Schedule</h4>
      <p class="result-subtitle">This is a frontend mock response. Real schedule API will be connected in phase 2.</p>
      <ol class="station-list">
        <li>MGR Chennai Central - 06:00</li>
        <li>Katpadi Junction - 08:05</li>
        <li>Jolarpettai Junction - 09:20</li>
        <li>KSR Bengaluru - 11:00</li>
      </ol>
    </article>
  `;
});

document.getElementById("checkPnrBtn").addEventListener("click", () => {
  const pnr = document.getElementById("pnrNumber").value.trim();
  const results = document.getElementById("pnrResults");

  if (!pnr) {
    results.innerHTML = `<div class="empty-state">Please enter a PNR number.</div>`;
    return;
  }

  results.innerHTML = `
    <article class="result-card">
      <h4 class="result-title">PNR ${pnr}</h4>
      <p class="result-subtitle">Frontend demo response for now.</p>
      <div class="badge-row">
        <span class="badge">Chart Not Prepared</span>
        <span class="badge">Coach: B2</span>
        <span class="badge">Berth: 21</span>
      </div>
    </article>
  `;
});