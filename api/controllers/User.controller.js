import UserModel, { USER_ROLES } from "../models/User.model.js";

export async function getDelivery(req, res) {
  try {
    const users = await UserModel.find({ roles: "delivery" }).select(
      "-password",
    );
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateUserRoles(req, res) {
  try {
    const { roles } = req.body;

    if (!Array.isArray(roles) || roles.some((r) => !USER_ROLES.includes(r))) {
      return res.status(400).json({ error: "Invalid roles" });
    }

    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { roles },
      { new: true },
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
