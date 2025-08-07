import mongoose from "mongoose"
import { DB_NAME } from "../constants"

export async function dbConnect () {
    try {
        const db =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("Database connected Successfully !!",db.connection.host);

    } catch (error) {
        console.error("ERR :", err);
    }
}

export default dbConnect