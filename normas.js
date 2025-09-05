const SHEET_URL_2 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1F0-U9VAAgz2t1e1yDyW7bEUL0OVa_-RbvdeGFQPiLqM1VrwK-jxTsd6UllP9ByAsUW1WzfmkJ3RF/pub?output=csv&gid=123456789"; 
// 👆 cambia el gid al de Hoja2

Papa.parse(SHEET_URL_2, {
  download: true,
  header: true,
  complete: function(results) {
    const items = results.data.filter(r => r.Nombre);
    renderNormas(items);
  }
});

function renderNormas(items) {
  const container = document.getElementById("normasList");
  container.innerHTML = "";
  items.forEach(p => {
    container.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <img src="${p.Imagen}" class="card-img-top">
          <div class="card-body">
            <h5>${p.Nombre}</h5>
            <p><strong>Código:</strong> ${p.Codigo}</p>
            <p><strong>Precio:</strong> $${p.Precio}</p>
            <a href="${p.Link}" target="_blank" class="btn btn-success">📥 Descargar</a>
          </div>
        </div>
      </div>
    `;
  });
}
