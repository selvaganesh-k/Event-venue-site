const concertModel = require('../models/eventModel');

// concert register
exports.concertRegister = async (req, res) => {
    const { concertName, artists, eventDateTime, venue, description, ticketType, totalTickets, endDate, organizer, organizerContact } = req.body;
    console.log(ticketType);
    try {
        const existingConcert = await concertModel.findOne({ artists: artists, eventDateTime: eventDateTime, venue: { $ne: venue } });
        if (existingConcert) {
            return res.status(400).json({ message: 'The same artist is performing on this date at a different venue.' });
        }
        const duplicateConcert = await concertModel.findOne({artists: artists, eventDateTime: eventDateTime, venue: venue });

        if (duplicateConcert) {
            return res.status(400).json({message: 'This concert has already been registered.'});
        }
        const newConcert = new concertModel({
            concertName,
            artists,
            eventDateTime,
            venue,
            description,
            ticketType: Array.isArray(ticketType) ? ticketType : [ticketType],
            totalTickets,
            endDate,
            organizer,
            organizerContact,
            image: req.file ? req.file.path : undefined

        });
        await newConcert.save();
        res.status(201).json({ message: "Concert created", new: newConcert })
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.deleteConcertAtDateEnd = async()=>{
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    try{
    const result =await concertModel.deleteMany({
        eventDateTime:{
            $lte: startOfDay
        }
    })
    console.log(`${result.deletedCount}`+'Concert Deleted');
    }
    catch(error){
        console.error('Error deleting concerts:', error);
    }
    
}

exports.allConcerts=async(req, res)=>{
    try{
        const concerts = await concertModel.find({});
        res.status(200).json(concerts);
    }
    catch(error){
        res.status(500).json({ message: "Error fetching concerts", error: error.message });
    }
}

exports.deleteConcert = async(req, res)=>{
    const id= req.params.id;
    try{
        const deleteconcert= await concertModel.findByIdAndDelete(id);
        if (!deleteconcert) {
            return res.status(404).json({ message: 'Concert not found' });
        }
        res.status(200).json({ message: 'Concert deleted successfully' });
    } catch (error) {
        console.error('Error deleting concert:', error);
        res.status(500).json({ message: 'Server error' });
    }

}

exports.updateConcert = async (req, res)=>{
    const id = req.params.id;
    const updateData = req.body;
    try{
        const updatedconcert= await concertModel.findByIdAndUpdate(id, updateData,{new:true});
        if (!updatedconcert) {
            return res.status(404).send('Concert not found');
        }
        res.status(200).json(updatedconcert);
    } catch (error) {
        console.error('Error updating concert:', error);
        res.status(500).send('Error updating concert');
    }
}

exports.getUpdateConcert = async (req, res)=>{
    const id = req.params.id;
    console.log(id)
    try{
        const getconcert = await concertModel.findById(id);
        console.log(getconcert);
        if(!getconcert){
            return res.status(404).json({ message: 'Concert not found' });
        }
        res.status(200).json(getconcert);
    }
    catch(error){
        console.error('Error get concert:', error);
        res.status(500).send('Error get concert');
    }
}