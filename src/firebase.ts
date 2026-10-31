import { initializeApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyByeZr4FCZrWGgtXO3kliGMuvQo7qaaxbc",
  authDomain: "pferderennen-59e01.firebaseapp.com",
  databaseURL:
    "https://pferderennen-59e01-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pferderennen-59e01",
  storageBucket: "pferderennen-59e01.firebasestorage.app",
  messagingSenderId: "650087101309",
  appId: "1:650087101309:web:b40079f315647425169214",
};

export const isFirebaseConfigured = firebaseConfig.databaseURL !== "";

const database = isFirebaseConfigured
  ? getDatabase(initializeApp(firebaseConfig))
  : null;

export function getDb(): Database {
  if (!database) throw new Error("Firebase is not configured.");
  return database;
}
