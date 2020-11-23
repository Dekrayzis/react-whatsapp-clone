import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyB6HSQa5tVa1icMHV0Sa_ZKhb9XcbGj4uY",
  authDomain: "whatsapp-clone-2f606.firebaseapp.com",
  databaseURL: "https://whatsapp-clone-2f606.firebaseio.com",
  projectId: "whatsapp-clone-2f606",
  storageBucket: "whatsapp-clone-2f606.appspot.com",
  messagingSenderId: "943826338301",
  appId: "1:943826338301:web:ca7ebb9f64835e10909994",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
