const express = require('express');
const router = express.Router();
const User = require('../schemas/User');
const jwt = require('jsonwebtoken');

router.get('/check-auth', (req, res) => {
	console.log('Cookies: ', req.cookies);
	const token = req.cookies.token; // Extract the token from the cookie

	if (!token) {
		return res.status(401).json({
			isAuthenticated: false,
			message: 'No token provided',
		});
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET
		); // Verify the token
		res
			.status(200)
			.json({ isAuthenticated: true, user: decoded });
	} catch (err) {
		res.status(403).json({
			isAuthenticated: false,
			message: 'Invalid or expired token',
		});
	}
});

// @route   GET /api/auth/signin
// @desc    Get a user
// @access  Public (no auth yet)
router.post('/signin', async (req, res) => {
	try {
		if (!req.body.email || !req.body.password) {
			return res.status(400).json({
				error: 'Email and password are required.',
			});
		}

		const filters = {
			email: req.body.email,
			password: req.body.password,
		};
		const foundUser = await User.findOne(filters);

		if (foundUser) {
			console.log('Found user in db');

			// Create JWT token with user's email & status
			const token = jwt.sign(
				{
					email: foundUser.email,
					isAdmin: foundUser.admin,
				},
				process.env.JWT_SECRET,
				{
					expiresIn: '1h',
				}
			);

			// console.log('reached response');

			res.cookie('token', token, {
				httpOnly: true,
				secure: true,
				path: '/',
			});

			res.writeHead(200, {
				'Set-Cookie': `token=token; HttpOnly`,
				'access-control-allow-credentials': 'true',
			});

			console.log(
				'Set-Cookie:',
				res.getHeaders()['set-cookie']
			);

			// res.status(200).json(foundUser);
			res.status(200).json({
				success: true,
				message: 'User successfully logged in.',
			});
		} else {
			// Email and/or password is wrong or doesn't exist
			res.status(401).json({
				error: 'Could not fetch user' + err.message,
			});
		}
	} catch (err) {
		res.status(500).json({
			error: 'Could not fetch user' + err.message,
		});
	}
});

// @route   POST /api/auth/signup
// @desc    Create a new user
// @access  Public (no auth yet)
router.post('/signup', async (req, res) => {
	try {
		const { first_name, last_name, email, password } =
			req.body;

		if (!first_name || !last_name || !email || !password) {
			return res
				.status(400)
				.json({ error: 'All fields are required.' });
		}

		// Create new user document from request body
		const newUser = new User({
			first_name,
			last_name,
			email,
			password,
			business_id: '',
			menu_item_layout: 0,
			admin: true,
		});
		const savedUser = await newUser.save();

		res.status(201).json(savedUser);
	} catch (err) {
		res.status(400).json({
			error: 'Error creating user: ' + err.message,
		});
	}
});

router.post('/logout', (req, res) => {
	// Clear the token cookie
	res.clearCookie('token', { path: '/' });
	res
		.status(200)
		.json({ message: 'Logged out successfully' });
});

module.exports = router;
