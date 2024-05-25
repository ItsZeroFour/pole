import express from "express";
import { loginUser, registerUser } from "../controllers/AuthControllers.ts";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get("/me", authUser);
export default router;
//# sourceMappingURL=auth.js.map