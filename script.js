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

    const totalVisitas = (await getDocs(
      query(collection(db, "visitas"), where("celular", "==", usuario))
    )).size;

    if (totalVisitas > 0 && totalVisitas % 6 === 0) {
      mostrarPremio(totalVisitas);
    }

  } catch (error) {
    mensaje.innerText = "❌ Error al guardar";
    mensaje.style.color = "red";
  }
};

// =====================================================
// 📩 SOLICITAR SELLO (FASE 1)
// =====================================================

window.solicitar = async function () {

  const input = document.getElementById("usuario");
  const mensaje = document.getElementById("mensaje");
  const usuario = input.value.trim();

  // -----------------------------
  // ⚠️ VALIDACIÓN
  // -----------------------------
  if (usuario === "" || usuario.length !== 9) {
    mensaje.innerText = "⚠️ Número inválido";
    mensaje.style.color = "red";
    return;
  }

  try {

    // -----------------------------
    // 📅 FECHA ACTUAL
    // -----------------------------
    const ahora = new Date();

    // -----------------------------
    // 🔍 EVITAR DUPLICADOS PENDIENTES
    // -----------------------------
    const q = query(
      collection(db, "solicitudes"),
      where("celular", "==", usuario)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      mensaje.innerText = "⏳ Ya tienes una solicitud pendiente";
      mensaje.style.color = "orange";
      return;
    }

    // -----------------------------
    // ✅ GUARDAR SOLICITUD
    // -----------------------------
    await addDoc(collection(db, "solicitudes"), {
      celular: usuario,
      fecha: ahora,
      estado: "pendiente"
    });

    mensaje.innerText = "✅ Solicitud enviada";
    mensaje.style.color = "green";
    input.value = "";

  } catch (error) {
    mensaje.innerText = "❌ Error al enviar solicitud";
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
  }
};


// =====================================================
// 🎴 TARJETA
// =====================================================

// =====================================================
// 🎴 TARJETA
// =====================================================

function mostrarTarjeta(total) {

  const tarjeta = document.getElementById("tarjeta");
  const contenedor = document.getElementById("sellos");
  const nivelTexto = document.getElementById("nivel");
  const premioTexto = document.getElementById("premio");

  tarjeta.classList.remove("oculto");

  const nivel = Math.floor((total - 1) / 6) + 1;
  const progreso = total % 6 === 0 ? 6 : total % 6;

  nivelTexto.innerText = `Nivel ${nivel}`;

  if (nivel === 1) {
    premioTexto.innerText = "☕ Tu bebida caliente favorita va por nuestra cuenta";
  } else if (nivel === 2) {
    premioTexto.innerText = "🍰 Tu postre favorito va por nuestra cuenta";
  } else {
    premioTexto.innerText = "🍹 Tu trago favorito va por nuestra cuenta";
  }

  // 🔥 LIMPIAR CONTENEDOR
  contenedor.innerHTML = "";

  // 🔥 CREAR LOS 6 SELLOS
  for (let i = 1; i <= 6; i++) {

    const div = document.createElement("div");
    div.classList.add("sello");

    // 💓 PULSO SI VA 5/6
    if (progreso === 5 && i === 6) {
      div.classList.add("pulso");
    }

    // ✅ SELLOS ACTIVOS
    if (i <= progreso) {
      div.classList.add("activo");

      // 🔘 SEXTO SELLO (PREMIO)
      if (i === 6) {

        if (nivel === 1) div.innerHTML = "☕";
        else if (nivel === 2) div.innerHTML = "🍰";
        else div.innerHTML = "🍹";

        // 🎯 REBOTE SOLO CUANDO SE COMPLETA
        if (progreso === 6) {
          div.classList.add("rebote");
        }

      } else {
        div.innerHTML = `<img src="logo.png">`;
      }
    }

    contenedor.appendChild(div);
  }
}


// =====================================================
// 🎉 POPUP
// =====================================================

function mostrarPremio(total) {

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

  popup.classList.add("mostrar");

  // 🎉 LANZAR CONFETTI
  lanzarConfetti();
  // 🔘 ACTIVAR REBOTE DEL SELLO 6 (SI ESTÁ VISIBLE)
}


// =====================================================
// ❌ CERRAR
// =====================================================

window.cerrarPopup = function () {
  const popup = document.getElementById("popup");
  popup.classList.remove("mostrar");
};
// =====================================================
// 🎉 CONFETTI
// =====================================================

function lanzarConfetti() {

  for (let i = 0; i < 40; i++) {

    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    // posición horizontal aleatoria
    confetti.style.left = Math.random() * 100 + "vw";

    // colores aleatorios
    const colores = ["#f1c40f", "#e74c3c", "#3498db", "#2ecc71"];
    confetti.style.background = colores[Math.floor(Math.random() * colores.length)];

    document.body.appendChild(confetti);

    // eliminar después de animación
    setTimeout(() => confetti.remove(), 2000);
  }
}
