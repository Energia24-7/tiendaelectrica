const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1F0-U9VAAgz2t1e1yDyW7bEUL0OVa_-RbvdeGFQPiLqM1VrwK-jxTsd6UllP9ByAsUW1WzfmkJ3RF/pub?output=csv";

function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

const productName = getQueryParam("name");

Papa.parse(SHEET_URL, {
  download: true,
  header: true,
  complete: function(results) {
    const product = results.data.find(p => p.Nombre === productName);
    if(!product) return;

    const container = document.getElementById("productDetail");
    container.innerHTML = `
      <div class="card">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${product.Imagen}" class="img-fluid rounded-start">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h3>${product.Nombre}</h3>
              <p><strong>Marca:</strong> ${product.Marca}</p>
              <p><strong>Modelo:</strong> ${product.Modelo}</p>
              <p><strong>Precio:</strong> $${product.Precio}</p>
              <p><strong>Entrega:</strong> ${product.Entrega}</p>
              <p><strong>Categoría:</strong> ${product.Categoria}</p>
              <p>${product.Descripcion}</p>
              <a href="${product.HojaDatos}" target="_blank" class="btn btn-info">Ver hoja de datos</a>
              <button class="btn btn-primary" onclick="addToCart('${product.Nombre}')">Añadir al carrito</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
});

function addToCart(productName) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(p => p.Nombre === productName);
  if(existing) existing.cantidad +=1;
  else {
    cart.push({Nombre:productName, cantidad:1});
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Producto añadido al carrito!");
}
