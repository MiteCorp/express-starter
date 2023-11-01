import asyncHandler from "./middleware/asyncHandler";
import { PrismaClient } from "@prisma/client";
import { sendError, sendResponse } from "../libraries/rest";

class Controller {
    static sendResponse = sendResponse;
    static sendError = sendError;
    static asyncHandler = asyncHandler;
    static prisma = new PrismaClient();
}

export default Controller