const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const hasRole = roles.some((role) => req.user.roles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ error: "Not authorized" });
    }

    next();
  };

export default restrictTo;
