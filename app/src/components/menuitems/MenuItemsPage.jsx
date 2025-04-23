import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MenuItemPanel from './assets/MenuItemPanel.jsx';
import '../../css/styles.css';
import { useNavigate } from 'react-router-dom';

const mockMenuItems = [
	{
		id: 1,
		name: 'Cheeseburger',
		description: 'Classic burger with cheese and pickles.',
		ingredients:
			'Beef, Cheese, Bun, Pickles, Onion, Tomato',
		allergens: [],
	},
	{
		id: 2,
		name: 'Vegan Wrap',
		description: 'Fresh and healthy wrap with veggies.',
		ingredients: 'Lettuce, Tomato, Cucumber, Hummus, Wrap',
		allergens: [],
	},
];

const MenuItemsPage = () => {
	const [menuItems, setMenuItems] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		// Fetch from your backend here
		setMenuItems(mockMenuItems);
	}, []);

	const handleAddItem = (event) => {
		const newItem = {
			id: Date.now(),
			name: '[Menu Item]',
			description: '',
			ingredients: '',
		};
		setMenuItems((prev) => [...prev, newItem]);

		event.preventDefault();
		navigate('/add-menu-item');
		// TODO: Send new item to backend
	};

	const handleSave = (updatedItem) => {
		setMenuItems((prev) =>
			prev.map((item) =>
				item.id === updatedItem.id ? updatedItem : item
			)
		);
		// TODO: Send update to backend
	};

	const handleDelete = (id) => {
		setMenuItems((prev) =>
			prev.filter((item) => item.id !== id)
		);
		// TODO: Send delete request to backend
	};

	const filteredItems = menuItems.filter((item) =>
		item.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	const location = useLocation();
	const menuTitle =
		location.state?.menuTitle || 'Untitled Menu';

	return (
		<div className='menu-items-container'>
			{/* Top section: buttons + menu name */}
			<div className='menu-header-row'>
				<div style={{ flex: 1 }}>
					<button
						className='button'
						onClick={handleAddItem}
					>
						+ Add Item
					</button>
				</div>
				<div
					className='menu-name'
					style={{ flex: 1, textAlign: 'center' }}
				>
					{menuTitle}
				</div>
				<div style={{ flex: 1, textAlign: 'right' }}>
					<button className='button'>
						Integrate Menus
					</button>
				</div>
			</div>

			{/* Search bar */}
			<div className='menu-search-wrapper'>
				<input
					className='menu-search'
					type='text'
					placeholder='Search for Item'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* Menu items list */}
			<div className='menu-item-list'>
				<h2>Menu Items</h2>
				{filteredItems.map((item) => (
					<MenuItemPanel
						key={item.id}
						item={item}
						onSave={handleSave}
						onDelete={handleDelete}
					/>
				))}
			</div>
		</div>
	);
};

export default MenuItemsPage;
