// This file will generate a JWT_SECRET key in the console
// The JWT_SECRET key is necessary for the cookie

/*  Run this file in the command line using node
 *      For example: node .\path\to\file\get-JWT-SECRET.js
 *  Copy the key and add it to your .env file as: JWT_SECRET=your_secret_key_here
 *      Note: do not surround the key in quotation marks
 */

const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);
