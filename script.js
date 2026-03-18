// IMPORTAR FIREBASE
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
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

  const db = getFirestore();

  // 📅 obtener fecha de hoy (solo día)
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const mañana = new Date(hoy);
  mañana.setDate(mañana.getDate() + 1);

  try {
    // 🔍 buscar si ya registró hoy
    const q = query(
      collection(db, "visitas"),
      where("celular", "==", usuario),
      where("fecha", ">=", hoy),
      where("fecha", "<", mañana)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      mensaje.innerText = "⚠️ Ya registraste hoy";
      mensaje.style.color = "orange";
      return;
    }

    // ✅ guardar si no existe
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
