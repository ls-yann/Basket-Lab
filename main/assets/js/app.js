const state = { query: "", tab: "all", sort: "recommended", filters: { category: [], level: [], duration: [] }, favorites: JSON.parse(localStorage.getItem("basket-lab-favorites") || "[]") };
let trainings = [];
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
  if (state.sort === "recent") list.sort((a, b) => String(b.id).localeCompare(String(a.id)));
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
      <a class="card-link" href="${encodeURI(training.file)}" aria-label="Ouvrir ${training.title}">↗</a>
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
  if (!training) return;
  $("#dialog-content").innerHTML = `<span class="dialog-content-tag">${training.icon} ${training.category}</span><h2>${training.title}</h2><p>${training.description}</p><div class="dialog-details"><span>${training.duration} min</span><span>${training.level}</span></div><a class="dialog-action" href="${training.file}">Ouvrir la fiche complète ↗</a>`;
  $("#detail-dialog").showModal();
}
document.addEventListener("click", (event) => {
  const favorite = event.target.closest("[data-favorite]");
  if (favorite) { const id = favorite.dataset.favorite; const normalizedId = id.startsWith("pdf-") ? id : Number(id); state.favorites = state.favorites.includes(normalizedId) ? state.favorites.filter((item) => item !== normalizedId) : [...state.favorites, normalizedId]; saveFavorites(); return; }
  const detail = event.target.closest("[data-detail]"); if (detail) { showDetail(detail.dataset.detail); return; }
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
Promise.all(["data/trainings.json", "data/documents.json"].map((path) => fetch(path).then((response) => {
  if (!response.ok) throw new Error(`Impossible de charger ${path} (${response.status})`);
  return response.json();
}))).then(([loadedTrainings, loadedDocuments]) => {
  trainings = loadedTrainings;
  documents = loadedDocuments;
  render();
}).catch((error) => {
  console.error(error);
  render();
});
