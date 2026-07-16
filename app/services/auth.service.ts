import { authRepository } from '../repositories/auth.repository';
import { authValidator } from '../validators/auth.validator';
import bcrypt from 'bcrypt';

export const authService = {
  async register(data: unknown): Promise<unknown> {
    // 1. Validate request payload
    const validatedData = authValidator.validateRegister(data);

    // 2. Check if email already exists
    const existingUser = await authRepository.findByEmail(validatedData.email);
    if (existingUser) {
      const error = new Error('An account with this email address already exists') as Error & { status?: number };
      error.status = 409;
      throw error;
    }

    // 3. Hash password using bcrypt
    const passwordHash = await bcrypt.hash(validatedData.password, 10);

    // 4. Create user
    const newUser = await authRepository.createUser({
      name: validatedData.name,
      email: validatedData.email,
      passwordHash,
    });

    // 5. Exclude password hash from returned object using destructuring with underscore prefix for unused var
    const { password: _password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async login(data: unknown): Promise<unknown> {
    // 1. Validate request payload
    const validatedData = authValidator.validateLogin(data);

    // 2. Find user by email
    const user = await authRepository.findByEmail(validatedData.email);
    if (!user) {
      const error = new Error('Invalid email or password combination') as Error & { status?: number };
      error.status = 401;
      throw error;
    }

    // 3. Compare password hash
    const isPasswordCorrect = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error('Invalid email or password combination') as Error & { status?: number };
      error.status = 401;
      throw error;
    }

    // 4. Exclude password hash from returned object using destructuring with underscore prefix for unused var
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};
