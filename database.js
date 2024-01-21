import { account } from './ethereum.js';

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, signInAnonymously, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, onValue, update, onChildAdded, onChildChanged, onChildRemoved, remove, serverTimestamp, child, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2O7amA_4VmSJYp35Z4gdRWynCxsU7bdI",
    authDomain: "nft-minter-b1d93.firebaseapp.com",
    databaseURL: "https://nft-minter-b1d93-default-rtdb.firebaseio.com/",
    projectId: "nft-minter-b1d93",
    storageBucket: "nft-minter-b1d93.appspot.com",
    messagingSenderId: "555118278934",
    appId: "1:555118278934:web:de6135c606abfc70bc3837"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics();
const auth = getAuth();
const db = getDatabase();

export let contract_address;
export let nfts_api_key;

signUserOut();
// At start sign user out in case he was signed in before
function signUserOut() {
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
}

// Sign in user with email address (ethereum account + "@email.com") and password
export function startAuthenticationWithEmailAndPassword() {
    signInWithEmailAndPassword(auth, account + "@email.com", document.getElementById('passwordInput').value)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
            console.log("Signed in with email and password");
            console.log("User has uid: " + user.uid);
            getData();
            setUpView();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            document.getElementById('authLog').style.color = "red";
            document.getElementById('authLog').style.mixBlendMode = "normal";
            document.getElementById('authLog').textContent = "Wrong password or account not whitelisted 🥲";
        });
}

// Get data from database
function getData() {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `data_for_auth_users`)).then((snapshot) => {
        if (snapshot.exists()) {
            // console.log(snapshot.val());            
            contract_address = snapshot.val().contract_address;
            nfts_api_key = snapshot.val().nfts_api_key;
        }
        else {
            console.log("data_for_auth_users does NOT exist");
        }
    }).catch((error) => {
        console.error(error);
    });
}

// Show main table
function setUpView() {
    document.getElementById('title-table').style.display = "none";
    document.getElementById('network-table').style.display = "none";
    document.getElementById('br-after-network-table').style.display = "none";
    document.getElementById('login-table').style.display = "none";
    document.getElementById('main-table').style.display = "table";
}