// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, onValue, onChildChanged, child, get, set, query, equalTo } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6v8mvsGxk83i39yj6kIFNyCTlQ3jLJso",
  authDomain: "eurovision-scorecard.firebaseapp.com",
  databaseURL: "https://eurovision-scorecard-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "eurovision-scorecard",
  storageBucket: "eurovision-scorecard.appspot.com",
  messagingSenderId: "385805945500",
  appId: "1:385805945500:web:0290733ceb86f89eeebb59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const contestData = ref(db, "/2022")

const allEntries = []
const semiFinalOneEntries = []
const semiFinalTwoEntries = []
const grandFinalEntries = []

// Check online status
const connectedRef = ref(db, ".info/connected");
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    console.warn("📶 ✅ Connected");
  } else {
    console.error("📶 ⛔️ Not connected");
  }
})

onValue(contestData, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();
    
    if (childData.semifinalone == true) {
      semiFinalOneEntries.push(childKey)
    }
    if (childData.semifinaltwo == true) {
      semiFinalTwoEntries.push(childKey)
    }
    if (childData.final == true) {
      grandFinalEntries.push(childKey)
    }
    
    
  });
  console.log("Semi Final One: " + semiFinalOneEntries);
  console.log("Semi Final Two: " + semiFinalTwoEntries);
  console.log("Grand Final: " + grandFinalEntries);
}, {
  onlyOnce: true
}); 