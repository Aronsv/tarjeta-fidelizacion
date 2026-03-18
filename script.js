function registrar() {
  const input = document.getElementById("usuario");
  const mensaje = document.getElementById("mensaje");
  const usuario = input.value.trim();

  // Validar vacío
  if (usuario === "") {
    mensaje.innerText = "⚠️ Ingresa tu número de celular";
    mensaje.style.color = "red";
    return;
  }

  // Validar solo números
  if (!/^\d+$/.test(usuario)) {
    mensaje.innerText = "⚠️ Solo se permiten números";
    mensaje.style.color = "red";
    return;
  }

  // Validar 9 dígitos
  if (usuario.length !== 9) {
    mensaje.innerText = "⚠️ El número debe tener 9 dígitos";
    mensaje.style.color = "red";
    return;
  }

  // Si todo está bien
  mensaje.innerText = "✅ Registro enviado correctamente";
  mensaje.style.color = "green";

  input.value = "";
}
