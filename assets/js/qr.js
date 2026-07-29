// Reemplaza este número con el tuyo (incluye el código de país, sin "+" ni espacios)
const numeroWhatsApp = "56945099183"; // Ejemplo para Chile: +56 9 9450 99183
const mensaje = "Hola, quiero más información sobre los juegos inflables";

// URL de WhatsApp
const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

// Generar QR
new QRCode(document.getElementById("qrcode"), {
  text: urlWhatsApp,
  width: 100,
  height: 100,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H
});
