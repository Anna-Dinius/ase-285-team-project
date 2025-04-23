import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from '../icons/avatar.png';
import editLoginIcon from '../icons/edit_login.png';
import editBusinessIcon from '../icons/edit_business.png';
import logoutIcon from '../icons/logout.png';
import '../css/ProfileIcon.css';

export default function ProfileIcon() {
	const [isOpen, setIsOpen] = useState(false);
	const [confirmation, setConfirmation] = useState(false);

	const toggleDropdown = () => setIsOpen(!isOpen);

	const navigate = useNavigate();

	const toEditLoginInfo = () => {
		setIsOpen(false);
		navigate('/edit-login-info');
	};

	const toEditBusinessInfo = () => {
		setIsOpen(false);
		navigate('/edit-business-info');
	};

	const logout = async () => {
		try {
			const response = await fetch(
				'http://localhost:5000/api/auth/logout',
				{
					method: 'POST',
					credentials: 'include',
				}
			);

			if (response.ok) {
				setIsOpen(false);
				setConfirmation(true);
			} else {
				console.log('log out response: ' + response.body);
				const error = await response;
				console.error('Logout failed:', error);
			}
		} catch (err) {
			console.error('Error: ', err.message);
		}
	};

	const toLogin = (event) => {
		event.preventDefault();
		setConfirmation(false);
		navigate('/');
	};

	return (
		<>
			{confirmation ? (
				<div className='confirmation-container'>
					You have been logged out successfully.
					<button
						type='button'
						onClick={toLogin}
						className='button'
					>
						Ok
					</button>
				</div>
			) : (
				<></>
			)}

			<div className='profile-icon-container'>
				<img
					src={avatar}
					alt='User Profile'
					className='avatar-icon'
					onClick={toggleDropdown}
				/>

				{isOpen && (
					<div className='dropdown-menu'>
						<div
							onClick={toEditLoginInfo}
							className='dropdown-item'
						>
							<img
								src={editLoginIcon}
								alt='Edit Login'
							/>
							<span>Edit Login Info</span>
						</div>
						<div
							onClick={toEditBusinessInfo}
							className='dropdown-item'
						>
							<img
								src={editBusinessIcon}
								alt='Edit Business'
							/>
							<span>Edit Business Info</span>
						</div>
						<div
							onClick={logout}
							className='dropdown-item'
						>
							<img
								src={logoutIcon}
								alt='Logout'
							/>
							<span>Log Out</span>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
