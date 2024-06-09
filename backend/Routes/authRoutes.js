
const router = require('express').Router(); // Assuming you have Express installed
const {userController,logInController, testController, forgatPasswordController} = require('../controllers/userController');
const {requireSignIn, isAdmin} = require('../middleware/middlewere');

// ... other route definitions ...

router.post('/register', userController); // Register route
router.post('/login', logInController); // Login route
router.post('/forgat', forgatPasswordController)
router.get('/test', requireSignIn , isAdmin ,testController);//test middleware

module.exports = router; // Export the router object
