const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1F0-U9VAAgz2t1e1yDyW7bEUL0OVa_-RbvdeGFQPiLqM1VrwK-jxTsd6UllP9ByAsUW1WzfmkJ3RF/pub?output=csv";

let allProducts = [];

// Cargar productos desde Google Sheets
Papa.parse(SHEET_URL, {
  download: true,
  header: true,
  complete: function(results) {
    console.log("Datos recibidos:", results.data);
    allProducts = results.data;
    renderCategories();
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

// Renderizar productos
function renderProducts(products) {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  products.forEach((p, index) => {
    if (!p.Nombre) return; // Evitar filas vacías
    const card = `
      <div class="col-md-4">
        <div class="card">
          <img src="${p.Imagen}" class="card-img-top" alt="${p.Nombre}">
          <div class="card-body">
            <h5 class="card-title">${p.Nombre}</h5>
            <p class="card-text">${p.Descripcion || ""}</p>
            <p class="card-text"><strong>$${p.Precio}</strong></p>
            <a href="https://wa.me/593999999999?text=Hola! Estoy interesado en ${p.Nombre}" target="_blank" class="btn btn-success">WhatsApp</a>
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
    renderProducts(allProducts);
  } else {
    renderProducts(allProducts.filter(p => p.Categoria === category));
  }
}

// Buscador
document.getElementById("searchBox").addEventListener("input", function() {
  const term = this.value.toLowerCase();
  const filtered = allProducts.filter(p => 
    p.Nombre.toLowerCase().includes(term) || 
    (p.Descripcion && p.Descripcion.toLowerCase().includes(term))
  );
  renderProducts(filtered);
});
