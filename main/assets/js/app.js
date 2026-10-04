const trainings = [
  { id: 1, title: "Tir en sortie d'écran", category: "Technique", level: "Intermédiaire", duration: 20, description: "Créer de l'espace et enchaîner réception, appui et tir.", page: "pages/drill-semaine-96.html", icon: "◌" },
  { id: 2, title: "Défense : fermer la ligne de fond", category: "Tactique", level: "Avancé", duration: 25, description: "Guider l'attaquant et protéger la zone restrictive.", page: "pages/drill-defensif-5.html", icon: "◇" },
  { id: 3, title: "Dribble et changements de rythme", category: "Technique", level: "Débutant", duration: 15, description: "Gagner en contrôle, vitesse et lecture du défenseur.", page: "pages/drill-semaine-98.html", icon: "↯" },
  { id: 4, title: "Circuit condition physique", category: "Physique", level: "Intermédiaire", duration: 35, description: "Un parcours complet : appuis, sprint, saut et finition.", page: "pages/drill-semaine-43.html", icon: "↗" },
  { id: 5, title: "Attaquer la défense de zone", category: "Tactique", level: "Avancé", duration: 30, description: "Lire les espaces et créer un avantage dès la première passe.", page: "pages/drill-semaine-82.html", icon: "▱" },
  { id: 6, title: "Passe et démarquage à deux", category: "Jeunes", level: "Débutant", duration: 15, description: "Les fondamentaux pour jouer ensemble et bouger sans ballon.", page: "pages/drill-semaine-24.html", icon: "↗" },
  { id: 7, title: "Finir près du cercle", category: "Technique", level: "Débutant", duration: 20, description: "Varier les finitions après contact et protéger son ballon.", page: "pages/drill-semaine-10bis.html", icon: "○" },
  { id: 8, title: "Transition offensive 3 contre 2", category: "Tactique", level: "Intermédiaire", duration: 25, description: "Courir les couloirs et décider vite en surnombre.", page: "pages/drill-semaine-105.html", icon: "△" },
  { id: 9, title: "Motricité avec ballon", category: "Jeunes", level: "Débutant", duration: 10, description: "Coordination, équilibre et plaisir pour les plus jeunes.", page: "pages/drill-semaine-117.html", icon: "✦" }
];
const state = { query: "", tab: "all", sort: "recommended", filters: { category: [], level: [], duration: [] }, favorites: JSON.parse(localStorage.getItem("basket-lab-favorites") || "[]") };
let documents = [];
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const durationGroup = (minutes) => minutes < 15 ? "court" : minutes <= 30 ? "standard" : "long";

function filteredTrainings() {
  let list = [...trainings, ...documents.map((document, index) => ({ ...document, id: `pdf-${index}`, title: document.name, type: "pdf", icon: "PDF" }))].filter((training) => {
    const text = `${training.title} ${training.category || ""} ${training.description || ""}`.toLowerCase();
    const matchesQuery = !state.query || text.includes(state.query.toLowerCase());
    const matchesFilters = Object.entries(state.filters).every(([key, values]) => {
      if (!values.length) return true;
      if (key === "duration") return training.duration !== undefined && values.includes(durationGroup(training.duration));
      return values.includes(training[key]);
    });
    return matchesQuery && matchesFilters && (state.tab === "all" || state.favorites.includes(training.id));
  });
  if (state.sort === "duration") list.sort((a, b) => a.duration - b.duration);
  if (state.sort === "recent") list.sort((a, b) => b.id - a.id);
  return list;
}
function render() {
  const list = filteredTrainings();
  const allResources = [...trainings, ...documents.map((document, index) => ({ ...document, id: `pdf-${index}`, title: document.name, type: "pdf", icon: "PDF" }))];
  const categories = [...new Set(allResources.map((resource) => resource.category).filter(Boolean))].sort();
  $("#training-total").textContent = allResources.length;
  $("#category-filters").innerHTML = categories.map((category) => `<label><input type="checkbox" value="${category}" data-filter="category" /> <span>${category}</span><small>${allResources.filter((resource) => resource.category === category).length}</small></label>`).join("");
  $("#category-filters").querySelectorAll("input").forEach((input) => { input.checked = state.filters.category.includes(input.value); input.addEventListener("change", (event) => { state.filters.category = [...$("#category-filters").querySelectorAll("input:checked")].map((item) => item.value); render(); }); });
  $("#cards").innerHTML = list.map((training) => training.type === "pdf" ? `
    <article class="card resource-card pdf-card">
      <div class="card-top"><span class="card-tag">PDF · ${training.category}</span><button class="favorite ${state.favorites.includes(training.id) ? "is-favorite" : ""}" data-favorite="${training.id}" aria-label="Ajouter aux favoris">★</button></div>
      <h3>${training.title}</h3><p>Document PDF à consulter ou télécharger.</p>
      <div class="card-meta"><span>PDF</span><span>${training.category}</span></div>
      <a class="card-link" href="${encodeURI(training.file)}" target="_blank" rel="noopener" aria-label="Ouvrir ${training.title}">↗</a>
      <a class="pdf-download-link" href="${encodeURI(training.file)}" download="${training.title}.pdf">Télécharger ↓</a>
    </article>` : `
    <article class="card">
      <div class="card-top"><span class="card-tag">${training.icon} ${training.category}</span>
        <button class="favorite ${state.favorites.includes(training.id) ? "is-favorite" : ""}" data-favorite="${training.id}" aria-label="${state.favorites.includes(training.id) ? "Retirer des favoris" : "Ajouter aux favoris"}">★</button>
      </div>
      <h3>${training.title}</h3><p>${training.description}</p>
      <div class="card-meta"><span>${training.duration} min</span><span>${training.level}</span></div>
      <button class="card-link" data-detail="${training.id}" aria-label="Voir ${training.title}">↗</button>
    </article>`).join("");
  $("#empty-state").hidden = list.length !== 0;
  $("#result-count").textContent = `${list.length} ressource${list.length > 1 ? "s" : ""}`;
  $("#favorites-count").textContent = state.favorites.length;
  $("#tab-favorites-count").textContent = state.favorites.length;
}
function saveFavorites() { localStorage.setItem("basket-lab-favorites", JSON.stringify(state.favorites)); render(); }
function resetFilters() { state.query = ""; state.filters = { category: [], level: [], duration: [] }; $("#search-input").value = ""; $$("[data-filter]").forEach((input) => { input.checked = false; }); render(); }
function showDetail(id) {
  const training = trainings.find((item) => item.id === id);
  $("#dialog-content").innerHTML = `<span class="dialog-content-tag">${training.icon} ${training.category}</span><h2>${training.title}</h2><p>${training.description}</p><div class="dialog-details"><span>${training.duration} min</span><span>${training.level}</span></div><a class="dialog-action" href="${training.page}">Ouvrir la fiche complète ↗</a>`;
  $("#detail-dialog").showModal();
}
document.addEventListener("click", (event) => {
  const favorite = event.target.closest("[data-favorite]");
  if (favorite) { const id = favorite.dataset.favorite; const normalizedId = id.startsWith("pdf-") ? id : Number(id); state.favorites = state.favorites.includes(normalizedId) ? state.favorites.filter((item) => item !== normalizedId) : [...state.favorites, normalizedId]; saveFavorites(); return; }
  const detail = event.target.closest("[data-detail]"); if (detail) { showDetail(Number(detail.dataset.detail)); return; }
  const search = event.target.closest("[data-search]"); if (search) { state.query = search.dataset.search; $("#search-input").value = state.query; render(); $("#bibliotheque").scrollIntoView({ behavior: "smooth" }); return; }
  const tab = event.target.closest("[data-tab]"); if (tab) { state.tab = tab.dataset.tab; $$(".tab").forEach((item) => item.classList.toggle("active", item === tab)); render(); }
  if (event.target.closest('[data-action="show-favorites"]')) { state.tab = "favorites"; $$(".tab").forEach((item) => item.classList.toggle("active", item.dataset.tab === "favorites")); $("#bibliotheque").scrollIntoView({ behavior: "smooth" }); render(); }
  if (event.target.closest('[data-action="close-dialog"]')) $("#detail-dialog").close();
  if (event.target.id === "reset-filters" || event.target.id === "empty-reset") resetFilters();
});
$("#search-input").addEventListener("input", (event) => { state.query = event.target.value.trim(); render(); });
$("#search-form").addEventListener("submit", (event) => event.preventDefault());
$$("[data-filter]").forEach((input) => input.addEventListener("change", (event) => { const { filter } = event.target.dataset; state.filters[filter] = $$(`[data-filter="${filter}"]:checked`).map((item) => item.value); render(); }));
$("#sort-select").addEventListener("change", (event) => { state.sort = event.target.value; render(); });
document.addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); $("#search-input").focus(); } });
render();
fetch("data/documents.json").then((response) => {
  if (!response.ok) throw new Error(`Impossible de charger les documents (${response.status})`);
  return response.json();
}).then((loadedDocuments) => {
  documents = loadedDocuments;
  render();
}).catch((error) => {
  console.error(error);
  render();
});
