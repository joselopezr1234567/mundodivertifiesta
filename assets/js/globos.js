const container = document.getElementById("container");

function crearGlobo() {
  const globo = document.createElement("div");
  globo.classList.add("globo");

  // Posición y color aleatorio
  const left = Math.random() * 100;
  const duracion = 5 + Math.random() * 5;
  const colores = ["red", "blue", "green", "yellow", "pink", "purple", "orange"];

  globo.style.left = `${left}vw`;
  globo.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
  globo.style.animationDuration = `${duracion}s`;

  container.appendChild(globo);

  // Eliminar globo al terminar animación
  setTimeout(() => {
    globo.remove();
  }, duracion * 1000);
}

// Crear globos cada 500 ms
setInterval(crearGlobo, 500);
