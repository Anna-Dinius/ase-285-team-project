import React, { useState } from 'react';
import MenuCard from './MenuCard';
import '../../css/MenuDashboard.css';
import deleteIcon from '../../icons/delete.png';
import checkAuthStatus from '../../js/auth.js';

function MenuDashboard() {
	var isAuthenticated = false;
	var user = checkAuthStatus();
	var email = 'test';

	if (user) {
		isAuthenticated = true;
		email = user.email;
		console.log('user.email: ' + user.email);
	}

	const [menus, setMenus] = useState([
		{
			title: 'Master Menu',
			description: 'This menu will be shown to customers',
			isEditable: false,
		},
	]);

	const [showConfirm, setShowConfirm] = useState(false);
	const [menuToDelete, setMenuToDelete] = useState(null);

	// Temporarily just update local state for new menus
	const handleAddMenu = () => {
		const newMenu = {
			title: 'Untitled Menu',
			description: 'New menu created',
			isEditable: true,
		};
		setMenus([...menus, newMenu]);
	};

	const handleRequestDelete = (index) => {
		setMenuToDelete(index);
		setShowConfirm(true);
	};

	const handleConfirmDelete = () => {
		setMenus(menus.filter((_, i) => i !== menuToDelete));
		setMenuToDelete(null);
		setShowConfirm(false);
	};

	const handleCancelDelete = () => {
		setShowConfirm(false);
		setMenuToDelete(null);
	};

	const handleTitleChange = (index, newTitle) => {
		const updatedMenus = menus.map((menu, i) =>
			i === index ? { ...menu, title: newTitle } : menu
		);
		setMenus(updatedMenus);
	};

	const handleDescriptionChange = (
		index,
		newDescription
	) => {
		const updatedMenus = menus.map((menu, i) =>
			i === index
				? { ...menu, description: newDescription }
				: menu
		);
		setMenus(updatedMenus);
	};

	return (
		<div className='dashboard-container'>
			<div>Welcome, {email}</div>

			<div className='dashboard-header'>
				<button
					className='button add-menu-btn'
					onClick={handleAddMenu}
				>
					+ Add a Menu
				</button>
				<h2 className='dashboard-title'>
					Your Menu Dashboard
				</h2>
			</div>

			<div className='menu-grid'>
				{menus.map((menu, index) => (
					<div
						className='menu-card-wrapper'
						key={index}
					>
						{index !== 0 && (
							<img
								src={deleteIcon}
								alt='Delete'
								className='delete-icon'
								onClick={() => handleRequestDelete(index)}
							/>
						)}
						<MenuCard
							title={menu.title}
							description={menu.description}
							buttonLabel='View Menu'
							isEditable={menu.isEditable}
							onTitleChange={(newTitle) =>
								handleTitleChange(index, newTitle)
							}
							onDescriptionChange={(newDesc) =>
								handleDescriptionChange(index, newDesc)
							}
						/>
					</div>
				))}
			</div>

			{showConfirm && (
				<div className='confirm-delete-box'>
					<div className='confirm-content'>
						<p className='confirm-title'>
							Confirm Deletion?
						</p>
						<p className='confirm-message'>
							You are deleting{' '}
							<strong>{menus[menuToDelete]?.title}</strong>.
						</p>
					</div>
					<div className='delete-buttons-box'>
						<button
							className='delete-cancel'
							onClick={handleCancelDelete}
						>
							No, do not Delete
						</button>
						<button
							className='delete-confirm'
							onClick={handleConfirmDelete}
						>
							Yes, Delete
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default MenuDashboard;
