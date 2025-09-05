const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1F0-U9VAAgz2t1e1yDyW7bEUL0OVa_-RbvdeGFQPiLqM1VrwK-jxTsd6UllP9ByAsUW1WzfmkJ3RF/pubhtml";

let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

// Cargar productos desde Google Sheets
Papa.parse(SHEET_URL, {
  download: true,
  header: true,
  complete: function(results) {
    allProducts = results.data.filter(p => p.Nombre);
    renderProducts(allProducts);
    updateCartCount();
  }
});

function renderProducts(products) {
  const container = document.getElementById("productList");
  container.innerHTML = "";
  products.forEach(p => {
    container.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <img src="${p.Imagen}" class="card-img-top" style="cursor:pointer;" onclick="openProductDetail('${p.Nombre}')">
          <div class="card-body">
            <h5>${p.Nombre}</h5>
            <p><strong>Marca:</strong> ${p.Marca}</p>
            <p><strong>Precio:</strong> $${p.Precio}</p>
            <button class="btn btn-primary" onclick="addToCart('${p.Nombre}')">➕ Añadir al carrito</button>
          </div>
        </div>
      </div>
    `;
  });
}

function addToCart(productName) {
  const product = allProducts.find(p => p.Nombre === productName);
  if (!product) return;
  const existing = cart.find(item => item.Nombre === productName);
  if(existing) existing.cantidad += 1;
  else cart.push({...product, cantidad:1});
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function openProductDetail(productName) {
  window.location.href = `product.html?name=${encodeURIComponent(productName)}`;
}
