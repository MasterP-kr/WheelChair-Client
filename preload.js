function keyDown(event) {
	if (document.activeElement.tagName == "INPUT") {
		return;
	}
	switch (event.key) {
		case 'Escape':
			if (event.ctrlKey || event.shiftKey) {
				return;
			}
			document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
			document.exitPointerLock();
			break;
	}
}


window.addEventListener("keydown", event => keyDown(event));
