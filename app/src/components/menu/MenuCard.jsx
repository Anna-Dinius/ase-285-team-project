import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/MenuCard.css';

export default function MenuCard({
	title,
	description,
	buttonLabel,
	isEditable,
	onTitleChange,
	onDescriptionChange,
}) {
	const navigate = useNavigate();
	const [localTitle, setLocalTitle] = useState(title);
	const [localDescription, setLocalDescription] =
		useState(description);

	const handleTitleChange = (e) => {
		const newTitle = e.target.value;
		setLocalTitle(newTitle);
		onTitleChange(newTitle);
	};

	const handleDescriptionChange = (e) => {
		const newDesc = e.target.value;
		setLocalDescription(newDesc);
		onDescriptionChange(newDesc);
	};

	const toMenu = () => {
		navigate('/menuitems', {
			state: { menuTitle: localTitle }, // passing the editable title
		});
	};

	return (
		<div className='menu-card'>
			{isEditable ? (
				<input
					className='menu-title-input'
					value={localTitle}
					onChange={handleTitleChange}
				/>
			) : (
				<h3 className='menu-title'>{title}</h3>
			)}

			{isEditable ? (
				<textarea
					className='menu-description-textarea'
					value={localDescription}
					onChange={handleDescriptionChange}
					rows={3}
				/>
			) : (
				<p className='menu-description'>{description}</p>
			)}

			<button
				onClick={toMenu}
				className='view-menu-button'
			>
				{buttonLabel}
			</button>
		</div>
	);
}
