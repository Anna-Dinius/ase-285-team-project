const express = require('express');
const router = express.Router();
const User = require('../schemas/User');

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

			// Set 'cookies' to 'express'
			res.cookie('cookies', 'express', {
				secure: true,
				sameSite: 'None',
			});
			// Add email cookie
			res.cookie('email', req.body.email, {
				secure: true,
				sameSite: 'None',
			});
			// Add admin status cookie
			res.cookie('isAdmin', foundUser.admin, {
				secure: true,
				sameSite: 'None',
			});
			// Add authorized status cookie
			res.cookie('isAuthorized', true, {
				secure: true,
				sameSite: 'None',
			});

			res.status(200).json(foundUser);
		} else {
			// Email and/or password is wrong or doesn't exist
			res.status(401).json({
				error: "Email or password doesn't match.",
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

module.exports = router;
