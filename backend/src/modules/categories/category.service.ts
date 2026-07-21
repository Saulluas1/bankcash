import { AppDataSource } from '../../data-source';
import { Category } from './category.entity';

export interface CreateCategoryDto {
  name: string;
  icon?: string;
  color?: string;
}

export class CategoryService {
  async findByUser(userId: string): Promise<Category[]> {
    const categoryRepo = AppDataSource.getRepository(Category);
    return categoryRepo.findBy({ userId });
  }

  async create(userId: string, dto: CreateCategoryDto): Promise<Category> {
    const categoryRepo = AppDataSource.getRepository(Category);
    const category = categoryRepo.create({ ...dto, userId });
    return categoryRepo.save(category);
  }

  async update(userId: string, id: string, dto: Partial<CreateCategoryDto>): Promise<Category> {
    const categoryRepo = AppDataSource.getRepository(Category);

    const category = await categoryRepo.findOneBy({ id, userId });
    if (!category) {
      throw new Error('Category not found');
    }

    Object.assign(category, dto);
    return categoryRepo.save(category);
  }

  async remove(userId: string, id: string): Promise<void> {
    const categoryRepo = AppDataSource.getRepository(Category);

    const category = await categoryRepo.findOneBy({ id, userId });
    if (!category) {
      throw new Error('Category not found');
    }

    await categoryRepo.remove(category);
  }
}
