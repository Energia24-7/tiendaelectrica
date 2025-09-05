let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  const tbody = document.querySelector("#cartTable tbody");
  tbody.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const itemTotal = (item.Precio*item.cantidad).toFixed(2);
    total += parseFloat(itemTotal);
    tbody.innerHTML += `
      <tr>
        <td>${item.Nombre}</td>
        <td><input type="number" min="1" value="${item.cantidad}" onchange="updateQuantity('${item.Nombre}', this.value)"></td>
        <td>$${item.Precio}</td>
        <td>$${itemTotal}</td>
      </tr>
    `;
  });
  document.getElementById("cartTotal").textContent = total.toFixed(2);
}

function updateQuantity(name, qty){
  const item = cart.find(p => p.Nombre===name);
  if(item) item.cantidad = parseInt(qty);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

renderCart();
