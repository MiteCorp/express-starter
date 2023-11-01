import auth from "../app/middleware/authenticate";
import AuthController from "../app/controllers/auth.controller";
import express from "express"

const router = express.Router()

router
    .route("/login")
    .post(AuthController.validate("login"), AuthController.login)

router
    .route("/register")
    .post(AuthController.validate("register"), AuthController.register)

router
    .route("/me")
    .get(auth, AuthController.profile)

export default router