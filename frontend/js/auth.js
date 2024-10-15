
const signUpButton = document.querySelector('#signUp');
const signInButton = document.querySelector('#signIn');
const container = document.querySelector('#container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

document.querySelector('#sign-up-form').addEventListener('submit', async (e) => {
	e.preventDefault();
	const formData = {
		name: e.target.name.value,
		phoneno: e.target.phoneno.value,
		email: e.target.email.value,
		password: e.target.password.value
	}
	await axios.post('http://localhost:5000/ems/register', formData)
		.then(response => {
			alert(response.data.message);
			e.target.name.value = '';
			e.target.phoneno.value = '';
			e.target.email.value = '';
			e.target.password.value = '';
		})
		.catch(error => {
			if (error.response) {
				console.error(error.response.data.message);
			} else {
				alert('Server error. Please try again later.');
			}
		})

})

document.querySelector('#sign-in-form').addEventListener('submit', async (e) => {
	e.preventDefault();
	const formData = {
		email: e.target.email.value,
		password: e.target.password.value
	}
	await axios.post('http://localhost:5000/ems/login', formData)
		.then(response => {
			if (response.status === 200) {
				const user = response.data.user;
				localStorage.setItem('loggedInUser', JSON.stringify(user));
				if (user.isAdmin) {
					window.location.href = 'admin/index.html';
				}
				else {
					window.location.href = 'user/index.html';
				}
				e.target.email.value = '';
				e.target.password.value = '';
			}
		})
		.catch(error => {
			if (error.response) {
				console.error(error.response.data.message);
			} else {
				alert('Server error. Please try again later.');
			}
		})

})

let otpModal = document.querySelector('#otpModal');

document.querySelector('#forgot_pass').addEventListener('click', (e) => {
	e.preventDefault();
	otpModal.style.display = 'block';
});

document.querySelector('#closeModal').addEventListener('click', () => {
	otpModal.style.display = 'none';
});

document.querySelector('#otpForm').addEventListener('submit', async (e) => {
	e.preventDefault();
	const email = document.querySelector('#otpForm input[name="email"]').value;
	await axios.post('http://localhost:5000/ems/sendOtp', { email })
		.then(response => {
			document.querySelector('#otpForm').style.display = 'none';
			document.querySelector('#resetPasswordForm').style.display = 'block';
		})
		.catch(error => {
			console.error('Error sending OTP', error);
		});
});

document.querySelector('#resetPasswordForm').addEventListener('submit', function (event) {
	event.preventDefault();

	const otp = document.querySelector('#resetPasswordForm input[name="otp"]').value;
	const newPassword = document.querySelector('#resetPasswordForm input[name="newPassword"]').value;

	axios.post('http://localhost:5000/ems/reset-password', { otp, newPassword })
		.then(response => {
			alert('Password reset successful!');
			document.querySelector('#otpModal').style.display = 'none';
		})
		.catch(error => {
			console.error('Error resetting password', error);
		});
});
