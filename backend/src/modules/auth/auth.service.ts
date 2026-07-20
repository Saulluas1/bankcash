// TODO: Implement registration and login logic
// Dependencies: AppDataSource, bcryptjs, jsonwebtoken, User entity

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export class AuthService {
  async register(_dto: RegisterDto): Promise<{ token: string }> {
    // TODO:
    // 1. Check if user with email already exists
    // 2. Hash password with bcrypt
    // 3. Create and save new User entity
    // 4. Generate JWT token
    // 5. Return token
    throw new Error('Not implemented');
  }

  async login(_dto: LoginDto): Promise<{ token: string }> {
    // TODO:
    // 1. Find user by email
    // 2. Compare password with bcrypt
    // 3. Generate JWT token
    // 4. Return token
    throw new Error('Not implemented');
  }
}
