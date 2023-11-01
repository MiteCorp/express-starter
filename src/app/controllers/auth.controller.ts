import { NextFunction, Response } from "express";
import Controller from "..";
import { RequestAuth } from "../../types/request";
import { body, validationResult } from "express-validator";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const salt = bcryptjs.genSaltSync(10);

class AuthController extends Controller {
  static login = this.asyncHandler(
    async (req: RequestAuth, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          new this.sendError(
            errors.array()[0].msg,
            errors.array(),
            "VALIDATION_ERROR"
          )
        );
      }

      const { email, password } = req.body;

      const user = await this.prisma.users.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        return next(
          new this.sendError("Email or password is wrong!", [], "PROCESS_ERROR")
        );
      }

      const isMatch = bcryptjs.compareSync(password, user.password);
      if (!isMatch) {
        return next(
          new this.sendError("Email or password is wrong!", [], "PROCESS_ERROR")
        );
      }

      const token = jsonwebtoken.sign(
        { id: user.id },
        process.env.JWT_SECRET || "",
        {
          expiresIn: Number(process.env.JWT_EXPIRE) || 3600,
        }
      );

      return res.json(
        new this.sendResponse(
          {
            token,
            token_type: "Bearer",
            expires_in: Number(process.env.JWT_EXPIRE) || 3600,
            user: user,
          },
          "Login success!"
        )
      );
    }
  );

  static register = this.asyncHandler(
    async (req: RequestAuth, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          new this.sendError(
            errors.array()[0].msg,
            errors.array(),
            "VALIDATION_ERROR"
          )
        );
      }

      const { email, password, name } = req.body;

      const user = await this.prisma.users.findFirst({
        where: {
          email,
        },
      });

      if (user) {
        return next(
          new this.sendError("Email already registered!", [], "PROCESS_ERROR")
        );
      }

      const hash = bcryptjs.hashSync(password, salt);

      const newUser = await this.prisma.users.create({
        data: {
          email,
          password: hash,
          name,
        },
      });

      const token = jsonwebtoken.sign(
        { id: newUser.id },
        process.env.JWT_SECRET || "",
        {
          expiresIn: Number(process.env.JWT_EXPIRE) || 3600,
        }
      );

      return res.json(
        new this.sendResponse(
          {
            token,
            token_type: "Bearer",
            expires_in: Number(process.env.JWT_EXPIRE) || 3600,
            user: newUser,
          },
          "Register success!"
        )
      );
    }
  );

  static profile = this.asyncHandler(
    async (req: RequestAuth, res: Response, next: NextFunction) => {
      return res.json(new this.sendResponse(req.user, "Success getting data"));
    }
  );

  static validate = (method: string) => {
    switch (method) {
      case "login": {
        return [
          body("email", "Email is required").exists().isEmail(),
          body("password", "Password is required").exists().isString(),
        ];
      }

      case "register": {
        return [
          body("email", "Email is required").exists().isEmail(),
          body("password", "Password is required").exists().isString(),
          body("name", "Name is required").exists().isString(),
        ];
      }

      default: {
        return [];
      }
    }
  };
}

export default AuthController;
