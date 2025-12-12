// Lógica principal de la aplicación

document.addEventListener('DOMContentLoaded', () => {
  // Detectar en qué página estamos
  const path = window.location.pathname;

  if (path.includes('comic.html')) {
    initReader();
  } else {
    initGallery();
  }
});

// --- Funciones para la Galería (index.html) ---
function initGallery() {
  const galleryContainer = document.getElementById('gallery-container');
  if (!galleryContainer) return;

  // Limpiar contenedor
  galleryContainer.innerHTML = '';

  // Generar tarjetas
  comicsData.forEach(comic => {
    const card = document.createElement('a');
    card.className = 'comic-card';
    card.href = `comic.html?id=${comic.id}`;

    const img = document.createElement('img');
    img.src = comic.cover;
    img.alt = comic.title;
    img.className = 'card-image';
    img.onerror = function () {
      this.src = 'https://placehold.co/300x200?text=Imagen+No+Encontrada';
    };

    card.innerHTML = `
      <div class="card-content">
        <h3 class="card-title">${comic.title}</h3>
        <p class="card-desc">${comic.description}</p>
      </div>
    `;

    // Insert image at the beginning
    card.insertBefore(img, card.firstChild);

    galleryContainer.appendChild(card);
  });
}

// --- Funciones para el Lector (comic.html) ---
function initReader() {
  // Obtener ID de la URL
  const params = new URLSearchParams(window.location.search);
  const comicId = parseInt(params.get('id'));

  // Buscar el cómic
  const comic = comicsData.find(c => c.id === comicId);

  if (!comic) {
    alert('Historieta no encontrada');
    window.location.href = 'index.html';
    return;
  }

  // Elementos del DOM
  const titleEl = document.getElementById('comic-title');
  const imageEl = document.getElementById('comic-image');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageIndicator = document.getElementById('page-indicator');

  // Estado actual
  let currentPageIndex = 0;

  // Configurar título
  titleEl.textContent = comic.title;

  // Función para actualizar la vista
  function updateView() {
    // Actualizar imagen
    imageEl.src = comic.pages[currentPageIndex];
    imageEl.onerror = function () {
      this.src = 'https://placehold.co/800x600?text=Pagina+No+Encontrada';
    };
    imageEl.alt = `Página ${currentPageIndex + 1}`;

    // Actualizar texto de paginación
    pageIndicator.textContent = `Página ${currentPageIndex + 1} de ${comic.pages.length}`;

    // Actualizar estado de botones
    prevBtn.disabled = currentPageIndex === 0;
    nextBtn.disabled = currentPageIndex === comic.pages.length - 1;

    // Cambiar texto del botón siguiente si es la última página
    if (currentPageIndex === comic.pages.length - 1) {
      nextBtn.innerHTML = 'Finalizar <span>🏁</span>';
    } else {
      nextBtn.innerHTML = 'Siguiente <span>➡️</span>';
    }
  }

  // Event Listeners
  prevBtn.addEventListener('click', () => {
    if (currentPageIndex > 0) {
      currentPageIndex--;
      updateView();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPageIndex < comic.pages.length - 1) {
      currentPageIndex++;
      updateView();
    } else {
      // Acción al finalizar (volver al inicio)
      if (confirm('¡Felicidades! Has terminado la lectura. ¿Volver al inicio?')) {
        window.location.href = 'index.html';
      }
    }
  });

  // Inicializar vista
  updateView();
}
