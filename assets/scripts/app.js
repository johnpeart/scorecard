---
---

var appWindow = document.documentElement;

var buttonSidebarToggle = document.getElementById("toggle-menu");
buttonSidebarToggle.addEventListener("click", toggleSidebar);

var pageHome = "home";
var buttonHome = document.getElementById("button-home");
buttonHome.addEventListener("click", function() {
	goToPage(pageHome)
}, false);

var pageSemiFinal1 = "semi-final-1";
var buttonSemiFinal1 = document.getElementById("button-semi-final-1");
buttonSemiFinal1.addEventListener("click", function() {
	goToPage(pageSemiFinal1)
}, false);

var pageSemiFinal2 = "semi-final-2";
var buttonSemiFinal2 = document.getElementById("button-semi-final-2");
buttonSemiFinal2.addEventListener("click", function() {
	goToPage(pageSemiFinal2)
}, false);

var pageGrandFinal = "grand-final";
var buttonGrandFinal = document.getElementById("button-grand-final");
buttonGrandFinal.addEventListener("click", function() {
	goToPage(pageGrandFinal)
}, false);

var pageMore = "more";
var buttonMore = document.getElementById("button-more");
buttonMore.addEventListener("click", function() {
	goToPage(pageMore)
}, false);

// var fullscreenToggle = document.getElementById("toggle-fullscreen");
// fullscreenToggle.addEventListener("click", openFullScreen, appWindow);

function toggleSidebar() {

	if (document.getElementById("app").dataset.sidebar == "show") {
		document.getElementById("app").dataset.sidebar = "hide";
	} else {
		document.getElementById("app").dataset.sidebar = "show";
	}

}

function goToPage(page) {
	document.getElementById("app").dataset.page = "page-" + page;
	var menu = document.getElementById("sidebar-navigation-buttons");
	var buttons = document.getElementsByTagName("button");

	for (var i = 0; i < buttons.length; i++) {
		buttons[i].dataset.status = "false";
	}
	document.getElementById("button-" + page).dataset.status = "active";
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


