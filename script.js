const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4CQDWoqsX_jruiEkAQ5ONE_BkXKYl0Jb04_8nmZtyi4SxLN2AyqxB9a-_g3NfFr3IrbRt4VLjcOeP/pub?output=csv";

Papa.parse(sheetUrl, {
  download: true,
  header: true,
  complete: function(results) {
    let productos = results.data.filter(p => (p.Estado || "").toLowerCase() === "activo");
    const container = document.getElementById("productos-container");
    const filterCategory = document.getElementById("filter-category");
    const filterBrand = document.getElementById("filter-brand");

    // ✅ Build unique filter options
    const categorias = [...new Set(productos.map(p => p.Categoria).filter(Boolean))];
    const marcas = [...new Set(productos.map(p => p.Marca).filter(Boolean))];

    categorias.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      filterCategory.appendChild(opt);
    });

    marcas.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      filterBrand.appendChild(opt);
    });

    // ✅ Render products
    function renderProducts(list) {
      container.innerHTML = "";
      list.forEach(p => {
        const slug = p.Modelo
          ? p.Modelo.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
          : p.Nombre.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

        const card = document.createElement("div");
        card.className = "col-md-3";

        card.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="${p.Imagen}" class="card-img-top" alt="${p.Nombre}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${p.Nombre}</h5>
              <p class="card-text text-muted">${p.Marca || ""} ${p.Modelo || ""}</p>
              <p class="fw-bold text-success">$${p.Precio}</p>
              <a href="producto.html?item=${slug}" class="btn btn-primary mt-auto">Ver producto</a>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    }

    // ✅ Filtering behavior
    function applyFilters() {
      const selectedCategory = filterCategory.value;
      const selectedBrand = filterBrand.value;

      const filtered = productos.filter(p => {
        const matchCategory = selectedCategory === "all" || p.Categoria === selectedCategory;
        const matchBrand = selectedBrand === "all" || p.Marca === selectedBrand;
        return matchCategory && matchBrand;
      });

      renderProducts(filtered);
    }

    filterCategory.addEventListener("change", applyFilters);
    filterBrand.addEventListener("change", applyFilters);

    // Initial render
    renderProducts(productos);
  }
});
