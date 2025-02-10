// Importando as funções necessárias
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase, ref, set } from "firebase/database"; // Corrigido: Agora importa 'ref' e 'set'

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCdJM_Eimwhgy1BNd5SDFTseQhbH4tIS7Q",
  authDomain: "albioncd-e2f3b.firebaseapp.com",
  projectId: "albioncd-e2f3b",
  storageBucket: "albioncd-e2f3b.firebasestorage.app",
  messagingSenderId: "1068825253839",
  appId: "1:1068825253839:web:cd9eb51155be7e86b2e4ba",
  measurementId: "G-RLL7P1ESP2"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Inicializando Analytics apenas no cliente
let analytics;
if (typeof window !== "undefined" && isSupported()) {
  analytics = getAnalytics(app);
}

// Inicializando o Realtime Database
export const db = getDatabase(app); // Corrigido: exportando 'db' corretamente

export { app, analytics }; // Exportando as instâncias do Firebase e do Analytics
