import dbConnect from "../lib/dbConnect";
import { UserEvent } from "../models/event.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse, apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler";

const readEvent = asyncHandler(async(req, res) => {
    await dbConnect()

    const userID = req.user._id

    if(!userID) {
        throw new ApiError(403,null,"Unauthorized User")
    }

    const events = await UserEvent.find({userId: userID}).sort({startDate: 1}) //Just sorting the events from start date
   
    return res.status(200).json(
        new ApiResponse(
            200,
            events,
            "Events Fetched Successfully"
        )
    )


})

const createEvent = asyncHandler(async(req, res) => {

    await dbConnect();

    const {title, description, startDate, endDate} = req.body;

    if(!title || !description || !startDate || !endDate) {
        throw new ApiError(400,null,"Please enter all fields" )
    }

    const userID = req.user._id;

    if(!userID) {
        throw new ApiError(401,null,"User not Authenticated")
    }

    const eventCreated = await UserEvent.create({title,description,startDate,endDate, userId: userID})
    

    return res.status(201).json(
    new apiResponse(201, {
        eventCreated,
    }, "Event Created Successfully")
    );
})

const updateEvent = asyncHandler(async(req, res) => {

    await dbConnect();

    const {title, description, startDate, endDate} = req.body

    if(!title || !description || !startDate || !endDate) {
        throw new ApiError(400,null,"Please enter all fields" )
    }

    if(startDate > endDate) {
        throw new ApiError(403,null,"Please select a valid Date")
    }

    const eventID = req.params.id //I have fetched eventID from the params as i wanted to know 

    if(!eventID) {
        throw new ApiError(401,null,"User is Unauthorized")
    }


    const event = await UserEvent.findById(eventID)


    if (event.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403,null,"User is Unauthorized")
    }

    const update = {title,description,startDate,endDate}

    const updatedEvent = await UserEvent.findByIdAndUpdate(eventID, update,{new: true})

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedEvent,
            "Event Updated Sucessfully"
        )
    )
})

const deleteEvent = asyncHandler(async(req, res) => {
    await dbConnect();

    const eventID = req.params.id

    if(!eventID) {
        throw new ApiError(404,null,"Event Not Found")
    }

    const event = await UserEvent.findById(eventID) //Fetchinng the event from the db based on id

    if(!event) {
        throw new ApiError(404,null,"Event not found")
    }

    if(event.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403,null,"User Unauthorized")
    }

    await UserEvent.findByIdAndDelete(eventID);

    return res.status(200).json(
        new ApiResponse(200,null,"Event Deleted Successfully")
    )


})

export {readEvent,createEvent, updateEvent, deleteEvent}
