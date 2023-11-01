import { NextFunction, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler";
import { PrismaClient } from "@prisma/client";
import { RequestAuth } from "../../types/request";
import { sendError } from "../../libraries/rest";

const prisma = new PrismaClient();

const auth = asyncHandler(
  async (
    req: RequestAuth & { token: string },
    res: Response,
    next: NextFunction
  ) => {
    let token: string | undefined = undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(
        new sendError(
          "Please login before doing this action!",
          [],
          "UNAUTHORIZED"
        )
      );
    }

    if (token.split(".").length !== 3) {
      return next(
        new sendError(
          "Please login before doing this action!",
          [],
          "UNAUTHORIZED"
        )
      );
    }

    try {
      const decoded = jsonwebtoken.verify(
        token,
        process.env.JWT_SECRET || ""
      ) as { id: number };

      if (!decoded.id) {
        return next(
          new sendError(
            "Please login before doing this action!",
            [],
            "UNAUTHORIZED"
          )
        );
      }

      const user: any = await prisma.users.findFirst({
        where: {
          id: decoded.id,
        },
      });

      if (!user) {
        return next(
          new sendError(
            "Please login before doing this action!",
            [],
            "UNAUTHORIZED"
          )
        );
      }

      delete user.password;
      req.user = user;
      req.token = token;

      next();
    } catch (error) {
      return next(
        new sendError(
          "Please login before doing this action!",
          [],
          "UNAUTHORIZED"
        )
      );
    }
  }
);

export default auth;
