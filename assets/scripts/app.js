---
---

var sidebarToggle = document.getElementById("toggle-menu");
sidebarToggle.addEventListener("click", toggleSidebar);

function toggleSidebar() {

	if (document.getElementById("app").dataset.sidebar == "show") {
		document.getElementById("app").dataset.sidebar = "hide";
	} else {
		document.getElementById("app").dataset.sidebar = "show";
	}
}



