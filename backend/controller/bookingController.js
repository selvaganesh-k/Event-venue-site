const Booking = require('../models/bookingsModel');

exports.createBooking = async (req, res) => {
  const { name, email, ticketType, ticketRate, numTickets, concertId } = req.body;

  try {
    const newBooking = new Booking({
      name,
      email,
      ticketType,
      ticketRate,
      numTickets,
      concertId,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking successful!', booking: newBooking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
