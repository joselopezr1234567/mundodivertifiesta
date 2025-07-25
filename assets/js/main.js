// Crear globos aleatorios que suben
function crearGlobo() {
  const globo = document.createElement("div");
  globo.classList.add("globo");

  // Posición y color aleatorio
  globo.style.left = `${Math.random() * 100}%`;
  globo.style.background = `radial-gradient(circle, ${colorAleatorio()}, ${colorAleatorio()})`;
  globo.style.animationDuration = `${5 + Math.random() * 2}s`;

  document.getElementById("fondo-globos").appendChild(globo);

  // Eliminar después de 10 segundos
  setTimeout(() => globo.remove(), 10000);
}

// Colores variados para globos
function colorAleatorio() {
  const colores = ["#ff6699", "#ffcc00", "#66ccff", "#99ff99", "#cc66ff"];
  return colores[Math.floor(Math.random() * colores.length)];
}

// Crear globos cada 500ms
setInterval(crearGlobo, 350);
