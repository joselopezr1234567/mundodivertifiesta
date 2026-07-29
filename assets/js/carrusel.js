// Definimos las imágenes de cada carrusel usando una clave asociada al atributo data-carrusel
const carruseles = {
  arco: [
    "assets/img/toboganarco.jpeg",
    "assets/img/logo.jpeg"
  ],
  megaresbalin: [
    "assets/img/logo.jpeg",
    "assets/img/toboganarco.jpeg"
  ],
  // Agrega más carruseles aquí con su clave y array de imágenes
};

// Objeto para guardar el índice actual de cada carrusel
const indices = {};

// Inicializamos cada carrusel
document.querySelectorAll('img[data-carrusel]').forEach((img) => {
  const nombre = img.getAttribute('data-carrusel');
  if (carruseles[nombre]) {
    indices[nombre] = 0;
    img.src = carruseles[nombre][0];
  }
});

// Evento para los botones
document.querySelectorAll('button[data-carrusel]').forEach((boton) => {
  boton.addEventListener('click', () => {
    const nombre = boton.getAttribute('data-carrusel');
    const direccion = boton.classList.contains('izquierda') ? -1 : 1;

    if (carruseles[nombre]) {
      indices[nombre] = (indices[nombre] + direccion + carruseles[nombre].length) % carruseles[nombre].length;

      // Cambiar imagen
      const imagen = document.querySelector(`img[data-carrusel="${nombre}"]`);
      if (imagen) {
        imagen.src = carruseles[nombre][indices[nombre]];
      }
    }
  });
});
