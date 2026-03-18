// =====================================================
// 🔥 IMPORTAR FIREBASE (CORRECTO)
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// =====================================================
// ⚙️ CONFIGURACIÓN FIREBASE
// =====================================================

const firebaseConfig = {
  apiKey: "AIzaSyCcs-eMp-GQCIXO1zDiiadeLhbETcqdtn8",
  authDomain: "tarjeta-fidelizacion-563aa.firebaseapp.com",
  projectId: "tarjeta-fidelizacion-563aa",
  storageBucket: "tarjeta-fidelizacion-563aa.firebasestorage.app",
  messagingSenderId: "256189396604",
  appId: "1:256189396604:web:115c60825caf2def193bf9"
};


// =====================================================
// 🚀 INICIALIZAR FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// =====================================================
// ✅ FUNCIÓN: REGISTRAR VISITA (CON VALIDACIÓN Y CONTROL POR DÍA)
// =====================================================

window.registrar = async function () {

  // -----------------------------
  // 📥 OBTENER DATOS DEL INPUT
  // -----------------------------
  const input = document.getElementById("usuario");
  const mensaje = document.getElementById("mensaje");
  const usuario = input.value.trim();


  // -----------------------------
  // ⚠️ VALIDACIÓN BÁSICA
  // -----------------------------
  if (usuario === "" || usuario.length !== 9) {
    mensaje.innerText = "⚠️ Número inválido";
    mensaje.style.color = "red";
    return;
  }


  // -----------------------------
  // 📅 DEFINIR RANGO DE "HOY"
  // -----------------------------
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const mañana = new Date(hoy);
  mañana.setDate(mañana.getDate() + 1);


  try {

    // -----------------------------
    // 🔍 BUSCAR SI YA REGISTRÓ HOY
    // -----------------------------
    const q = query(
      collection(db, "visitas"),
      where("celular", "==", usuario),
      where("fecha", ">=", hoy),
      where("fecha", "<", mañana)
    );

    const querySnapshot = await getDocs(q);


    // -----------------------------
    // 🚫 SI YA EXISTE → BLOQUEAR
    // -----------------------------
    if (!querySnapshot.empty) {
      mensaje.innerText = "⚠️ Ya registraste hoy";
      mensaje.style.color = "orange";
      return;
    }


    // -----------------------------
    // ✅ GUARDAR NUEVA VISITA
    // -----------------------------
    await addDoc(collection(db, "visitas"), {
      celular: usuario,
      fecha: new Date()
    });


    // -----------------------------
    // 🎉 MENSAJE DE ÉXITO
    // -----------------------------
    mensaje.innerText = "✅ Registro guardado";
    mensaje.style.color = "green";
    input.value = "";


  } catch (error) {

    // -----------------------------
    // ❌ ERROR
    // -----------------------------
    mensaje.innerText = "❌ Error al guardar";
    mensaje.style.color = "red";
    console.error(error);
  }
};


// =====================================================
// 🔍 FUNCIÓN: CONSULTAR VISITAS (SELLOS)
// =====================================================

window.consultar = async function () {

  // -----------------------------
  // 📥 OBTENER DATOS
  // -----------------------------
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
    // 🔍 BUSCAR TODAS LAS VISITAS
    // -----------------------------
    const q = query(
      collection(db, "visitas"),
      where("celular", "==", usuario)
    );

    const querySnapshot = await getDocs(q);

    const total = querySnapshot.size;


    // -----------------------------
    // ☕ MOSTRAR RESULTADO
    // -----------------------------
    mensaje.innerText = `☕ Tienes ${total} visitas`;
    mostrarTarjeta(total);
    mensaje.style.color = "black";


  } catch (error) {

    // -----------------------------
    // ❌ ERROR
    // -----------------------------
    mensaje.innerText = "❌ Error al consultar";
    mensaje.style.color = "red";
    console.error(error);
  }
function mostrarTarjeta(total) {

  const tarjeta = document.getElementById("tarjeta");
  const contenedor = document.getElementById("sellos");
  const nivelTexto = document.getElementById("nivel");
  const premioTexto = document.getElementById("premio");

  tarjeta.classList.remove("oculto");

  // -----------------------------
  // 🪜 CALCULAR NIVEL
  // -----------------------------
  const nivel = Math.floor(total / 6) + 1;
  const progreso = total % 6;

  // -----------------------------
  // 📝 TEXTO DE NIVEL
  // -----------------------------
  nivelTexto.innerText = `Nivel ${nivel}`;

  // -----------------------------
  // 🎁 PREMIOS POR NIVEL
  // -----------------------------
  if (nivel === 1) {
    premioTexto.innerText = "☕ Tu bebida caliente favorita va por nuestra cuenta";
  } else if (nivel === 2) {
    premioTexto.innerText = "🍰 Tu postre favorito va por nuestra cuenta";
  } else {
    premioTexto.innerText = "🍹 Tu trago favorito va por nuestra cuenta";
  }

  // -----------------------------
  // 🔘 DIBUJAR SELLOS
  // -----------------------------
  contenedor.innerHTML = "";

  for (let i = 1; i <= 6; i++) {

    const div = document.createElement("div");
    div.classList.add("sello");

    if (i <= progreso) {
      div.classList.add("activo");
      div.innerHTML = "☕"; // aquí luego podemos poner tu logo
    }

    // 🎯 EL SEXTO (PREMIO)
    if (i === 6) {
      div.innerHTML = "🎁";
    }

    contenedor.appendChild(div);
  }
}
};
