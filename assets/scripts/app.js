---
---
//////////////////////////////
// Other UI related scripts //
//////////////////////////////

function toggleFullScreen() {
    var app = document.getElementById("app");
    var buttonFullScreen = document.getElementById("button--full-screen");
    if (app.dataset.sidebar == "show") {
        app.dataset.sidebar = "hide";
        app.dataset.fullscreen = "true";
        buttonFullScreen.dataset.visible = "false";
    } else {
        app.dataset.sidebar = "show";	
        app.dataset.fullscreen = "false";
        buttonFullScreen.dataset.visible = "true";
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

{% assign entries = site.data.entries | sort: 'final' %}
const allEntries = [{% for entry in entries %}"{{ entry.shortcode }}"{% unless forloop.last %},{% endunless %}{% endfor %}];

{% assign events = site.data.dates %}
{% for event in events %}
const {{ event.event }} = {date: "{{ event.date }}"};
{% endfor %}

function between(x, min, max) {
  return x >= min && x <= max;
}

function checkCurrentEvent() {
    var currentDay = new Date().getUTCDate();
    var currentMonth = new Date().getUTCMonth() + 1;
    var currentYear = new Date().getFullYear();
    var currentDate = currentDay  + '-' + currentMonth + '-' + currentYear ;
    if (currentDate === semifinal1["date"]) {
        var event = app.dataset.event = "SF1";
    } else if (currentDate === semifinal2["date"]) {
        var event = app.dataset.event = "SF2";
    } else if (currentDate === final["date"]) { 
        var event = app.dataset.event = "FINAL";
    } else if (currentDate === test["date"]) { 
        var event = app.dataset.event = "SF1";
    } else {
        var event = app.dataset.event = "NONE";
    }
    
    return event;
}


function averagePoints(points, votes) {
    var avg = points / votes;
    var avg = Math.round(avg);
    if (avg == 11) {
        avg = 12;
    } else if (avg == 9) {
        avg = 10;
    }
    return avg;
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

function countryDataListener(entries, event, toggle) {
    
    var app = document.getElementById("app");
    var event = app.dataset.event;
    
	for (i = 0; i < entries.length; i++) {
        
        let entry = entries[i];
        let entryData = database.ref('/2024/' + entry + '/' + event);
        let entryScorecard = document.getElementById('scorecard-' + entry);
        let entryScore = document.getElementById("scorecard-" + entry + "-score");
        let count = i + 1;
        
        if (toggle == "start") {
	        entryData.on('value', (snapshot) => {
                let points = snapshot.val().points;
                entryScorecard.dataset.points = points;
                
                let votes = snapshot.val().votes;
                entryScorecard.dataset.votes = votes;
                
                let score = averagePoints(points, votes);
                console.log(count, entry, points, votes, score);
                
                if (score > 0) {
                    displayElementData(score, entryScore);
                }
                
                checkTopScore(entries);
            })
        } else {
            entryData.off('value')
        }
	};
    
};

function checkTopScore(entries) {
	var allScores = new Array();

	for (i = 0; i < entries.length; i++) {
		let country = entries[i];
        let points = parseInt(document.getElementById("scorecard-" + country).dataset.points);
        let votes = parseInt(document.getElementById("scorecard-" + country).dataset.votes);
        if (points > 0 || votes > 0) {
		    let score = points / votes;
	        allScores.push([country, score])
        }
	}
    
	allScores.sort((a,b) => b[1] - a[1]);

	var nonZero = 0;
	for (i = 0; i < allScores.length; i++) {
		if (allScores[i][1] > 0) {
			nonZero++;
		}
	}

	if (nonZero > 3) {
		app.dataset.layout = "rank";
		for (i = 0; i < allScores.length; i++) {
			let rank = i + 1;
			document.getElementById("scorecard-" + allScores[i][0]).dataset.rank = rank;
	        document.getElementById("scorecard-" + allScores[i][0] + "-position").dataset.rank = rank;      
		}
	} 
}

// When this call is triggered, it will update the score for the country,
// in a given event or create it if it doesn't exist
function vote(points, country) {
  
    var app = document.getElementById("app");
    var event = app.dataset.event;
  
	// Get the current score for the country
	var entryData = database.ref('/2024/' + country + '/' + event);
	var points = parseInt(points);

	entryData.transaction(
		function(data) {
			if (data) {
                var currentPoints = data.points;
                var currentVotes = data.votes;
                data['points'] = currentPoints + points;
                data['votes'] = currentVotes + 1;
                
                var voteCard = document.getElementById("vote-" + country);
                var voteValue = document.getElementById("voted-" + country);
                setDataAttribute(voteCard, "voted", "true");
                setDataAttribute(voteValue, "points", points);
                displayElementData(points, voteValue);
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
				console.log('You gave ' + points + ' points to ' + country);
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
    }
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
        var app = document.getElementById("app");
        var event = checkCurrentEvent();
    }
    
    if (location == "scores") {
        var buttonFullScreenToggle = document.getElementById("button--full-screen");
        buttonFullScreenToggle.addEventListener("click", toggleFullScreen);
        var event = checkCurrentEvent();
        // Attach listener for current page
        countryDataListener(allEntries, event, "start");
    } else {
        var event = checkCurrentEvent();
        // Reset the country listener
        countryDataListener(allEntries, event, "stop");
    }
    
};

// create a function that watches the hash and calls the urlLocationHandler
window.addEventListener("hashchange", locationHandler);
window.onload = function() {
  
  presence.on("value", (snap) => {
    if (snap.val() === true) {
	    console.info("📶 ✅ Connected");   
    } else {
	    console.info("📶 ⛔️ Not connected");
    }
  });
  
}
// call the urlLocationHandler to load the page
locationHandler();