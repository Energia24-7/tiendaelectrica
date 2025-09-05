const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1F0-U9VAAgz2t1e1yDyW7bEUL0OVa_-RbvdeGFQPiLqM1VrwK-jxTsd6UllP9ByAsUW1WzfmkJ3RF/pub?output=csv";

let allProducts = [];
let filteredProducts = [];

// Cargar productos desde Google Sheets
Papa.parse(SHEET_URL, {
  download: true,
  header: true,
  complete: function(results) {
    console.log("Datos recibidos:", results.data);
    allProducts = results.data.filter(p => p.Nombre); // eliminar filas vacías
    filteredProducts = [...allProducts];
    renderCategories();
    renderBrands();
    renderProducts(allProducts);
  },
  error: function(err) {
    console.error("Error leyendo hoja:", err);
  }
});

// Renderizar categorías
function renderCategories() {
  const categories = [...new Set(allProducts.map(p => p.Categoria))];
  const categoryList = document.getElementById("categoryList");

  categories.forEach(cat => {
    let li = document.createElement("li");
    li.className = "nav-item";
    li.innerHTML = `<a href="#" class="nav-link" onclick="filterProducts('${cat}')">${cat}</a>`;
    categoryList.appendChild(li);
  });
}

// Renderizar marcas
function renderBrands() {
  const brands = [...new Set(allProducts.map(p => p.Marca))];
  const brandList = document.getElementById("brandList");

  brands.forEach(brand => {
    let li = document.createElement("li");
    li.className = "nav-item";
    li.innerHTML = `<a href="#" class="nav-link" onclick="filterByBrand('${brand}')">${brand}</a>`;
    brandList.appendChild(li);
  });
}

// Renderizar productos
function renderProducts(products) {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  products.forEach((p) => {
    const card = `
      <div class="col-md-4">
        <div class="card h-100">
          <img src="${p.Imagen}" class="card-img-top" alt="${p.Nombre}">
          <div class="card-body">
            <h5 class="card-title">${p.Nombre}</h5>
            <p><strong>Marca:</strong> ${p.Marca}</p>
            <p><strong>Modelo:</strong> ${p.Modelo}</p>
            <p><strong>Precio:</strong> $${p.Precio}</p>
            <p><strong>Entrega:</strong> ${p.Entrega}</p>
            <p class="card-text">${p.Descripcion || ""}</p>
            <button class="btn btn-primary">➕ Añadir al carrito</button>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

// Filtro por categoría
function filterProducts(category) {
  if (category === "Todos") {
    filteredProducts = [...allProducts];
  } else {
    filteredProducts = allProducts.filter(p => p.Categoria === category);
  }
  renderProducts(filteredProducts);
}

// Filtro por marca
function filterByBrand(brand) {
  if (brand === "Todos") {
    renderProducts(filteredProducts);
  } else {
    renderProducts(filteredProducts.filter(p => p.Marca === brand));
  }
}

// Buscador
document.getElementById("searchBox").addEventListener("input", function() {
  const term = this.value.toLowerCase();
  const filtered = filteredProducts.filter(p => 
    p.Nombre.toLowerCase().includes(term) || 
    (p.Descripcion && p.Descripcion.toLowerCase().includes(term)) ||
    (p.Marca && p.Marca.toLowerCase().includes(term))
  );
  renderProducts(filtered);
});
