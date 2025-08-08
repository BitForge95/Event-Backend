import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller";
import { createEvent, deleteEvent, readEvent, updateEvent } from "../controllers/event.controller";

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/create").post(createEvent)
router.route("/read").get(readEvent)
router.route("/update").patch(updateEvent)
router.route("/delete").delete(deleteEvent)

export default router