let root = document.getElementById('root');
let storedEmail = localStorage.getItem('email');
let storedPw = localStorage.getItem('pw');

//Adding text to main on submit, depending on result.
let mainText = document.getElementById('mainText');

window.onload = function () {
	console.log('Välkommen!');
	let session = localStorage.getItem('session');
	if (session) {
		login();
		mainText.innerHTML = 'Log in successful, welcome!';
		showLogoutBtn();
		let removeNameInput = document.getElementById('email');
		removeNameInput.remove();
		let removePasswordInput = document.getElementById('pw');
		removePasswordInput.remove();
		let removeLoginBtn = document.getElementById('loginBtn');
		removeLoginBtn.remove();
		let removecreateUserButton = document.getElementById('createUserButton');
		removecreateUserButton.remove();
	} else {
		notLoggedIn();
		showLoginForm();
	}
};

//Email input
let email = document.createElement('input');
email.setAttribute('id', 'email');
email.setAttribute('type', 'email');
email.setAttribute('placeholder', 'Email');

//Password input
let pw = document.createElement('input');
pw.setAttribute('id', 'pw');
pw.setAttribute('type', 'password');
pw.setAttribute('placeholder', 'Password');

//Login button
let loginBtn = document.createElement('button');
loginBtn.setAttribute('id', 'loginBtn');
loginBtn.addEventListener('click', login);

//Logout button
let logoutBtn = document.createElement('button');
logoutBtn.setAttribute('id', 'logoutBtn');

//Create user button
let createUserButton = document.createElement('button');
createUserButton.setAttribute('id', 'createUserButton');
createUserButton.addEventListener('click', createUserForm);

//Subscription button
let subBtn = document.createElement('input');
subBtn.setAttribute('type', 'checkbox');
subBtn.setAttribute('name', 'newsletter');
subBtn.setAttribute('id', 'subBtn');
subBtn.setAttribute('value', 'false');

let saveNewUser = document.createElement('button');
saveNewUser.setAttribute('id', 'saveNewUser');
saveNewUser.addEventListener('click', saveUser);

let goBack = document.createElement('button');
goBack.setAttribute('id', 'goBack');
goBack.addEventListener('click', windowReload);

function windowReload() {
	location.reload();
}

//Change subscription status button
let subChange = document.createElement('div');

//Show login form
function showLoginForm() {
	header.append(email);
	header.append(pw);
	header.append(loginBtn);
	loginBtn.innerText = 'Log in';

	header.append(createUserButton);
	createUserButton.innerText = 'Create';
}
showLoginForm();

//Show logout button
function showLogoutBtn() {
	header.append(logoutBtn);
	logoutBtn.innerText = 'Log out';
}

//Create new user form
function createUserForm() {
	let removeNameInput = document.getElementById('email');
	removeNameInput.remove();
	let removePasswordInput = document.getElementById('pw');
	removePasswordInput.remove();
	let removeLoginBtn = document.getElementById('loginBtn');
	removeLoginBtn.remove();
	let removecreateUserButton = document.getElementById('createUserButton');
	removecreateUserButton.remove();

	header.append(goBack);
	goBack.innerHTML = 'Go back';

	mainText.innerHTML = 'Enter your information to register!';

	main.append(email);
	main.append(pw);
	let subscribeQuestion = document.createElement('h3');
	subscribeQuestion.innerHTML = 'Subscribe to our newsletter?';
	main.append(subscribeQuestion);
	main.append(subBtn);
	main.append(saveNewUser);
	saveNewUser.innerText = 'Save';
}

// Submit function to save new user
function saveUser() {
	let newUser = {
		email: email.value,
		pw: pw.value,
		subscription: `${subBtn.checked == true ? true : false}`,
	};
	fetch('http://localhost:3000/users/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(newUser),
	})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			if (data == '!ok') {
				mainText.innerHTML = 'Something went wrong. Please try again!';
			} else {
				mainText.innerHTML =
					'Thank you for registering! Click on Go back to return to the front page and login!';
			}
		});
}

// Login function, with removal of form on successful login.
function login() {
	let userLogIn = {
		email: email.value,
		pw: pw.value,
	};

	fetch('http://localhost:3000/users/login/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(userLogIn),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data != 'incorrect') {
				console.log('Welcome', email.value);
				console.log('Subscribed:', data.user.subscription);
				localStorage.setItem('session', email.value);
				localStorage.setItem('subStatus', data.user.subscription);
				mainText.innerHTML = 'Log in successful, welcome!';

				let userEmail = document.createElement('h2');
				userEmail.innerHTML = email.value;

				let subChange = document.createElement('div');

				let status =
					data.user.subscription == true
						? 'You are currently subscribed!'
						: 'You are currently not subscribed';
				subChange.innerHTML = `<p>${status}</p><br>
				<button id='turnOffSub'>Turn off subscription</button>
				<button id='turnOnSub'>Turn on subscription</button>`;

				mainText.append(userEmail, subChange);

				showLogoutBtn();
				let removeEmailInput = document.getElementById('email');
				removeEmailInput.remove();
				let removePasswordInput = document.getElementById('pw');
				removePasswordInput.remove();
				let removeLoginBtn = document.getElementById('loginBtn');
				removeLoginBtn.remove();
				let removecreateUserButton =
					document.getElementById('createUserButton');
				removecreateUserButton.remove();

				subChange.addEventListener('click', (e) => {
					let user = localStorage.getItem('session');
					let userObject = { email: user };
					if (e.target.id == 'turnOffSub' || e.target.id == 'turnOnSub') {
						if (e.target.id == 'turnOffSub') {
							console.log('turnoffsub');
							subChange.innerHTML = `<p>You are currently not subscribed!</p><br>
							<button id='turnOffSub'>Turn off subscription</button>
							<button id='turnOnSub'>Turn on subscription</button>`;
							userObject = { email: user, subscription: 'false' };
						} else if (e.target.id == 'turnOnSub') {
							console.log('turnOnsub');
							subChange.innerHTML = `<p>You are currently subscribed!</p><br>
							<button id='turnOffSub'>Turn off subscription</button>
							<button id='turnOnSub'>Turn on subscription</button>`;

							userObject = { email: user, subscription: 'true' };
						}
						fetch('http://localhost:3000/users/editSubscription/', {
							method: 'PUT',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(userObject),
						})
							.then((res) => res.json())
							.then((data) => {
								console.log(userObject);
							});
					}
				});
			} else {
				notLoggedIn();
			}
		});
}

//Logout function
logoutBtn.addEventListener('click', function () {
	notLoggedIn();
	showLoginForm();
	let removeLogoutBtn = document.getElementById('logoutBtn');
	removeLogoutBtn.remove();
	localStorage.clear();
	location.reload();
});

function notLoggedIn() {
	mainText.innerHTML = 'Please log in to continue';
}

function wrongLogin() {
	mainText.innerHTML = 'Incorrect login information, please try again';
}
