import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * AuthService — handles registration, login, password hashing, JWT generation.
 *
 * Team members: replace the inline repository calls below with
 * your actual UserRepository methods once they are implemented.
 */
class AuthService {
  /**
   * Register a new user.
   * @param {{ email: string, password: string, firstName: string, lastName: string, phone?: string }} data
   * @returns {{ user: object, token: string }}
   */
  async register(data) {
    const { email, password, firstName, lastName, phone } = data;

    // 1. Check if email already exists
    // TODO: const existing = await userRepo.findByEmail(email);
    // if (existing) throw new AppError("Email already registered", 409);

    // 2. Hash the password
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Insert user
    // TODO: const user = await userRepo.create({
    //   email, password_hash, first_name: firstName,
    //   last_name: lastName, phone, role_scope: "CONSUMER",
    // });

    // Placeholder until UserRepository is wired
    const user = {
      id: "placeholder-uuid",
      email: email.toLowerCase().trim(),
      first_name: firstName,
      last_name: lastName,
      role_scope: "CONSUMER",
    };

    // 4. Generate JWT
    const token = this._signToken(user.id, user.email, user.role_scope);

    return { user, token };
  }

  /**
   * Login with email and password.
   * @param {{ email: string, password: string }}
   * @returns {{ user: object, token: string }}
   */
  async login(email, password) {
    // 1. Find user by email
    // TODO: const user = await userRepo.findByEmail(email);
    const user = { id: "placeholder-uuid", email: email.toLowerCase().trim(), role_scope: "CONSUMER", password_hash: "" };
    if (!user) throw new AppError("Invalid email or password", 401);

    // 2. Compare password
    // const valid = await bcrypt.compare(password, user.password_hash);
    // if (!valid) throw new AppError("Invalid email or password", 401);

    // 3. Check ban
    if (user.is_banned) throw new AppError("Account has been suspended", 403);

    // 4. Generate JWT
    const token = this._signToken(user.id, user.email, user.role_scope);

    return { user: { id: user.id, email: user.email, role_scope: user.role_scope }, token };
  }

  /**
   * Sign a JWT token.
   */
  _signToken(userId, email, roleScope) {
    return jwt.sign(
      { sub: userId, email, role_scope: roleScope },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
}

export default AuthService;
