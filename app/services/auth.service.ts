import { authRepository } from '../repositories/auth.repository';
import { authValidator } from '../validators/auth.validator';
import bcrypt from 'bcrypt';
import { measureSpan } from '../lib/perf-logger';

export const authService = {
  async register(data: unknown): Promise<unknown> {
    return measureSpan('SERVICE', 'authService.register', async () => {
      // 1. Validate request payload
      const validatedData = authValidator.validateRegister(data);

      // 2. Check if email already exists
      const existingUser = await authRepository.findByEmail(validatedData.email);
      if (existingUser) {
        const error = new Error('An account with this email address already exists') as Error & { status?: number };
        error.status = 409;
        throw error;
      }

      // 2.1. Check Employee ID validity for Instructors/Admins
      const rawRole = (data as any)?.role;
      const role = rawRole === 'ADMIN' || rawRole === 'admin' ? 'ADMIN' : 'MEMBER';
      const employeeId = (data as any)?.employeeId;

      if (role === 'ADMIN') {
        if (!employeeId) {
          const error = new Error('Employee ID is required for instructor signup') as Error & { status?: number };
          error.status = 400;
          throw error;
        }

        const VALID_EMPLOYEE_IDS = ['EMP-001', 'EMP-002', 'EMP-003', 'EMP-004', 'EMP-005', 'EMP-006', 'EMP-007', 'EMP-008', 'EMP-009', 'EMP-010', 'EMP-12345', 'EMP-67890'];
        if (!VALID_EMPLOYEE_IDS.includes(employeeId)) {
          const error = new Error('This is not a valid Employee ID') as Error & { status?: number };
          error.status = 400;
          throw error;
        }

        const existingEmployee = await authRepository.findByEmployeeId(employeeId);
        if (existingEmployee) {
          const error = new Error('An account with this Employee ID already exists') as Error & { status?: number };
          error.status = 409;
          throw error;
        }
      }

      // 3. Hash password using bcrypt
      const hashStart = performance.now();
      const passwordHash = await bcrypt.hash(validatedData.password, 10);
      console.log(`[PERF_LOG] [AUTH] bcrypt.hash duration - ${(performance.now() - hashStart).toFixed(2)}ms`);

      // 4. Create user
      const newUser = await authRepository.createUser({
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        role,
        employeeId: role === 'ADMIN' ? employeeId : undefined,
        gender: (data as any)?.gender,
        age: validatedData.age,
      });

      const { password: _password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    });
  },

  async login(data: unknown): Promise<unknown> {
    return measureSpan('SERVICE', 'authService.login', async () => {
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
      const compareStart = performance.now();
      const isPasswordCorrect = await bcrypt.compare(validatedData.password, user.password);
      console.log(`[PERF_LOG] [AUTH] bcrypt.compare duration - ${(performance.now() - compareStart).toFixed(2)}ms`);

      if (!isPasswordCorrect) {
        const error = new Error('Invalid email or password combination') as Error & { status?: number };
        error.status = 401;
        throw error;
      }

      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  },
};
