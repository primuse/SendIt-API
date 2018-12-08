class Fetch {
	static login(event) {
		event.preventDefault();
		const email = document.getElementById('email').value;
		const password = document.getElementById("pwd").value;
		const myData = {
			email,
			password,
		};
		const config = {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify(myData),
		};

		fetch('http://localhost:3000/api/v1/auth/login', config)
		.then(handleErrors)
		.then(res =>  { 
			localStorage.setItem('token', res.data[0].token);
			window.location = 'dashboard.html';
		})
		.catch((err) => {
		  notif.make({text: 'Invalid Email or Password', type: 'danger' });
		})
	}

	// static signup() {
	// 	const firstName = document.getElementById('firstName').value;
	// 	const lastName = document.getElementById('lastName').value;
	// 	const email = document.getElementById('email').value;
	// 	const password = document.getElementById("password").value;
	// 	const myData = {
	// 		firstName,
	// 		lastName,
	// 		email,
	// 		password,
	// 	};
	// 	const config = {
	// 		method: 'POST',
	// 		headers: new Headers({
	// 			'Content-Type': 'application/json'
	// 		}),
	// 		body: JSON.stringify(myData),
	// 	};

	// 	fetch('http://localhost:3000/api/v1/auth/signup', config)
	// 	.then(res => res.json())
	// 	.then(res => console.log(res))
	// }
}
	

// // Implementing the signup page
// let signupBtn = document.getElementById("signup");
// if (signupBtn !== null) {
// 	signupBtn.addEventListener('click', Fetch.signup);
// }

// Implementing the Login page
let loginForm = document.getElementById('login-form');
if (loginForm !== null) {
	loginForm. addEventListener('submit', Fetch.login);
}

function handleErrors(res) {
	if(!res.ok) {
		throw new Error(res.statusText);
	}
	return res.json();
}


const notif = new Notification()
document.body.append(notif.getElement());