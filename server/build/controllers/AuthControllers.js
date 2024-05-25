import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();
const SECRET = process.env.SECRET;
export const registerUser = async (req, res) => {
    try {
        const findUser = await User.findOne({ email: req.params.email });
        if (findUser) {
            res.status(400).json({
                message: "Такой пользователь уже зарегестрирован",
            });
            return;
        }
        /* HASH PASSWORD */
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const doc = new User({
            login: req.body.login,
            password: hashPassword,
        });
        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id,
        }, SECRET, {
            expiresIn: "30d",
        });
        const userData = user.toObject();
        res.json({ ...userData, token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось зарегестрироваться",
        });
    }
};
export const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ login: req.body.login });
        if (!user) {
            res.status(404).json({
                message: "Неверный логин или пароль",
            });
            return;
        }
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) {
            res.status(400).json({ message: "Неверный логин или пароль" });
            return;
        }
        const token = jwt.sign({
            _id: user._id,
        }, SECRET, { expiresIn: "30d" });
        const { password, ...userData } = user.toObject();
        res.status(200).json({ ...userData, token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось зарегестрироваться",
        });
    }
};
// export const authUser = async (req, res) => {
//   try {
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Не удалось зарегестрироваться",
//     });
//   }
// };
//# sourceMappingURL=AuthControllers.js.map