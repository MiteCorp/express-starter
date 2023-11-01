import { UploadedFile } from "express-fileupload";
import Controller from "..";
import { RequestAuth } from "../../types/request";
import { Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

class UploadController extends Controller {
  static store = this.asyncHandler(
    async (
      req: RequestAuth & { files: any },
      res: Response,
      next: NextFunction
    ) => {
      const { file } = req.files as { file: UploadedFile };

      if (!file) {
        return next(
          new this.sendError("Please upload a file", [], "PROCESS_ERROR")
        );
      }

      let name = file.name.replace(/\s/g, "-").toLowerCase();

      const pathName = path.join(
        __dirname,
        `../../public/uploads/${req.user?.id}/`
      );

      if (!fs.existsSync(pathName)) {
        fs.mkdirSync(pathName, { recursive: true });
      }

      let i: number = 0;
      while (fs.existsSync(`${pathName}${name}`)) {
        i++;
        name = `${i}-${name}`;
      }

      file.mv(`${pathName}${name}`, (err: any) => {
        if (err) {
          return next(new this.sendError(err.message, [], "PROCESS_ERROR"));
        }
      });

      return res.json(
        new this.sendResponse(
          {
            name: name,
            url: `${req.protocol}://${req.get("host")}/public/uploads/${
              req.user?.id
            }/${name}`,
          },
          "Image uploaded successfully"
        )
      );
    }
  );
}

export default UploadController;
