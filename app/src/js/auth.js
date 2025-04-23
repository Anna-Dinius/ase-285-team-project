const checkAuthStatus = async () => {
	try {
		const response = await fetch(
			'http://localhost:5000/api/auth/check-auth',
			{
				method: 'GET',
				credentials: 'include', // Include cookies in the request
			}
		);

		if (response.ok) {
			const user = await response.json();
			console.log('User is authenticated:', user);
			return user;
		}
	} catch (err) {
		console.error(
			'Error checking auth status:',
			err.message
		);
	}
};

export default checkAuthStatus;
