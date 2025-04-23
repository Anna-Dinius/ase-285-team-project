import '../css/styles.css';
import '../css/Header.scss';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import checkAuthStatus from '../js/auth';

function Header() {
	const navigate = useNavigate();
	var isAuthenticated = false;
	const response = checkAuthStatus();
	var user = response.user;
	var isAuthenticated = response.isAuthenticated;

	if (user) {
		isAuthenticated = true;
	}

	const toHome = (event) => {
		event.preventDefault();

		if (isAuthenticated === false) {
			navigate('/');
		} else {
			navigate('/dashboard');
		}
	};

	return (
		<header className='header'>
			<div className='header-left'>
				<h1
					onClick={toHome}
					className='header-title'
				>
					NomNom Safe
				</h1>
			</div>
			<div className='header-right'>
				{isAuthenticated ? <ProfileIcon /> : <></>}
			</div>
		</header>
	);
}

export default Header;
