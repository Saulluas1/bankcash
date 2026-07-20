// TODO: Implement category CRUD using AppDataSource

export interface CreateCategoryDto {
  name: string;
  icon?: string;
  color?: string;
}

export class CategoryService {
  async findByUser(_userId: string): Promise<object[]> {
    // TODO: return all categories belonging to userId
    throw new Error('Not implemented');
  }

  async create(_userId: string, _dto: CreateCategoryDto): Promise<object> {
    // TODO: create and save a new Category entity
    throw new Error('Not implemented');
  }

  async update(_userId: string, _id: string, _dto: Partial<CreateCategoryDto>): Promise<object> {
    // TODO: verify ownership and update category
    throw new Error('Not implemented');
  }

  async remove(_userId: string, _id: string): Promise<void> {
    // TODO: verify ownership and delete category
    throw new Error('Not implemented');
  }
}
