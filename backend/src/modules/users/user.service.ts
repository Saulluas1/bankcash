import { AppDataSource } from '../../data-source';
import { User } from './user.entity';

export type SafeUser = Omit<User, 'passwordHash'>;

export class UserService {
  async findById(id: string): Promise<SafeUser> {
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }

    const { passwordHash: _pw, ...safeUser } = user;
    return safeUser;
  }

  async update(id: string, data: Partial<{ name: string }>): Promise<SafeUser> {
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }

    if (data.name !== undefined) {
      user.name = data.name;
    }

    await userRepo.save(user);

    const { passwordHash: _pw, ...safeUser } = user;
    return safeUser;
  }
}
