const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

// Register User
exports.registerUser = async (req, res) => {
    const { name, phoneno, email, password, isAdmin } = req.body;
    if (!name || !phoneno || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingUser = await userModel.findOne({ $or: [{ email }, { phoneno }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email or phone number already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name,
            phoneno,
            email,
            password: hashPassword,
            isAdmin
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// User Login
exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid Email" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Send OTP
exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }

        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        existingUser.otp = otp;
        existingUser.otpExpiration = Date.now() + parseInt(process.env.OTP_EXPIRATION);

        await existingUser.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            port: 587,
            secure: true,
            auth: {
                user: 'parvathi991992@gmail.com',
                pass: 'stxn fklr ipiu dupi'
            },
            tls: {
                rejectUnauthorized: false,
            },
        
        });

        const mailOptions = {
            from: 'parvathi991992@gmail.com',
            to: email,
            subject: 'Your OTP for Reset password',
            html: `<h1>Your login OTP is: </h1><h2>${otp}</h2>`,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending OTP', error });
            }
            res.status(200).json({ message: 'OTP sent successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Reset Password
exports.resetPassword=async(req, res)=>{
    const {otp, newPassword}= req.body;
    if(!otp || !newPassword){
        return res.status(400).json({message:"All fields are required"});
    }
    try{
        const existingUser = await userModel.findOne({otp});
        if(!existingUser){
            return res.status(400).json({message:"Invalid otp"});
        }
        const isExpired = existingUser.otpExpiration < Date.now();
        if (isExpired) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        existingUser.password = hashPassword;
        existingUser.otp=null;
        existingUser.otpExpiration=null;
        await existingUser.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    }
    catch(error){
        console.error('Error resetting password', error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Get all users
exports.getUsers= async (req, res)=>{
    try{
        const users = await userModel.find({isAdmin:false});
        res.status(200).json(users);
    }
    catch(error){
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
}

// delete user
exports.deleteUser = async (req, res)=>{
    const id= req.params.id;
    try{
        const user =await userModel.findByIdAndDelete(id);
        if(!user){
            res.status(404).json({message:"User not found"});
        }
        res.status(200).json({message:"User deleted successfully"});
    }
    catch(error){
        res.status(500).json({message:"Server Error"});
        console.error(error);
    }
}