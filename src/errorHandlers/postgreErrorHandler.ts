import { DatabaseError } from "pg";
import { StatusCode } from "../types";
import ErrorHandler from "./errorHandler";


const postgreErrorHandler = (err: DatabaseError) => {

  let status: number = StatusCode.INTERNAL_SERVER_ERROR;
  let message = "Database Error";


  switch (err.code) {

    case "23505":
      status = StatusCode.CONFLICT;
      message = "Duplicate key violation";
      break;DatabaseError

    case "23503":
      status = StatusCode.NOT_FOUND;
      message = "Foreign key constraint violation";
      break;

    case "23502":
      status = StatusCode.BAD_REQUEST;
      message = "Null value violation";
      break;

    case "23514":
      status = StatusCode.BAD_REQUEST;
      message = "Check constraint violation";
      break;

    case "42601":
      status = StatusCode.BAD_REQUEST;
      message = "SQL syntax error";
      break;

    case "42883":
      status = StatusCode.BAD_REQUEST;
      message = "Function does not exist";
      break;

    case "42703":
      status = StatusCode.BAD_REQUEST;
      message = "Column does not exist";
      break;

    case "42P01":
      status = StatusCode.NOT_FOUND;
      message = "Table does not exist";
      break;

    case "53300":
      status = StatusCode.INTERNAL_SERVER_ERROR;
      message = "Too many connections. Try again later.";
      break;

  }

  return new ErrorHandler({
    status,
    message: err.message || message,
  });
};

export default postgreErrorHandler;