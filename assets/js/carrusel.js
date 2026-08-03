// Definimos las imágenes de cada carrusel usando una clave asociada al atributo data-carrusel
const carruseles = {
  arco: [
    "assets/img/toboganarco.jpeg",
    "assets/img/toboganarco1.jpeg"
  ],
  megaresfalin: [
    "assets/img/megaresfalin.jpeg",
    "assets/img/megaresfalin1.jpeg",
    "assets/img/megaresfalin2.jpeg"

    
  ],
  hockey: [
    "assets/img/hockey.jpeg",


  ],
  arcade: [
    "assets/img/arcade.jpeg",

  ],
  cama: [
    "assets/img/cama.jpeg",
    "assets/img/cama1.jpeg"
  ],
  candybar: [
    "assets/img/candybar.jpeg",
    "assets/img/candybar1.jpeg"

  ],
  cas: [
    "assets/img/castillo.jpeg",
    "assets/img/castillo2.jpeg"
  ],
  
  casmediano: [
    "assets/img/casmediano.jpeg",
    "assets/img/casmediano1.jpeg"
  ],
  caspremium: [
    "assets/img/caspremium.jpeg",
    "assets/img/caspremium1.jpeg"
  ],
  toboganacutico: [
    "assets/img/toboganacuetico.jpeg",
    "assets/img/toboganacuatico1.jpeg"
  ],
  toboganmediano: [
    "assets/img/toboganmediano.jpeg"
    
  ],

  taca: [
    "assets/img/taca.jpeg"
    
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
