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
    // openFullscreen(app);
	} else {
		app.dataset.sidebar = "show";
    app.dataset.fullscreen = "false";
    // closeFullscreen(app);
	}

}

function closeMessage() {
  let app = document.getElementById("app")
  setDataAttribute(app, "message", "false")
}

function openMessage(title, body) {
  let app = document.getElementById("app")
  let messageTitle = document.getElementById("app-message--title");
  let messageBody = document.getElementById("app-message--body");
  
  setDataAttribute(app, "message", "false")
  
  if (title == "") {
  } else {
    setDataAttribute(app, "message", "true")
    messageTitle.innerText = title;
    messageBody.innerText = body;
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

{% assign finalEntries = site.data.entries | where: "final", "true" %}
const allEntries = [{% for entry in finalEntries %}"{{ entry.shortcode }}"{% unless forloop.last %},{% endunless %}{% endfor %}]

function setCurrentEvent(event) {
  settingsData.update({
    currentevent: event
  });
}

function setNowPlaying(shortcode) {
  if (shortcode == "unknown") {
    settingsData.update({
      currentsong: "false"
    });  
  } else {
    settingsData.update({
      currentsong: shortcode
    });
  }
  
}

function setNotificationContent() {
  let title = document.getElementById("input--message-title").value;
  let body = document.getElementById("input--message-body").value;
  
  notificationData.update({
    title: title,
    body: body,
    show: true
  });
}

function checkNotificationData() {
  notificationData.on('value', (snapshot) => {

      let app = document.getElementById("app")
      
      // Check to see notification contents
      var messageTitle = snapshot.val().title;
      var messageBody = snapshot.val().body;
      var messageState = snapshot.val().show;
      
      if (messageState == true) {
        openMessage(messageTitle, messageBody);
      } else {
        closeMessage();
      }
      
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
      
      let votedCountry = app.dataset.votedcountry;
      let currentCountry = app.dataset.nowperforming;
      if (currentCountry != "false" && votedCountry == currentCountry) {
        setDataAttribute(app, "voted", true);
      } else {
        setDataAttribute(app, "voted", false);
      }
      
      // Check current event in firebase
      var currentevent = app.dataset.currentevet;
      // Check current song in firebase
      var currentsong = snapshot.val().currentsong;
      app.dataset.nowperforming = currentsong;
      
      let currentSong = database.ref('/2022/' + currentsong);
      
      currentSong.get().then((snapshot) => {
        if (snapshot.exists()) {
          
          var country = snapshot.val().country;
          var shortcode = snapshot.val().shortcode;
          var artist = snapshot.val().artist;
          var song = snapshot.val().song;
          var emoji = snapshot.val().emoji;
          
          // Set the artist and song
          setDataAttribute(app, "nowperforming", shortcode);
          setDataAttribute(app, "artist", artist);
          setDataAttribute(app, "song", song);
          displayElementData(song + " by " + artist, nowPlayingArtistSong);
          
          // Set the country and emoji
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
        var countryEmoji = snapshot.val().emoji;
  
        var currentEvent = app.dataset.currentevent;
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
        
        if (currentEvent == "sf1" || currentEvent == "sf2") {
          entryScorecard.dataset.runningorder = semiFinalRunningOrder;
          entryScorecard.dataset.votes = semiFinalVotes;
          entryScorecard.dataset.voters = semiFinalVoters;
          
          var points = averagePoints(semiFinalVotes, semiFinalVoters);
          // var points = semiFinalVotes;
          
        } else {
          entryScorecard.dataset.runningorder = finalRunningOrder;
          entryScorecard.dataset.votes = finalVotes;
          entryScorecard.dataset.voters = finalVoters;
          
          var points = averagePoints(finalVotes, finalVoters);
          // var points = finalVotes;
        }
        if (points > 0) {
		      displayElementData(points, entryVotes);
          checkTopScore(entries);
        } else {
          displayElementData(countryEmoji, entryVotes);
        }
		  })
    } else {
      entryData.off('value')
    }
    
    
	};

}

function checkTopScore(entries) {
	var allScores = new Array();

	for (i = 0; i < entries.length; i++) {
		let country = entries[i];
    let votes = parseInt(document.getElementById("scorecard-" + country).dataset.votes);
    let voters = parseInt(document.getElementById("scorecard-" + country).dataset.voters);
    if (votes > 0) {
		  let points = votes / voters;
	    allScores.push([country, points])
    }
	}

	allScores.sort((a,b) => b[1] - a[1]);

	let nonZero = 0;
	for (i = 0; i < allScores.length; i++) {
		if (allScores[i][1] > 0) {
			nonZero++;
		}
	}
  console.group("Top scores");
	if (nonZero > 3) {
		for (i = 0; i < allScores.length; i++) {
			let rank = i + 1;
			if (i < 3) {
				console.log("🥇 " + allScores[i][0] + " – " + allScores[i][1] + " points")
			}
			document.getElementById("scorecard-" + allScores[i][0]).dataset.rank = rank;
		}
	} else {
			console.log("🥇🥈🥉 There aren't enough votes yet...")
			console.info("Scores will update once at least 3 contestants have a non-zero score")
		for (i = 0; i < allScores.length; i++) {
			document.getElementById("scorecard-" + allScores[i][0]).dataset.rank = 0;
		}
	}
	console.groupEnd();

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
  let votingButtons = document.getElementById("voting-buttons");
  let votingVoted = document.getElementById("voting-voted");
  let votedHeader = document.getElementById("voted--points-to-country");
  let votedContent = document.getElementById("voted--points");
  let currentevent = app.dataset.currentevent;
  let currentcountry = app.dataset.nowperforming;
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
        displayElementData(app.dataset.country, votedHeader);
        displayElementData(points, votedContent);
        setDataAttribute(app, "votedpoints", points);
        setDataAttribute(app, "votedcountry", currentcountry);
        setDataAttribute(app, "voted", true);
			}
			return data;
		},
		function(error, committed, snapshot) {
			if (error) {
				console.log('Transaction failed abnormally!', error);
				console.log('Your vote wasn’t counted. Sorry.');
			} else if (!committed) {
				console.log('Your vote wasn’t counted. Sorry.');
			} else {
				console.log('You gave ' + points + ' points to ' + shortcode);
			}
		}
	);
  
}

function resetEventData() {

	var reset = confirm("Do you want to reset all data for this event?");
	if (reset == false) {
	  console.info("💿 Data reset cancelled.")
	} else {

	  // Add each country and set everything to zero
	  for (i = 0; i < allEntries.length; i++) {

		  var shortcode = allEntries[i];
    	let entryData = database.ref('/2022/' + shortcode);
    	let notificationData = database.ref('/Notification/');
    	let settingsData = database.ref('/Settings/');

      entryData.transaction(
		    function(data) {
          if (data) {
	          data['semifinalvotes'] = 0;
	          data['semifinalvoters'] = 0;
	          data['finalvotes'] = 0;
	          data['finalvoters'] = 0;
		      }
			    return data;
		    },
		    function(error, committed, snapshot) {
			    if (error) {
				    console.log('Transaction failed abnormally!', error);
			    } else if (!committed) {
				    console.log('Country not reset.');
			    } else {
				    console.log('Country reset');
			    }
		    }
	    );

	  };
    
	  // Also add or reset event settings
	  notificationData.set({
		  body: "",
      show: false,
      title: ""
	  }, (error) => {
		  if (error) {
		    console.warn("⚙️ Notification failed to reset");
		  } else {
		    console.info("💿 Notification reset");
		  }
	  });    

	  // Also add or reset event settings
	  settingsData.set({
		  currentevent: "false",
      currentsong: "false"
	  }, (error) => {
		  if (error) {
		    console.warn("⚙️ Settings failed to reset");
		  } else {
		    console.info("💿 Settings reset");
		  }
	  });

	}



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
    
    // set the description of the document to the description of the route
    document
        .querySelector('meta[name="description"]')
        .setAttribute("content", route.description);
    
    if (location == "vote") {
      let app = document.getElementById("app");
      let votedHeader = document.getElementById("voted--points-to-country");
      let votedContent = document.getElementById("voted--points");
      let votedCountry = app.dataset.votedcountry;
      let votedPoints = app.dataset.votedpoints;
      let currentCountry = app.dataset.nowperforming;
      if (votedCountry == "false") {
        setDataAttribute(app, "voted", false);
      } else if (votedCountry == currentCountry) {
        setDataAttribute(app, "voted", true);
        displayElementData(app.dataset.country, votedHeader);
        displayElementData(votedPoints, votedContent);
      }
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