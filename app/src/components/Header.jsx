import '../css/styles.css';
import '../css/Header.scss';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import getCookie from '../assets/cookies';

function Header() {
	const navigate = useNavigate();
	const isAuthorized = getCookie('isAuthorized');

	const toHome = (event) => {
		event.preventDefault();

		if (isAuthorized === 'true') {
			navigate('/dashboard');
		} else {
			navigate('/');
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
				{isAuthorized ? <ProfileIcon /> : <></>}
			</div>
		</header>
	);
}

export default Header;
