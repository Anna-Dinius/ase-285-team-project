const express = require('express');
const router = express.Router();
const User = require('../schemas/User');

// @route   POST /api/auth/signin
// @desc    Get a user
// @access  Public (no auth yet)
router.post('/signin', async (req, res) => {
	try {
		// Check if email or password is missing
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

			// Set name cookie
			res.cookie('fullName', foundUser.getFullName(), {
				secure: true,
				sameSite: 'None',
			});
			// Set email cookie
			res.cookie('email', req.body.email, {
				secure: true,
				sameSite: 'None',
			});
			// Set admin status cookie
			res.cookie('isAdmin', foundUser.admin, {
				secure: true,
				sameSite: 'None',
			});
			// Set authorized status cookie
			res.cookie('isAuthorized', true, {
				secure: true,
				sameSite: 'None',
			});

			// Return the user's data
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

		// Check if first_name, last_name, email or password is missing
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

		if (!savedUser) {
			return res.status(400).json({
				error: 'Error saving user: ' + err.message,
			});
		}

		console.log('saved user');
		// Set name cookie
		res.cookie('fullName', newUser.getFullName(), {
			secure: true,
			sameSite: 'None',
		});
		// Set email cookie
		res.cookie('email', newUser.email, {
			secure: true,
			sameSite: 'None',
		});
		// Set admin status cookie
		res.cookie('isAdmin', newUser.admin, {
			secure: true,
			sameSite: 'None',
		});
		// Set authorized status cookie
		res.cookie('isAuthorized', true, {
			secure: true,
			sameSite: 'None',
		});
		// Set hasBusiness cookie
		res.cookie('hasBusiness', false, {
			secure: true,
			sameSite: 'None',
		});

		return res.status(201).json(savedUser);
	} catch (err) {
		res.status(400).json({
			error: 'Error creating user: ' + err.message,
		});
	}
});

// @route   POST /api/auth/logout
// @desc    Log out
// @access  Public (no auth yet)
router.post('/logout', async (req, res) => {
	try {
		// Clear cookies
		res.clearCookie('fullName', {
			secure: true,
			sameSite: 'None',
		});
		res.clearCookie('email', {
			secure: true,
			sameSite: 'None',
		});
		res.clearCookie('isAdmin', {
			secure: true,
			sameSite: 'None',
		});
		res.clearCookie('isAuthorized', {
			secure: true,
			sameSite: 'None',
		});

		// Send response
		res
			.status(200)
			.json({ message: 'Logged out successfully' });
	} catch (err) {
		res.status(400).json({
			error: 'Error logging out: ' + err.message,
		});
	}
});

// @route   POST /api/auth/edit-login
// @desc    Change email or password
// @access  Public (no auth yet)
router.post('/edit-login', async (req, res) => {
	try {
		console.log('req.body.credential:', req.body.credType);
		console.log('req.cookies.email:', req.cookies.email);
		console.log('req.body.newCred', req.body.newCred);

		const credType = req.body.credType;
		const currentEmail = req.cookies.email;
		const newCred = req.body.newCred;
		var updatedUser;

		if (credType === 'email') {
			console.log('credType is email');

			updatedUser = await User.findOneAndUpdate(
				{ email: currentEmail },
				{ $set: { email: newCred } },
				{ new: true }
			);

			if (updatedUser.email === newCred) {
				// Update the email cookie
				res.cookie('email', newCred, {
					secure: true,
					sameSite: 'None',
				});

				// Send response
				res.status(200).json({
					message: 'Email changed successfully',
				});
			} else {
				res
					.status(400)
					.json({ error: 'Error saving email' });
			}
		} else if (credType === 'password') {
			console.log('credType is password');

			updatedUser = await User.findOneAndUpdate(
				{ email: currentEmail },
				{ $set: { password: newCred } },
				{ new: true }
			);

			if (updatedUser.password === newCred) {
				// Send response
				res.status(200).json({
					message: 'Password changed successfully',
				});
			} else {
				res
					.status(400)
					.json({ error: 'Error saving password' });
			}
		} else {
			res
				.status(400)
				.json({ error: 'Credential cannot be changed' });
		}
	} catch (err) {
		res.status(400).json({
			error: 'Error changing login info: ' + err.message,
		});
	}
});

module.exports = router;
