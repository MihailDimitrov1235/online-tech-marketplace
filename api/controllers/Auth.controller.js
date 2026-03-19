import jwt from "jsonwebtoken";
import UserModel from "../models/User.model.js";

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP_TIME | "7d",
  });
}

export async function authRegister(req, res, next) {
  try {
    const { username, password, firstName, lastName } = req.body;
    const user = await UserModel.create({ username, password, firstName, lastName });

    res.status(201).json({ user, token: signToken(user._id) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function authLogin(req, res) {
 try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ user, token: signToken(user._id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
