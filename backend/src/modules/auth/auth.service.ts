import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../../data-source';
import { User } from '../users/user.entity';
import { env } from '../../config/env';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

interface UserPayload {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthResult {
  token: string;
  user: UserPayload;
}

export class AuthService {
  async register(dto: RegisterDto): Promise<AuthResult> {
    const userRepo = AppDataSource.getRepository(User);

    const existing = await userRepo.findOneBy({ email: dto.email });
    if (existing) {
      const err = Object.assign(new Error('Email already in use'), { statusCode: 409 });
      throw err;
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = userRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    await userRepo.save(user);

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn } as jwt.SignOptions
    );

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt.toISOString() },
    };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOneBy({ email: dto.email });
    if (!user) {
      const err = Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
      throw err;
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      const err = Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
      throw err;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn } as jwt.SignOptions
    );

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt.toISOString() },
    };
  }
}
