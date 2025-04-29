import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PropTypes from 'prop-types';
import '../../css/auth.scss';
import GetPasswordField from './Password';
import GetConfirmationMessage from '../ConfirmationMessage';
import ErrorMessage from '../ErrorMessage';
import format from '../../assets/formValidation.js';

function GetAuthForm({ formName }) {
	const navigate = useNavigate();
	const [invalidEmail, setInvalidEmail] = useState(false);
	const [message, setMessage] = useState(
		'Something went wrong'
	);
	const [showError, setShowError] = useState(false);
	const [showConfirmation, setShowConfirmation] =
		useState(false);
	const [destination, setDestination] = useState('/');

	const checkCredentials = async (event) => {
		event.preventDefault();
		const form = event.target;
		if (formName === 'signUpForm') {
			const validEmail = format.validateEmail(
				form.email.value
			);

			if (!validEmail) {
				setMessage('Invalid email format.');
				setShowError(true);
			} else {
				const validPassword = format.validatePassword(
					form.password.value
				);

				if (!validPassword) {
					setMessage(
						'Password must be at least 6 characters long.'
					);
					setShowError(true);
				} else {
					await signUp(form);
				}
			}
		} else if (formName === 'signInForm') {
			await logIn(form);
		}
	};

	const signUp = async (form) => {
		const formData = {
			first_name: form.first_name.value,
			last_name: form.last_name.value,
			email: form.email.value,
			password: form.password.value,
			business_id: '',
			menu_item_layout: 0,
			admin: true,
		};

		// console.log(formData);

		try {
			const response = await fetch(
				'http://localhost:5000/api/auth/signup',
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formData),
				}
			);

			if (response.ok) {
				const result = await response;
				// console.log(result.message);
				navigate('/step1'); // Redirect on success
			} else {
				// console.log('sign up response: ' + response.body);
				const error = await response;
				console.error('Error:', error);
			}
		} catch (err) {
			console.error('Error: ', err.message);
		}
	};

	const logIn = async (form) => {
		// console.log('form.email: ' + form.email.value);
		// console.log('form.password: ' + form.password.value);

		const formData = {
			email: form.email.value,
			password: form.password.value,
		};

		// console.log('formData: ' + formData);

		try {
			const response = await fetch(
				'http://localhost:5000/api/auth/signin',
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formData),
				}
			);

			// TODO: improve error handling
			if (response.ok) {
				const result = await response.json();
				// console.log(result.email);
				// console.log('result.cookies:', document.cookie);
				navigate('/dashboard');
			} else {
				// console.log('sign in response: ' + response.body);
				const error = await response;
				console.error('Error:', error);
			}
		} catch (err) {
			console.error('Error: ', err.message);
		}
	};

	return (
		<form
			name={formName}
			onSubmit={checkCredentials}
			method='POST'
			className='auth-form'
		>
			{showConfirmation ? (
				<GetConfirmationMessage
					message={message}
					destination={destination}
				/>
			) : (
				<></>
			)}

			{showError ? (
				<ErrorMessage
					message={message}
					destination={false}
					onClose={() => setShowError(false)}
				/>
			) : (
				<></>
			)}

			<h2
				className={
					formName === 'signUpForm'
						? ' sign-up-title'
						: 'login-title'
				}
			>
				NomNom Safe
			</h2>

			{formName === 'signUpForm' ? (
				<>
					<div className='form-field-container'>
						<label htmlFor='first_name'>
							First Name <span className='required'>*</span>
						</label>

						<input
							type='text'
							name='first_name'
							placeholder='First Name'
							required
							className='name'
						/>
					</div>

					<div className='form-field-container'>
						<label htmlFor='last_name'>
							Last Name <span className='required'>*</span>
						</label>

						<input
							type='text'
							name='last_name'
							placeholder='Last Name'
							required
							className='name'
						/>
					</div>
				</>
			) : (
				<></>
			)}

			<div className='form-field-container'>
				<label htmlFor='email'>
					Email <span className='required'>*</span>
				</label>

				<input
					type='text'
					name='email'
					placeholder='johndoe@mail.com'
					required
					className='email'
				/>
			</div>

			<GetPasswordField
				name='password'
				placeholder='Password'
			/>

			{/* dynamically generates:
            Confirm Password field and Sign Up button for Sign Up form
            Log In button for Sign In form */}
			{formName === 'signUpForm' ? (
				<>
					<GetPasswordField
						name='confirmPassword'
						placeholder='Confirm Password'
					/>

					<button
						type='submit'
						className='sign-up-btn button'
					>
						Sign Up
					</button>
				</>
			) : (
				<button
					type='submit'
					className='sign-in-btn button'
				>
					Log In
				</button>
			)}
		</form>
	);
}

// Prop validation
GetAuthForm.propTypes = {
	formName: PropTypes.string.isRequired,
};

export default GetAuthForm;
