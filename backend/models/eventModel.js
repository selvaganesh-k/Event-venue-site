const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
  concertName: {
    type: String,
    required: [true, 'Concert name is required'],
    minlength: [3, 'Concert name must be at least 3 characters long'],
  },
  artists: {
    type: String,
    required: [true, 'Artists field is required'],
  },
  eventDateTime: {
    type: Date,
    required: [true, 'Date and time are required'],
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  ticketType: {
    type: [String],
    enum: ['General', 'VIP'],
  },
  totalTickets: {
    type: Number,
    required: [true, 'Total selling tickets are required'],
    min: [1, 'At least 1 ticket should be available for sale'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function (value) {
        return value < this.eventDateTime;
      },
      message: 'End date must be after the event start date',
    },
  },
  organizer: {
    type: String,
    required: [true, 'Organizer name is required'],
  },
  organizerContact: {
    type: String,
    required: [true, 'Organizer contact is required'],
    validate: {
      validator: function (value) {
        return /^\d{10}$/.test(value);
      },
      message: 'Contact number must be a valid 10-digit number',
    },
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model('Concert', concertSchema);

