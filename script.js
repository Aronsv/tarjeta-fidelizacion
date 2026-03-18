// =====================================================
// 🔥 IMPORTAR FIREBASE
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// =====================================================
// ⚙️ CONFIG
// =====================================================

const firebaseConfig = {
  apiKey: "AIzaSyCcs-eMp-GQCIXO1zDiiadeLhbETcqdtn8",
  authDomain: "tarjeta-fidelizacion-563aa.firebaseapp.com",
  projectId: "tarjeta-fidelizacion-563aa",
  storageBucket: "tarjeta-fidelizacion-563aa.firebasestorage.app",
  messagingSenderId: "256189396604",
  appId: "1:256189396604:web:115c60825caf2def193bf9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// =====================================================
// 🧪 MODO PRUEBA
// =====================================================

let modoPrueba = false;

window.modoTest = function () {
  modoPrueba = true;
  alert("🧪 Modo prueba activado");
};


// =====================================================
// ✅ REGISTRAR
// =====================================================

window.registrar = async function () {

  const input = document.getElementById("usuario");
  const mensaje = document.getElementById("mensaje");
  const usuario = input.value.trim();

  if (usuario === "" || usuario.length !== 9) {
    mensaje.innerText = "⚠️ Número inválido";
    mensaje.style.color = "red";
    return;
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const mañana = new Date(hoy);
  mañana.setDate(mañana.getDate() + 1);

  try {

    const q = query(
      collection(db, "visitas"),
      where("celular", "==", usuario),
      where("fecha", ">=", hoy),
      where("fecha", "<", mañana)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty && !modoPrueba) {
      mensaje.innerText = "⚠️ Ya registraste hoy";
      mensaje.style.color = "orange";
      return;
    }

    await addDoc(collection(db, "visitas"), {
      celular: usuario,
      fecha: new Date()
    });

    mensaje.innerText = "✅ Registro guardado";
    mensaje.style.color = "green";
    input.value = "";

    // 🔥 OBTENER TOTAL
    const totalVisitas = (await getDocs(
      query(collection(db, "visitas"), where("celular", "==", usuario))
    )).size;

    // 🎉 MOSTRAR PREMIO SOLO SI > 0
    if (totalVisitas > 0 && totalVisitas % 6 === 0) {
      mostrarPremio(totalVisitas, true);
    }

  } catch (error) {
    mensaje.innerText = "❌ Error al guardar";
    mensaje.style.color = "red";
    console.error(error);
  }
};


// =====================================================
// 🔍 CONSULTAR
// =====================================================

window.consultar = async function () {

  const input = document.getElementById("usuario");
  const mensaje = document.getElementById("mensaje");
  const usuario = input.value.trim();

  if (usuario === "" || usuario.length !== 9) {
    mensaje.innerText = "⚠️ Número inválido";
    mensaje.style.color = "red";
    return;
  }

  try {

    const q = query(
      collection(db, "visitas"),
      where("celular", "==", usuario)
    );

    const querySnapshot = await getDocs(q);
    const total = querySnapshot.size;

    mensaje.innerText = `☕ Tienes ${total} visitas`;
    mensaje.style.color = "black";

    mostrarTarjeta(total);

  } catch (error) {
    mensaje.innerText = "❌ Error al consultar";
    mensaje.style.color = "red";
  }
};


// =====================================================
// 🎴 TARJETA VISUAL
// =====================================================

function mostrarPremio(total, desdeRegistro = false) {

  if (!desdeRegistro) return;

  const popup = document.getElementById("popup");
  const texto = document.getElementById("mensajePremio");

  const nivel = Math.floor(total / 6);

  if (nivel === 1) {
    texto.innerText = "☕ Tu bebida caliente va por nuestra cuenta";
  } 
  else if (nivel === 2) {
    texto.innerText = "🍰 Tu postre favorito va por nuestra cuenta";
  } 
  else {
    texto.innerText = "🍹 Tu trago favorito va por nuestra cuenta";
  }

  popup.classList.remove("oculto");
}

  contenedor.innerHTML = "";

  for (let i = 1; i <= 6; i++) {

    const div = document.createElement("div");
    div.classList.add("sello");

    if (i <= progreso) {
      div.classList.add("activo");
      div.innerHTML = `<img src="logo.png">`;
    }

    if (i === 6) {
      if (nivel === 1) div.innerHTML = "☕";
      else if (nivel === 2) div.innerHTML = "🍰";
      else div.innerHTML = "🍹";
    }

    contenedor.appendChild(div);
  }
}


// =====================================================
// 🎉 POPUP PREMIO
// =====================================================

function mostrarPremio(total, desdeRegistro = false) {

  const popup = document.getElementById("popup");
  const texto = document.getElementById("mensajePremio");

  const nivel = Math.floor(total / 6);

  if (nivel === 1) {
    texto.innerText = "☕ Tu bebida caliente va por nuestra cuenta";
  } else if (nivel === 2) {
    texto.innerText = "🍰 Tu postre favorito va por nuestra cuenta";
  } else {
    texto.innerText = "🍹 Tu trago favorito va por nuestra cuenta";
  }

  popup.classList.remove("oculto");
}


// =====================================================
// ❌ CERRAR POPUP
// =====================================================

window.cerrarPopup = function () {
  document.getElementById("popup").classList.add("oculto");
};
