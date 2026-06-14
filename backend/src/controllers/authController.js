export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }
  // TODO: query user from DB, compare password hash, return JWT
  return res.status(501).json({ success: false, message: "Not implemented" });
}

export async function register(req, res) {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }
  // TODO: hash password, insert user, return JWT
  return res.status(501).json({ success: false, message: "Not implemented" });
}
