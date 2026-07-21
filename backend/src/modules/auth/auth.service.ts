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

export class AuthService {
  async register(dto: RegisterDto): Promise<{ token: string }> {
    const userRepo = AppDataSource.getRepository(User);

    const existing = await userRepo.findOneBy({ email: dto.email });
    if (existing) {
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = userRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    await userRepo.save(user);

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn } as jwt.SignOptions
    );

    return { token };
  }

  async login(dto: LoginDto): Promise<{ token: string }> {
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOneBy({ email: dto.email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn } as jwt.SignOptions
    );

    return { token };
  }
}
