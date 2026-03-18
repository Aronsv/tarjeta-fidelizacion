// IMPORTAR FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCcs-eMp-GQCIXO1zDiiadeLhbETcqdtn8",
  authDomain: "tarjeta-fidelizacion-563aa.firebaseapp.com",
  projectId: "tarjeta-fidelizacion-563aa",
  storageBucket: "tarjeta-fidelizacion-563aa.firebasestorage.app",
  messagingSenderId: "256189396604",
  appId: "1:256189396604:web:115c60825caf2def193bf9"
};

// INICIALIZAR
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// FUNCIÓN REGISTRAR
window.registrar = async function () {
  const input = document.getElementById("usuario");
  const mensaje = document.getElementById("mensaje");
  const usuario = input.value.trim();

  if (usuario === "" || usuario.length !== 9) {
    mensaje.innerText = "⚠️ Número inválido";
    mensaje.style.color = "red";
    return;
  }

  try {
    await addDoc(collection(db, "visitas"), {
      celular: usuario,
      fecha: new Date()
    });

    mensaje.innerText = "✅ Registro guardado";
    mensaje.style.color = "green";
    input.value = "";

  } catch (error) {
    mensaje.innerText = "❌ Error al guardar";
    mensaje.style.color = "red";
    console.error(error);
  }
};
