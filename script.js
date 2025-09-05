const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1F0-U9VAAgz2t1e1yDyW7bEUL0OVa_-RbvdeGFQPiLqM1VrwK-jxTsd6UllP9ByAsUW1WzfmkJ3RF/pub?output=csv";
let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Mostrar número en carrito
function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

// Renderizar productos
function renderProducts(filterCategory = null, filterBrand = null) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  let filtered = products;
  if (filterCategory) filtered = filtered.filter(p => p.Categoria === filterCategory);
  if (filterBrand) filtered = filtered.filter(p => p.Marca === filterBrand);

  filtered.forEach((p, idx) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${p.Imagen}" class="card-img-top" alt="${p.Modelo}">
        <div class="card-body">
          <h5 class="card-title">${p.Marca} - ${p.Modelo}</h5>
          <p class="card-text"><strong>Precio:</strong> $${p.Precio}</p>
          <p><strong>Entrega:</strong> ${p.Entrega}</p>
          <p>${p.Descripcion}</p>
          <button class="btn btn-primary add-to-cart" data-id="${idx}">➕ Añadir al carrito</button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      cart.push(products[id]);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
    });
  });
}

// Filtros dinámicos
function renderFilters() {
  const categories = [...new Set(products.map(p => p.Categoria))];
  const brands = [...new Set(products.map(p => p.Marca))];

  const catList = document.getElementById("filter-category");
  const brandList = document.getElementById("filter-brand");

  catList.innerHTML = `<li><a href="#" class="filter-cat" data-cat="">Todos</a></li>`;
  categories.forEach(cat => {
    catList.innerHTML += `<li><a href="#" class="filter-cat" data-cat="${cat}">${cat}</a></li>`;
  });

  brandList.innerHTML = `<li><a href="#" class="filter-brand" data-brand="">Todos</a></li>`;
  brands.forEach(b => {
    brandList.innerHTML += `<li><a href="#" class="filter-brand" data-brand="${b}">${b}</a></li>`;
  });

  document.querySelectorAll(".filter-cat").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      renderProducts(e.target.dataset.cat, null);
    });
  });

  document.querySelectorAll(".filter-brand").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      renderProducts(null, e.target.dataset.brand);
    });
  });
}

// Cargar datos desde Google Sheets
fetch(sheetURL)
  .then(res => res.text())
  .then(text => {
    const rows = text.split("\n").map(r => r.split(","));
    const headers = rows[0];
    products = rows.slice(1).map(r => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
    renderProducts();
    renderFilters();
    updateCartCount();
  });
