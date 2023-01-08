// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "@firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB6bVWFPNANJDXz_3KHdBwPut-KJdmdrFM",
    authDomain: "fir-auth-contex-tailwind.firebaseapp.com",
    projectId: "fir-auth-contex-tailwind",
    storageBucket: "fir-auth-contex-tailwind.appspot.com",
    messagingSenderId: "639276605558",
    appId: "1:639276605558:web:02233337bddee6f40dff57"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = getFirestore(app)

export default app