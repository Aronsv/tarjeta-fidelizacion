// =====================================================
// 🔥 FIREBASE
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
  getFirestore, 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  addDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// CONFIG
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
// 📋 CARGAR SOLICITUDES
// =====================================================

async function cargarSolicitudes() {

  const contenedor = document.getElementById("lista");
  contenedor.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "solicitudes"));

  querySnapshot.forEach((docSnap) => {

    const data = docSnap.data();

    const div = document.createElement("div");
    div.style.margin = "10px";
    div.style.padding = "10px";
    div.style.border = "1px solid #ccc";

    div.innerHTML = `
      <strong>📱 ${data.celular}</strong><br><br>
      <button onclick="aprobar('${docSnap.id}', '${data.celular}')">✅ Aprobar</button>
      <button onclick="rechazar('${docSnap.id}')">❌ Rechazar</button>
    `;

    contenedor.appendChild(div);
  });
}


// =====================================================
// ✅ APROBAR
// =====================================================

window.aprobar = async function (id, celular) {

  try {

    // 👉 guardar en visitas
    await addDoc(collection(db, "visitas"), {
      celular: celular,
      fecha: new Date()
    });

    // 👉 eliminar solicitud
    await deleteDoc(doc(db, "solicitudes", id));

    alert("✅ Aprobado");

    cargarSolicitudes();

  } catch (error) {
    console.error(error);
  }
};


// =====================================================
// ❌ RECHAZAR
// =====================================================

window.rechazar = async function (id) {

  try {
    await deleteDoc(doc(db, "solicitudes", id));

    alert("❌ Rechazado");

    cargarSolicitudes();

  } catch (error) {
    console.error(error);
  }
};


// =====================================================
// 🚀 INICIAR
// =====================================================

cargarSolicitudes();