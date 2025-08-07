import { Router } from "express";

const router = Router();

router.route("/register").post("RegisterController")
router.route("/login").post("LoginConntroller")
router.route("/create").post("CreateController")
router.route("/read").get("ReadController")
router.route("/update").patch("updateController")
router.route("/delete").delete("deleteController")

export default router