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
    app.dataset.fullscreen = "true";
    openFullscreen(app);
	} else {
		app.dataset.sidebar = "show";
    app.dataset.fullscreen = "false";
    closeFullscreen(app);
	}

}

function closeMessage() {
  let app = document.getElementById("app")
  app.dataset.message = "false";
}

function openMessage(title, body) {
  let app = document.getElementById("app")
  let messageTitle = document.getElementById("app-message--title");
  let messageBody = document.getElementById("app-message--body");
  
  messageTitle.innerText = title;
  messageBody.innerText = body;
  
  if (app.dataset.message != 'false') {
    
  setDataAttribute(app, "message", "true")
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




function displayElementData(from, to) {
	to.innerText = from;
}

function setDataAttribute(el, attr, value) {
	el.setAttribute('data-' + attr, value);
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

function setCurrentEvent(event) {
  settingsData.update({
    currentevent: event
  });
}

function setNowPlaying(shortcode) {
  settingsData.update({
    currentsong: shortcode
  });
}

function setNotificationContent() {
  let title = document.getElementById("input--message-title").value;
  let body = document.getElementById("input--message-body").value;
  
  notificationData.update({
    title: title,
    body: body
  });
}

function checkNotificationData() {
  notificationData.on('value', (snapshot) => {

      let app = document.getElementById("app")
      app.dataset.message = "true";

      // Check to see notification contents
      var messageTitle = snapshot.val().title;
      var messageBody = snapshot.val().body;
      
      openMessage(messageTitle, messageBody);
      
  });
}

function checkCurrentEvent() {
  settingsData.get().then((snapshot) => {
    if (snapshot.exists()) {
      // Check current event in firebase
      var currentevent = snapshot.val().currentevent;
      app.dataset.currentevent = currentevent;
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}

function checkNowPerforming() {
  settingsData.on('value', (snapshot) => {
      let app = document.getElementById("app");      
      let nowPlayingCountry = document.getElementById("now-performing--country");
      let nowPlayingArtistSong = document.getElementById("now-performing--artist-song");
      
      // Check current song in firebase
      var currentsong = snapshot.val().currentsong;
      app.dataset.currentsong = currentsong;
      
      let currentSong = database.ref('/2022/' + currentsong);
      
      currentSong.get().then((snapshot) => {
        if (snapshot.exists()) {
          
          var country = snapshot.val().country;
          var shortcode = snapshot.val().shortcode;
          var artist = snapshot.val().artist;
          var song = snapshot.val().song;
          var emoji = snapshot.val().emoji;
          
          // Get the artist and song
          setDataAttribute(app, "nowperforming", shortcode);
          setDataAttribute(app, "artist", artist);
          setDataAttribute(app, "song", song);
          displayElementData(song + " by " + artist, nowPlayingArtistSong);
          
          // Get the country and emoji
          setDataAttribute(app, "country", country);
          setDataAttribute(app, "emoji", emoji);displayElementData(country + " " + emoji, nowPlayingCountry);
          
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
      
  });
}

function countryDataListener(entries, toggle) {
  
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
			  var semiFinalVoters = snapshot.val().semifinalvoters;
			  var finalVotes = snapshot.val().finalvotes;
			  var finalVoters = snapshot.val().finalvoters;
        
			  var semiFinalRunningOrder = snapshot.val().semifinalrunningorder;
			  var finalRunningOrder = snapshot.val().finalrunningorder;
        
			  var semiFinalVoting = snapshot.val().semifinalvoting;
			  var finalVoting = snapshot.val().finalvoting;
        
        var entryScorecard = document.getElementById('scorecard-' + countryShortcode);
        
        if (isSemiFinalOne == true || isSemiFinalTwo == true) {
          entryScorecard.dataset.runningorder = semiFinalRunningOrder;
          entryScorecard.dataset.votes = semiFinalVotes;
          entryScorecard.dataset.voters = semiFinalVoters;
          
          var points = averagePoints(semiFinalVotes, semiFinalVoters);
          
        } else {
          entryScorecard.dataset.runningorder = finalRunningOrder;
          entryScorecard.dataset.votes = finalVotes;
          entryScorecard.dataset.voters = finalVoters;
          
          var points = averagePoints(finalVotes, finalVoters);
        }
          
		    displayElementData(points, entryVotes);
		    displayElementData("#" + entryScorecard.dataset.runningorder, entryPosition);
        
		  })
    } else {
      entryData.off('value')
    }

	};

}

function averagePoints(votes, voters) {
  var avg = votes / voters;
  var avg = Math.round(avg);
  
  if (avg == 11) {
    avg = 12;
  } else if (avg == 9) {
    avg = 10;
  }
  
  return avg;
}

// When this call is triggered, it will update the score for the country,
// in a given event or create it if it doesn't exist
function vote(vote) {
  
  let app = document.getElementById("app");
  let currentevent = app.dataset.currentevent;
  let shortcode = app.dataset.nowperforming;
  
	// Get the current score for the country
	let entryData = database.ref('/2022/' + shortcode);
	let points = parseInt(vote);

	entryData.transaction(
		function(data) {
			if (data) {
        if (currentevent == "sf1" || currentevent == "sf2") {
				  var currentVotes = data.semifinalvotes;
				  var currentVoters = data.semifinalvoters;
				  data['semifinalvotes'] = currentVotes + points;
				  data['semifinalvoters'] = currentVoters + 1;
        }
        if (currentevent == "final") {
				  var currentVotes = data.finalvotes;
				  var currentVoters = data.finalvoters;
				  data['finalvotes'] = currentVotes + points;
				  data['finalvoters'] = currentVoters + 1;
        }
			}
			return data;
		},
		function(error, committed, snapshot) {
			if (error) {
				console.log('Transaction failed abnormally!', error);
				alert("You can't vote whilst the event isn't taking place.")
			} else if (!committed) {
				console.log('Your vote wasn’t counted. Sorry.');
			} else {
				console.log('You gave ' + points + ' points to ' + shortcode);
			}
		}
	);
  
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
    vote: {
        template: "/templates/vote.html",
        title: "Home",
        description: "Vote during the live show",
        button: "button-vote",
    },
    scores: {
        template: "/templates/scores.html",
        title: "Home",
        description: "See the scoreboard",
        button: "button-scores",
    },
    more: {
        template: "/templates/more.html",
        title: "Home",
        description: "More information about this web app",
        button: "button-more",
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
    "all-entries": {
        template: "/templates/all-entries.html",
        title: "All entries",
        description: "This page shows all the entries to this year's contest",
        button: "button-all-entries",
    },
    "admin": {
        template: "/templates/admin.html",
        title: "All entries",
        description: "This page shows an administration interface",
        button: "button-admin",
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
    
    if (location == "vote") {
      checkCurrentEvent();
      // Attach listener for current page
      checkNowPerforming();
    }
    
    if (location == "scores") {
      checkCurrentEvent();
      // Attach listener for current page
      countryDataListener(allEntries, "start");
    } else {
      // Reset the country listener
      countryDataListener(allEntries, "stop");
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