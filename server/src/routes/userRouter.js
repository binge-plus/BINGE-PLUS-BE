import { Router } from "express";

import { userAdder } from "../controllers/users/addController.js";
import { addReview } from "../controllers/users/reviewController.js";

const userRouter = Router();

userRouter.post("/add", userAdder);
userRouter.post("/:username/:type/:id/review", addReview); 

export default userRouter;
