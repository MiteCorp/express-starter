import { Request } from "express";
import { users } from "@prisma/client";

export interface RequestAuth extends Request {
    user: users;
}