import express from "express";
import { authUser, loginUser, registerUser } from "../controllers/AuthControllers.js";
import checkAuth from "../utils/checkAuth.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", checkAuth, authUser);
export default router;
//# sourceMappingURL=auth.js.map