let root = document.getElementById("root");
let storedEmail = localStorage.getItem("email");
let storedPw = localStorage.getItem("pw");

window.onload = function () {
	console.log("Välkommen!");
	let session = localStorage.getItem("session");
	if (session) {
		loggedIn();
		showLogoutBtn();
		let removeNameInput = document.getElementById("email");
		removeNameInput.remove();
		let removePasswordInput = document.getElementById("pw");
		removePasswordInput.remove();
		let removeLoginBtn = document.getElementById("loginBtn");
		removeLoginBtn.remove();
		let removecreateUserButton = document.getElementById("createUserButton");
		removecreateUserButton.remove();
	} 
};

//Email input
let email = document.createElement("input");
email.setAttribute("id", "email");
email.setAttribute("type", "email");
email.setAttribute("placeholder", "Email");

//Password input
let pw = document.createElement("input");
pw.setAttribute("id", "pw");
pw.setAttribute("type", "password");
pw.setAttribute("placeholder", "Password");

//Subscription button
let subBtn = document.createElement("input");
subBtn.setAttribute("type", "radio");
subBtn.setAttribute("name", "newsletter");
subBtn.setAttribute("value", "false");

//Login button
let loginBtn = document.createElement("button");
loginBtn.setAttribute("id", "loginBtn");
loginBtn.addEventListener("click", login);

//Logout button
let logoutBtn = document.createElement("button");
logoutBtn.setAttribute("id", "logoutBtn");

//Create user button
let createUserButton = document.createElement("button");
createUserButton.setAttribute("id", "createUserButton");


function showLoginForm() {
	header.append(email);
	header.append(pw);
	header.append(loginBtn);
	loginBtn.innerText = "Log in";

	header.append(createUserButton);
	createUserButton.innerText ="Create";
}
showLoginForm();

function showLogoutBtn() {
	header.append(logoutBtn);
	logoutBtn.innerText = "Log out";
}



//Login function, with removal of form on successful login.
function login() {

	let login = {
	email: email.value,
	pw: pw.value,
	};

	fetch ('http://localhost:3000/users/login/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(login)
	}).then((res) => res.json())
	.then(data => {
		if (data != 'incorrect') {
			localStorage.setItem("session", data);
			loggedIn(data);
		showLogoutBtn();
		let removeEmailInput = document.getElementById("email");
		removeEmailInput.remove();
		let removePasswordInput = document.getElementById("pw");
		removePasswordInput.remove();
		let removeLoginBtn = document.getElementById("loginBtn");
		removeLoginBtn.remove();
		let removecreateUserButton = document.getElementById("createUserButton");
		removecreateUserButton.remove();
		} else {
			notLoggedIn();
		}
	}
)};


//Logout function
logoutBtn.addEventListener("click", function () {
	notLoggedIn();
	showLoginForm();
	let removeLogoutBtn = document.getElementById("logoutBtn");
	removeLogoutBtn.remove();
	localStorage.clear();
});


//Adding text to main on submit, depending on result.
let mainText = document.getElementById("mainText");

function notLoggedIn() {
	mainText.innerHTML = "Please log in to continue";
}

function loggedIn() {
	mainText.innerHTML = "Log in successful, welcome!";

	fetch('http://localhost:3000/users/login')
	.then(res => res.json())
	.then(data => {
		let userEmail = document.createElement("h2");
		userEmail.innerHTML = data.email;

		let subBtn = document.createElement("button");
		subBtn.addEventListener("click", () => editSubscription(data));

	})
}

function wrongLogin() {
	mainText.innerHTML = "Incorrect login information, please try again";
}
