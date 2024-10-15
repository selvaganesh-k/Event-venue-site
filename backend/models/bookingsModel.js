const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    ticketType: {
        type: String,
        required: [true, 'Ticket type is required'],
    },
    ticketRate: {
        type: Number,
        required: [true, 'Ticket rate is required'],
    },
    numTickets: {
        type: Number,
        required: [true, 'Number of tickets is required'],
        min: [1, 'At least one ticket must be booked'],
        max: [10, 'Cannot book more than 10 tickets at once'],
    },
    concertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Concert',
        required: [true, 'Concert reference is required'],
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Booking', bookingSchema);
