function registrar() {
  const usuario = document.getElementById("usuario").value;

  if (!usuario) {
    alert("Ingresa tu dato");
    return;
  }

  document.getElementById("mensaje").innerText = "Registro enviado ✔";
}