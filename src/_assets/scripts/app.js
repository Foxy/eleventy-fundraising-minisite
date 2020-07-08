// Changes the video
setVideoUrl = function (el) {
	document
		.querySelector("#video-player")
		.setAttribute("src", el.target.getAttribute("data-url"));
};
document
	.querySelectorAll('button[data-action="setVideoUrl"]')
	.forEach((btn) => {
		btn.addEventListener("click", setVideoUrl);
	});

// Quantity selector button
// From https://tailwindcomponents.com/component/number-input-counter
// Modifications to set minimum and to dispatch a "change" event by Brett
function decrement(e) {
	const btn = e.target.parentNode.parentElement.querySelector(
		'button[data-action="decrement"]'
	);
	const target = btn.nextElementSibling;
	let value = Number(target.value);
	if (value > 1) value--;
	target.value = value;
	target.dispatchEvent(new Event("change"));
}

function increment(e) {
	const btn = e.target.parentNode.parentElement.querySelector(
		'button[data-action="decrement"]'
	);
	const target = btn.nextElementSibling;
	let value = Number(target.value);
	value++;
	target.value = value;
	target.dispatchEvent(new Event("change"));
}

document.querySelectorAll(`button[data-action="decrement"]`).forEach((btn) => {
	btn.addEventListener("click", decrement);
});

document.querySelectorAll(`button[data-action="increment"]`).forEach((btn) => {
	btn.addEventListener("click", increment);
});

// Quantity connected to Foxy links
document.querySelectorAll("input[name='quantity']").forEach((qty) => {
	qty.addEventListener("change", function (e) {
		const quantity = e.target.value;
		let foo = e.target
			.closest("[data-foxy-product-container]")
			.querySelectorAll("[data-foxy-product-link]")
			.forEach(function (l) {
				l.href = l.href.replace(/&quantity=\d+/g, "&quantity=" + quantity);
			});
	});
});
