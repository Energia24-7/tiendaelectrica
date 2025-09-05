// URL pública de tu Google Sheets
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1F0-U9VAAgz2t1e1yDyW7bEUL0OVa_-RbvdeGFQPiLqM1VrwK-jxTsd6UllP9ByAsUW1WzfmkJ3RF/pubhtml";

// Inicializar
window.addEventListener("DOMContentLoaded", () => {
  Tabletop.init({
    key: SHEET_URL,
    simpleSheet: true,
    callback: showProducts
  });

  document.getElementById("search").addEventListener("input", filterProducts);
});

let allProducts = [];

// Mostrar productos
function showProducts(data) {
  allProducts = data;
  renderProducts(allProducts);
  renderCategories(allProducts);
}

// Renderizado de productos
function renderProducts(products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {
    const card = `
      <div class="col-md-4">
        <div class="card h-100">
          <img src="${p.Imagen}" class="card-img-top" alt="${p.Nombre}">
          <div class="card-body">
            <h5 class="card-title">${p.Nombre}</h5>
            <p class="card-text">${p.Descripción}</p>
            <p class="text-primary fw-bold">$${p.Precio}</p>
            <a href="https://wa.me/593999999999?text=Quiero comprar ${encodeURIComponent(p.Nombre)}" 
               class="btn btn-success w-100" target="_blank">Consultar</a>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

// Renderizado de categorías
function renderCategories(products) {
  const cats = [...new Set(products.map(p => p.Categoría))];
  const list = document.getElementById("categories");
  list.innerHTML = "";

  cats.forEach(c => {
    const item = document.createElement("li");
    item.textContent = c;
    item.classList.add("mb-2", "cursor-pointer");
    item.style.cursor = "pointer";
    item.onclick = () => {
      renderProducts(allProducts.filter(p => p.Categoría === c));
    };
    list.appendChild(item);
  });

  // Opción mostrar todo
  const all = document.createElement("li");
  all.textContent = "Todos";
  all.style.cursor = "pointer";
  all.onclick = () => renderProducts(allProducts);
  list.prepend(all);
}

// Filtro de búsqueda
function filterProducts() {
  const query = this.value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.Nombre.toLowerCase().includes(query) ||
    p.Descripción.toLowerCase().includes(query)
  );
  renderProducts(filtered);
}
