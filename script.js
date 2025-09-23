// URL del CSV publicado desde Google Sheets
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1F0-U9VAAgz2t1e1yDyW7bEUL0OVa_-RbvdeGFQPiLqM1VrwK-jxTsd6UllP9ByAsUW1WzfmkJ3RF/pub?output=csv";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderProducts() {
  const categoryFilter = document.getElementById("filter-category").value;
  const brandFilter = document.getElementById("filter-brand").value;
  const list = document.getElementById("product-list");
  list.innerHTML = "";

  products.filter(p =>
    (categoryFilter === "all" || p.categoria === categoryFilter) &&
    (brandFilter === "all" || p.marca === brandFilter)
  ).forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card product-card">
        <img src="${p.imagen}" class="card-img-top" alt="${p.modelo}">
        <div class="card-body">
          <h5 class="card-title">${p.marca} - ${p.modelo}</h5>
          <p class="card-text">${p.descripcion}</p>
          <p><b>Precio:</b> $${p.precio}</p>
          <p><b>Entrega:</b> ${p.entrega}</p>
          <p><b>Stock:</b> ${p.Stock}</p>
          <button class="btn btn-primary" onclick="addToCart(${i})">➕ Añadir al carrito</button>
        </div>
      </div>`;
    list.appendChild(card);
  });
}

function addToCart(index) {
  cart.push(products[index]);
  updateCartCount();
}

// ✅ Leer CSV con PapaParse
Papa.parse(sheetUrl, {
  download: true,
  header: true,
  complete: function(results) {
    products = results.data.map(row => ({
      categoria: row.Categoria,
      marca: row.Marca,
      modelo: row.Modelo,
      precio: row.Precio,
      entrega: row.entrega,
      Stock: row.Stock,
      descripcion: row.Descripcion,
      imagen: row.Imagen
    }));

    // Cargar filtros
    const categories = [...new Set(products.map(p => p.categoria))];
    const brands = [...new Set(products.map(p => p.marca))];

    categories.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c; opt.textContent = c;
      document.getElementById("filter-category").appendChild(opt);
    });
    brands.forEach(b => {
      const opt = document.createElement("option");
      opt.value = b; opt.textContent = b;
      document.getElementById("filter-brand").appendChild(opt);
    });

    renderProducts();
  }
});

document.getElementById("filter-category").addEventListener("change", renderProducts);
document.getElementById("filter-brand").addEventListener("change", renderProducts);

updateCartCount();
