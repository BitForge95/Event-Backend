import dotenv from "dotenv"
import dbConnect from "./lib/dbConnect";
import { app } from "./app";
dotenv.config({
    path: './.env'
})

dbConnect()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Listening on PORT ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
