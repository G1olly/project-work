//1) Anno corrente nel footer
//2) KPI: numero di documenti/report
document.addEventListener("DOMContentLoaded", () => {
  // 1) Anno nel footer
  const yearNow = document.getElementById("yearNow");
  if (yearNow) yearNow.textContent = String(new Date().getFullYear());

  // 2) KPI documenti (conteggio card report)
  const kpiDocs = document.getElementById("kpiDocs");
  const cards = document.querySelectorAll(".report-card");
  if (kpiDocs) kpiDocs.textContent = String(cards.length);
});
