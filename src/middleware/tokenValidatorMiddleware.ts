

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { StatusCode, UserDataType } from "../types";
import authModel from "../models/authModel";
import { errRes } from "../utils/helperFunctions";



const tokenValidator = async (req: Request, res: Response, next: NextFunction) => {

  // ### get user's id from params
  const { id } = req.params;


  // #### if id is not present
  if (!id) {
    return next(errRes("No ID found! Please provide USER ID", StatusCode.BAD_REQUEST));
  }



  // ##### get token
  const token: string = req.cookies.token || req.headers.authorization?.split(" ")[1];



  // #### if token isnt there
  if (!token) {
    return next(errRes("No TOKEN found!", StatusCode.UNAUTHORIZED));
  }


  let userId: string;


  try {

    // #### if token is present then get userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;

    userId = decoded.userId;

  } catch (err) {

    // #### return error if token is invalid

    return next(errRes("Invalid token!", StatusCode.UNAUTHORIZED ));

  }


  // #### invalid token check
  if (!userId) {
    return next(errRes("Invalid token!", StatusCode.UNAUTHORIZED));
  }


  // #### GET user details from userId
  const val: UserDataType = await authModel.findUserById(userId);


  if (!val) {
    return next(errRes("User not found!", StatusCode.UNAUTHORIZED));
  }



  // #### compare id with userId given by user

  if (val.id !== id) {

    return next(errRes("Unauthorized access!", StatusCode.UNAUTHORIZED));

  } else {

    req.user = val;

    next();
  }

}

export default tokenValidator;
