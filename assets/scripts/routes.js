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
};

// create a function that watches the hash and calls the urlLocationHandler
window.addEventListener("hashchange", locationHandler);

// call the urlLocationHandler to load the page
locationHandler();