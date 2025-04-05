import express, { Router } from "express";
import authController from "../controllers/authControllers";
import tokenValidator from "../middleware/tokenValidatorMiddleware";


class AuthRouter {

    public router: Router = express.Router();

    constructor() {


        this.router.post("/sign-in", authController.signIn );

        
        this.router.post("/sign-up", authController.signUp );


        this.router.get("/sign-out", tokenValidator, );


        this.router.patch("/update-user", tokenValidator, authController.updateUser );


        this.router.delete("/delete-user", tokenValidator, authController.deleteUser );

    }

}

const authRouter = new AuthRouter();

export default authRouter.router;