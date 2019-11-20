/*
 * Much nicer injection than what extensions like tampermonkey offer us
 * great against stack traces (VM:XX rather than ..extension/script.js or userscript..)
 * sandboxed environment (unmodified native functions)
 * faster than tamper monkeys "document_start"
 * injects into all frames with high priority
 */
function getRandomToken() {
	const randomPool = new Uint8Array(32);
	crypto.getRandomValues(randomPool);
	let hex = '';
	for (const i of randomPool) {
		hex += randomPool[i].toString(16);
	}

	return hex;
}

try {
	(ttap)(hrt);
} catch (e) {
	try {
		const recursing = e.stack.match(/chairloader/g).length > 1;
		if (!recursing) {
			// must be synchronous to force execution before other scripts
			// note: we fetch the same code for each iframe
			fetch('https://raw.githubusercontent.com/hrt/WheelChair/master/wheelchair.min.js')
				.then(data => data.text())
				.then(response => {
					const unique_string = getRandomToken();
					const code = response.replace(/ttap#4547/g, unique_string);
					// inject our code into a new iframe to avoid using hooks placed by anti cheat
					const frame = document.createElement('iframe');
					frame.setAttribute('style', 'display:none');
					document.documentElement.appendChild(frame);
					const child = frame.contentDocument || frame.contentWindow.document;
					const chair = document.createElement('script');
					chair.innerHTML = code;
					child.documentElement.append(chair);
					child.documentElement.remove(chair);
					document.documentElement.removeChild(frame);
				})
				.catch(({
					status
				}) => {
					console.error('Error GET wheelchair: ' + status);
				})
		}
	} catch (e) {
		if (e instanceof DOMException) {
			// expected for sandboxed iframes
			console.warn(e);
		} else {
			throw e;
		}
	}
}
