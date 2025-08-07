import dbConnect from "../lib/dbConnect.js";
import { User } from "../models/user.model.js";
import userEvent from "../models/event.model.js"
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import bcrypt from "bcryptjs";

const registerUser = asyncHandler( async(req, res) => {
    //TODO: Hash the Refresh Token for further Security

    await dbConnect();

    const {username, email, password} = req.body;

    const existingUserByUsername = await User.findOne({
        username
    });

    const existingUserByEmail = await User.findOne({
        email
    })



    if (existingUserByUsername) {
        console.log("This Username is Already Taken. Please Choose Another one")
        return res.status(400).json({ message: "Username already taken" });
    }

    if (existingUserByEmail) {
        return res.status(200).json({message: "You have already Registered, Please Login"})
        //redirect the user to login Page
    }
    
        //Add the token by using any Algo

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const safeUser = await User.findById(newUser._id).select("-password");

        return res.status(201).json(
            new apiResponse(200, safeUser, "User registered Successfully")
        )
})

const loginUser = asyncHandler( async(req, res) => {
    await dbConnect();

    const {username, password} = req.body;

    if (!username || !password) {
        throw new Error("Please Enter Username and Password");
    }

    const existingUser = await User.findOne({username});

    if(!existingUser) {
        throw new Error("User does not exist. Please Register or Try again")
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
        throw new Error("Invalid Credentials");
    }

    //TODO Generate a Refresh Token and provide it to the User
    const accessToken = jwt.sign({ id: existingUser._id }, process.env.ACCESS_SECRET, { expiresIn: '15m' });


    //Remove Password and send it to the Database
    const loggedInUser = await User.findById(existingUser._id).select("-password")


    return res.status(200).json(
    new apiResponse(200, {
        user: loggedInUser,
        accessToken,
    }, "User Logged In Successfully")
    );

})


export {registerUser, loginUser}