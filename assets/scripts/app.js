---
---
//////////////////////////////
// Other UI related scripts //
//////////////////////////////

var buttonSidebarToggle = document.getElementById("toggle-menu");
buttonSidebarToggle.addEventListener("click", toggleSidebar);

var fullscreenToggle = document.getElementById("toggle-fullscreen");
// fullscreenToggle.addEventListener("click", openFullScreen, appWindow);

function toggleSidebar() {

  let app = document.getElementById("app")
	if (app.dataset.sidebar == "show") {
		app.dataset.sidebar = "hide";
    // openFullscreen(app);
	} else {
		app.dataset.sidebar = "show";
    // closeFullscreen(app);
	}

}

function closeMessage() {
  let app = document.getElementById("app")
  app.dataset.message = "hide";
}

function openMessage(title, body, show) {
  let app = document.getElementById("app")
  let messageTitle = document.getElementById("app-message--title");
  let messageBody = document.getElementById("app-message--body");
  
  messageTitle.innerText = title;
  messageBody.innerText = body;
  
  if (show != false) {
    app.dataset.message = "show";
  }
}

/* View in fullscreen */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
	 elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
	 elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
	 elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen(elem) {
  if (document.exitFullscreen) {
	 document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
	 document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
	 document.msExitFullscreen();
  }
}







//////////////////////////////
// Firebase related scripts //
//////////////////////////////

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
const contestData = database.ref("/2022")
const settingsData = database.ref("/Settings")
const notificationData = database.ref("/Notification")

const allEntries = [{% for entry in site.data.entries %}"{{ entry.shortcode }}"{% unless forloop.last %},{% endunless %}{% endfor %}]
const semiFinalOneEntries = [{% for entry in site.data.entries %}{% if entry.semifinalone == true %}"{{ entry.shortcode }}",{% endif %}{% endfor %}]
const semiFinalTwoEntries = [{% for entry in site.data.entries %}{% if entry.semifinaltwo == true %}"{{ entry.shortcode }}",{% endif %}{% endfor %}]
const grandFinalEntries = [{% for entry in site.data.entries %}{% if entry.final == true %}"{{ entry.shortcode }}",{% endif %}{% endfor %}]

function checkNotificationData() {
  notificationData.on('value', (snapshot) => {

      // Check to see notification contents
      var messageShow = snapshot.val().show;
      var messageTitle = snapshot.val().title;
      var messageBody = snapshot.val().body;
      
      openMessage(messageTitle, messageBody, messageShow);
      
  });
}



function countryDataListener(event, entries, toggle) {
  
	for (i = 0; i < entries.length; i++) {
    
		let entry = entries[i];
		let entryData = database.ref('/2022/' + entry);
    
		let entryElement = document.getElementById("scorecard-" + entry);
		let entryVotes = document.getElementById("scorecard-" + entry + "-score");
		let entryPosition = document.getElementById("scorecard-" + entry + "-position");
    
    if (toggle == "start") {
		  entryData.on('value', (snapshot) => {
        
        var countryName = snapshot.val().country;
        var countryShortcode = snapshot.val().shortcode;
  
        // Check to see which events the country is part of
        var isSemiFinalOne = snapshot.val().semifinalone;
        var isSemiFinalTwo = snapshot.val().semifinaltwo;
        var isFinal = snapshot.val().final;
        
			  var semiFinalVotes = snapshot.val().semifinalvotes;
			  var finalVotes = snapshot.val().finalvotes;
        
			  var semiFinalRunningOrder = snapshot.val().semifinalrunningorder;
			  var finalRunningOrder = snapshot.val().finalrunningorder;
        
			  var semiFinalVoting = snapshot.val().semifinalvoting;
			  var finalVoting = snapshot.val().finalvoting;
        
        var entryScorecard = document.getElementById('scorecard-' + countryShortcode);
        
        if (event == "semifinal") {
          entryScorecard.dataset.runningorder = semiFinalRunningOrder;
          entryScorecard.dataset.voting = semiFinalVoting;
          entryScorecard.dataset.votes = semiFinalVotes;
        } else {
          entryScorecard.dataset.runningorder = finalRunningOrder;
          entryScorecard.dataset.voting = finalVoting;
          entryScorecard.dataset.votes = finalVotes;
        }
          
		    displayElementData(entryScorecard.dataset.votes, entryVotes);
		    displayElementData("#" + entryScorecard.dataset.runningorder, entryPosition);
        
        
        // console.log(countryName, countryShortcode, isSemiFinalOne, isSemiFinalTwo, isFinal, semiFinalVotes, finalVotes, semiFinalVoting, finalVoting);
        
		  })
    } else {
      entryData.off('value')
    }

	};

}

function displayElementData(from, to) {
	to.innerText = from;
}











////////////
// Router //
////////////

const routes = {
    404: {
        template: "/templates/404.html",
        title: "404",
        description: "Page not found",
    },
    "/": {
        template: "/templates/home.html",
        title: "Home",
        description: "This is the home page",
        button: "button-home",
    },
    home: {
        template: "/templates/home.html",
        title: "Home",
        description: "This is the home page",
        button: "button-home",
    },
    "semi-final-one": {
        template: "/templates/semi-final-one.html",
        title: "Semi-final 1",
        description: "This is the scores page",
        button: "button-semi-final-one",
    },
    "semi-final-two": {
        template: "/templates/semi-final-two.html",
        title: "Semi-final 2",
        description: "This is the scores page",
        button: "button-semi-final-two",
    },
    "grand-final": {
        template: "/templates/grand-final.html",
        title: "Grand final",
        description: "This is the scores page",
        button: "button-grand-final",
    },
    about: {
        template: "/templates/about.html",
        title: "About this app",
        description: "This is the about page",
        button: "button-about",
    },
    "upcoming-shows": {
        template: "/templates/upcoming-shows.html",
        title: "Upcoming shows",
        description: "This is the upcoming shows page",
        button: "button-upcoming-shows",
    },
};

const locationHandler = async () => {
  
    console.clear();
    
    // get the url path, replace hash with empty string
    var location = window.location.hash.replace("#", "");
    // if the path length is 0, set it to primary page route
    if (location.length == 0) {
        location = "/";
    }
    // get the route object from the routes object
    const route = routes[location] || routes["404"];
    
    // get the html from the template
    const html = await fetch(route.template).then((response) => response.text());
    // set the content of the content div to the html
    document.getElementById("app-panel").innerHTML = html;
    // set the title of the document to the title of the route
    document.title = route.title;
    // set the button in the menu
  	var menu = document.getElementById("sidebar-navigation-buttons");
  	var buttons = document.getElementsByClassName("menu-item--button");
  
  	for (var i = 0; i < buttons.length; i++) {
  		buttons[i].dataset.status = "false";
  	}
    document.getElementById(route.button).dataset.status = "active";
    // set the description of the document to the description of the route
    document
        .querySelector('meta[name="description"]')
        .setAttribute("content", route.description);
    
    // Reset the country listener
    countryDataListener(allEntries, "stop");
    
    // Attach listener for current page
    if (location == "semi-final-one") {
      countryDataListener("semifinal", semiFinalOneEntries, "start");
    } else if (location == "semi-final-two") {
      countryDataListener("semifinal", semiFinalTwoEntries, "start");
    } else if (location == "grand-final") {
      countryDataListener("final", grandFinalEntries, "start");
    }
};

// create a function that watches the hash and calls the urlLocationHandler
window.addEventListener("hashchange", locationHandler);
window.onload = function() {
  
  presence.on("value", (snap) => {
    if (snap.val() === true) {
	    console.info("📶 ✅ Connected");   
    } else {
	    console.warn("📶 ⛔️ Not connected");
    }
    checkNotificationData();
  });
  
}
// call the urlLocationHandler to load the page
locationHandler();