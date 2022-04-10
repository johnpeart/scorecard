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

// Initialise Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var presence = database.ref(".info/connected");
const contestData = ref(db, "/2022")
const settingsData = ref(db, "/Settings")
const notificationData = ref(db, "/Notification")

const allEntries = []
const semiFinalOneEntries = []
const semiFinalTwoEntries = []
const grandFinalEntries = []

window.onload = function() {

	presence.on("value", (snap) => {
		if (snap.val() === true) {
			console.warn("📶 ✅ Connected");
		} else {
			console.error("📶 ⛔️ Not connected");
		}
	});

}