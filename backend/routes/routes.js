const express = require('express');
const route = express.Router();
const multer = require('multer');
const cron = require('node-cron');

const storage = multer.diskStorage({
    destination:(req, file, cb)=>cb(null, 'uploads/'),
    filename:(req, file, cb)=>cb(null, Date.now()+'-'+file.originalname)
});
const upload=multer({storage});

const {registerUser, userLogin, sendOtp, resetPassword, getUsers, deleteUser} = require('../controller/userController');

route.post('/register',registerUser);
route.post('/login',userLogin);
route.post('/sendOtp',sendOtp);
route.post('/reset-password',resetPassword);
route.get('/getUsers',getUsers);
route.delete('/users/:id', deleteUser);

const{concertRegister, allConcerts, deleteConcertAtDateEnd, deleteConcert, updateConcert, getUpdateConcert} = require('../controller/concertController');
route.post('/concerts', upload.single('image'), concertRegister);
route.get('/allConcerts', allConcerts);
cron.schedule('*/15 * * * *', () => {
    console.log('Running daily task to delete expired concerts...');
    deleteConcertAtDateEnd();
});
route.delete('/concerts/:id', deleteConcert);
route.put('/concerts/:id', updateConcert);
route.get('/concerts/:id', getUpdateConcert);

const {createBooking} = require('../controller/bookingController');
route.post('/booking', createBooking);

module.exports = route;
