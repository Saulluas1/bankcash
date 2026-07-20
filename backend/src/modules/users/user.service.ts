// TODO: Implement user profile queries using AppDataSource

export class UserService {
  async findById(_id: string): Promise<object> {
    // TODO: return user from DB (excluding passwordHash)
    throw new Error('Not implemented');
  }

  async update(_id: string, _data: Partial<{ name: string }>): Promise<object> {
    // TODO: update user fields and return updated record
    throw new Error('Not implemented');
  }
}
