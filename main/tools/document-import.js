const form = document.querySelector("#import-form");
const fileInput = document.querySelector("#pdf-file");
const fileLabel = document.querySelector("#file-label");
const displayName = document.querySelector("#display-name");
const categoryInput = document.querySelector("#category");
const result = document.querySelector("#import-result");
let generatedEntry = "";

const slugify = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    fileLabel.textContent = file.name;
    if (!displayName.value) displayName.value = file.name.replace(/\.pdf$/i, "").replace(/[_-]+/g, " ");
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const file = fileInput.files[0];
  if (!file || file.type !== "application/pdf") return;
  const name = displayName.value.trim() || file.name.replace(/\.pdf$/i, "");
  const category = categoryInput.value;
  const safeName = `${slugify(name) || "document"}.pdf`;
  const entry = { name, category, file: `documents/${safeName}` };
  generatedEntry = JSON.stringify(entry, null, 2);
  document.querySelector("#result-title").textContent = name;
  document.querySelector("#result-path").textContent = `main/${entry.file}`;
  document.querySelector("#result-json").textContent = generatedEntry;
  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#copy-json").addEventListener("click", async () => {
  await navigator.clipboard.writeText(generatedEntry);
  document.querySelector("#copy-json").textContent = "Entrée copiée ✓";
});

document.querySelector("#download-json").addEventListener("click", () => {
  const blob = new Blob([`${generatedEntry}\n`], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "document-entry.json";
  link.click();
  URL.revokeObjectURL(link.href);
});
