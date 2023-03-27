// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxjfqboIG-SDh4EdaRC3lbR8MbbnKpPsI",
    authDomain: "exotic-vehicle-marketplace-app.firebaseapp.com",
    projectId: "exotic-vehicle-marketplace-app",
    storageBucket: "exotic-vehicle-marketplace-app.appspot.com",
    messagingSenderId: "589724064517",
    appId: "1:589724064517:web:ad26f752d7da55a4fb756c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);