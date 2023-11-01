import AuthRoutes from "./auth.routes";
import express from "express";
import UploadController from "../app/controllers/upload.controller";

const router = express.Router();

router.use("/auth", AuthRoutes);
router.route("/upload").post(UploadController.store);

export default router;
