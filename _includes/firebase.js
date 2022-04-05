// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, onValue, onChildChanged, child, get, set } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
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

// Check online status
const connectedRef = ref(db, ".info/connected");
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    console.info("📶 ✅ Connected");
  } else {
    console.warn("📶 ⛔️ Not connected");
  }
})

const contestData = ref(db, "2022/")
const entriesSemiFinal1 = [{% for entry in site.data.2022 %}{% if entry.semifinalone == "true" %}"{{ entry.code }}",{% endif %}{% endfor %}]
const entriesSemiFinal2 = [{% for entry in site.data.2022 %}{% if entry.semifinaltwo == "true" %}"{{ entry.code }}",{% endif %}{% endfor %}]
const entriesGrandFinal = [{% for entry in site.data.2022 %}{% if entry.final == "true" %}"{{ entry.code }}",{% endif %}{% endfor %}];

// Checks for any changes to data
onChildChanged(contestData, (data) => {
  console.log(data.key, data.val().country, data.val().shortcode);
});

// onValue(contestData, (snapshot) => {
//   const entries = snapshot.val();
//   console.group("Data")
//   for (const entry in entries) {
//     console.group(entry);
//     for (const entryData in entry) {
//       console.log(entryData)
//     }
//     console.groupEnd()
//   }
//   console.groupEnd()
// });