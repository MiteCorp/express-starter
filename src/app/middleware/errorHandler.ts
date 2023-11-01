import fs from "fs";

const errorHandler = async (err: any, req: any, res: any, next: any) => {
  const message_error: string =
    "=====================================" +
    "\n" +
    "Date: " +
    new Date() +
    "\n" +
    "=====================================" +
    "\n" +
    "Error Code: " +
    err.error?.error_code +
    "\n" +
    "Error Message: " +
    err.message +
    "\n" +
    "Error Data:" +
    " \r" +
    err.stack +
    " \r" +
    "\n" +
    "=====================================" +
    "\n";

  try {
    if (typeof err !== "undefined" && err.error?.error_code == "NOT_MEMBER") {
      return res.status(401).json({
        success: false,
        message: err.message || "Not Found",
        data: err.data || null,
        error: {
          error_code: err.error?.error_code || "NOT_FOUND",
          error_data: err.error_data || null,
        },
      });
    }

    if (typeof err !== "undefined" && err.error?.error_code == "NOT_FOUND") {
      return res.status(err.status || 404).json({
        success: false,
        message: err.message || "Not Found",
        data: err.data || null,
        error: {
          error_code: err.error?.error_code || "NOT_FOUND",
          error_data: err.error_data || null,
        },
      });
    }

    if (
      typeof err !== "undefined" &&
      err.error?.error_code == "VALIDATION_ERROR"
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
      let error_validation: any = {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      err.error.error_data.forEach((element: any) => {
        error_validation[element.path] = [element.msg];
      });
      return res.status(err.status || 400).json({
        success: false,
        message: err.message || "Something went wrong",
        data: err.data || null,
        error: {
          error_code: err.error?.error_code || "PROCESS_ERROR",
          error_data: error_validation || null,
        },
      });
    }

    if (
      typeof err !== "undefined" &&
      err.error?.error_code == "PROCESS_ERROR"
    ) {
      return res.status(err.status || 400).json({
        success: false,
        message: err.message || "Something went wrong",
        data: err.data || null,
        error: {
          error_code: err.error?.error_code || "PROCESS_ERROR",
          error_data: err.error_data || null,
        },
      });
    }

    const errorCodeArray = [
      "PROCESS_ERROR",
      "VALIDATION_ERROR",
      "NOT_FOUND",
      "UNAUTHORIZED",
    ];
    if (
      typeof err !== "undefined" &&
      !errorCodeArray.includes(err.error?.error_code)
    ) {
      fs.appendFile("logs/error.log", message_error, function (err: any) {
        if (err) throw err;
      });
    }

    return res.status(err.status || 400).json({
      success: false,
      message: err.message || "Something went wrong",
      data: err.data || null,
      error: {
        error_code: err.error?.error_code || "PROCESS_ERROR",
        error_data: err.error_data || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      data: null,
      error: {
        error_code: "SERVER_ERROR",
        error_data: null,
      },
    });
  }
};

export default errorHandler;
