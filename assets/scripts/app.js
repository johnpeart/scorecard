---
---


//////////////////////////////
// Other UI related scripts //
//////////////////////////////

var appWindow = document.documentElement;

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