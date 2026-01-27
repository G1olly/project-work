/* =========================================================
   script.js — Project work L-31
   Pagina: Librandi | Report di Sostenibilità (Download)

   Funzioni:
   1) Inserisce l'anno corrente nel footer
   2) Calcola KPI (numero documenti/report)
   3) Gestisce tema dark/light con localStorage (se presente il pulsante)
   4) Gestisce filtri (ricerca + anno) sui report (se presenti gli input)
   ========================================================= */

(() => {
  /* ---------------------------------------------------------
     0) SICUREZZA: eseguiamo tutto quando il DOM è pronto
     - Così siamo certi che elementi e sezioni esistano già
     - Evita problemi se in futuro sposti gli script
     --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------------------
       1) RIFERIMENTI DOM (elementi HTML)
       - Se alcuni elementi non esistono, non andiamo in errore
       --------------------------------------------------------- */
    const root = document.documentElement;

    // Pulsante toggle tema (se in futuro lo aggiungi nell'HTML)
    const themeToggle = document.getElementById("themeToggle");

    // Footer: span per anno corrente
    const yearNow = document.getElementById("yearNow");

    // Filtri (opzionali: esistono solo se aggiungi gli input nel DOM)
    const searchInput = document.getElementById("searchInput");
    const yearFilter = document.getElementById("yearFilter");
    const resetBtn = document.getElementById("resetBtn");
    const resultsCount = document.getElementById("resultsCount");
    const emptyState = document.getElementById("emptyState");

    // Card report + KPI documenti
    const cards = Array.from(document.querySelectorAll(".report-card"));
    const kpiDocs = document.getElementById("kpiDocs");

    /* ---------------------------------------------------------
       2) ANNO CORRENTE NEL FOOTER
       - Inserisce automaticamente l'anno attuale nel footer
       --------------------------------------------------------- */
    if (yearNow) yearNow.textContent = String(new Date().getFullYear());

    /* ---------------------------------------------------------
       3) KPI DOCUMENTI
       - Mostra il numero totale di documenti presenti
       - Conteggia le card .report-card
       --------------------------------------------------------- */
    if (kpiDocs) kpiDocs.textContent = String(cards.length);

    /* ---------------------------------------------------------
       4) TEMA DARK/LIGHT (opzionale)
       - Se l'utente ha già scelto un tema: lo ripristiniamo
       - Altrimenti: seguiamo le preferenze del sistema
       - Salviamo la scelta in localStorage
       --------------------------------------------------------- */
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      // Tema salvato dall'utente
      root.dataset.theme = savedTheme;

      // Accessibilità: aria-pressed sul pulsante (se esiste)
      themeToggle?.setAttribute("aria-pressed", savedTheme === "dark" ? "true" : "false");
    } else {
      // Tema di default basato sulle preferenze del sistema
      const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
      root.dataset.theme = prefersLight ? "light" : "dark";
    }

    // Click sul toggle tema (solo se il pulsante esiste)
    themeToggle?.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("theme", next);

      // Aggiorna aria-pressed (accessibilità)
      themeToggle.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
    });

    /* ---------------------------------------------------------
       5) FILTRI REPORT (opzionali)
       - Funzionano solo se nel tuo HTML aggiungi:
         * input#searchInput
         * select#yearFilter
         * button#resetBtn
         * span#resultsCount
         * div#emptyState
       - Se NON ci sono, lo script non fa nulla e non genera errori
       --------------------------------------------------------- */

    /* 5.1) Popola il filtro anno leggendo data-year dalle card */
    if (yearFilter && cards.length) {
      const years = [...new Set(cards.map(c => c.dataset.year).filter(Boolean))]
        .sort((a, b) => {
          // Ordinamento “furbo”: prova numerico, altrimenti stringa
          const na = Number(a);
          const nb = Number(b);
          if (!Number.isNaN(na) && !Number.isNaN(nb)) return nb - na;
          return String(b).localeCompare(String(a));
        });

      for (const y of years) {
        const opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y;
        yearFilter.appendChild(opt);
      }
    }

    /* Utility: normalizza stringhe (minuscole + no accenti) */
    function normalize(str) {
      return (str || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
    }

    /* Verifica se una card corrisponde ai filtri */
    function matches(card, q, year) {
      const text = normalize(card.innerText);
      const tags = normalize(card.dataset.tags);

      const yearOk = year === "all" || card.dataset.year === year;
      const qOk = !q || text.includes(q) || tags.includes(q);

      return yearOk && qOk;
    }

    /* Applica filtri alle card */
    function applyFilters() {
      // Se gli input non esistono, non facciamo nulla
      if (!searchInput || !yearFilter || !resultsCount) return;

      const q = normalize(searchInput.value.trim());
      const year = yearFilter.value;

      let visible = 0;

      for (const card of cards) {
        const ok = matches(card, q, year);
        card.hidden = !ok;
        if (ok) visible++;
      }

      resultsCount.textContent = `${visible} documento/i visualizzati`;

      if (emptyState) emptyState.hidden = visible !== 0;
    }

    // Eventi filtri (solo se gli elementi esistono)
    searchInput?.addEventListener("input", applyFilters);
    yearFilter?.addEventListener("change", applyFilters);

    // Reset filtri (solo se esiste il pulsante)
    resetBtn?.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (yearFilter) yearFilter.value = "all";
      applyFilters();
      searchInput?.focus();
    });

    // Applica filtri al caricamento (se presenti)
    applyFilters();

  });
})();
