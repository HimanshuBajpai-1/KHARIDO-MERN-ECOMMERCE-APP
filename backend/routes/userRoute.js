const express =require('express');
const { userRegister, userLogin, userLogout, forgotPassword, resetPassword, getUserdetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateProfileRoleByAdmin, removeProfileAdmin } = require('../controllers/userController');
const router = express.Router();
const {isAuthenticated,authorizedRole} = require('../middleware/auth')


// Register a new User
router.post('/register',userRegister);

// login User
router.post('/login',userLogin);

// logout User
router.get('/logout',userLogout)

// forgot Password
router.put('/password/forgot',forgotPassword)

// reset Password
router.put('/password/reset/:token',resetPassword);

// get user details
router.get('/me',isAuthenticated,getUserdetails);

// update user Password
router.put('/password/update',isAuthenticated,updatePassword)

// update user Profile
router.put('/me/update',isAuthenticated,updateProfile)

// get all users -- admin
router.get('/admin/users',isAuthenticated,authorizedRole("Admin"),getAllUsers);

// get single User -- admin
router.get('/admin/user/:id',isAuthenticated,authorizedRole("Admin"),getSingleUser);

// update User Profile/role -- admin
router.put('/admin/user/:id',isAuthenticated,authorizedRole("Admin"),updateProfileRoleByAdmin);

// delete user -- admin
router.delete('/admin/user/:id',isAuthenticated,authorizedRole("Admin"),removeProfileAdmin);

module.exports = router;