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
    const { page = 1, limit = 10, search, role } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {};
    if (search)
      filter.$or = [
        { username: new RegExp(search, "i") },
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
      ];
    if (role) filter.roles = role;

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .select("-password"),
      UserModel.countDocuments(filter),
    ]);

    res.status(200).json({
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
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
