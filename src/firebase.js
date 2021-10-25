// import firebase from "firebase/app";
// import "firebase/firestore";
// import "firebase/auth";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const app = firebase.initializeApp({
  apiKey: "AIzaSyAEXZ8TqNdxhtBI_C_qoZ8t27dw4irTjwg",
  authDomain: "stocks-portfolio-cd3fd.firebaseapp.com",
  projectId: "stocks-portfolio-cd3fd",
  storageBucket: "stocks-portfolio-cd3fd.appspot.com",
  messagingSenderId: "538385144983",
  appId: "1:538385144983:web:8432d8ec463e272d329dd2",
});

export const auth = app.auth();
export const db = firebase.firestore();
export default firebase;
