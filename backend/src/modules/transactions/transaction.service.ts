import { AppDataSource } from '../../data-source';
import { Transaction, TransactionType } from './transaction.entity';

export interface CreateTransactionDto {
  amount: number;
  type: TransactionType;
  description?: string;
  date: string; // ISO date string
  categoryId?: string;
}

export interface TransactionFilters {
  page?: string;
  limit?: string;
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export class TransactionService {
  async findByUser(
    userId: string,
    filters: TransactionFilters
  ): Promise<{ data: Transaction[]; meta: { total: number; page: number; limit: number } }> {
    const transactionRepo = AppDataSource.getRepository(Transaction);

    const page = Math.max(1, parseInt(filters.page ?? '1', 10));
    const limit = Math.max(1, parseInt(filters.limit ?? '20', 10));

    const qb = transactionRepo
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.userId = :userId', { userId });

    if (filters.type) {
      qb.andWhere('transaction.type = :type', { type: filters.type });
    }
    if (filters.categoryId) {
      qb.andWhere('transaction.categoryId = :categoryId', { categoryId: filters.categoryId });
    }
    if (filters.startDate) {
      qb.andWhere('transaction.date >= :startDate', { startDate: filters.startDate });
    }
    if (filters.endDate) {
      qb.andWhere('transaction.date <= :endDate', { endDate: filters.endDate });
    }

    qb.orderBy('transaction.date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, meta: { total, page, limit } };
  }

  async findOne(userId: string, id: string): Promise<Transaction> {
    const transactionRepo = AppDataSource.getRepository(Transaction);

    const transaction = await transactionRepo.findOne({
      where: { id, userId },
      relations: ['category'],
    });
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }

  async create(userId: string, dto: CreateTransactionDto): Promise<Transaction> {
    const transactionRepo = AppDataSource.getRepository(Transaction);

    const transaction = transactionRepo.create({
      amount: dto.amount,
      type: dto.type,
      description: dto.description ?? null,
      date: new Date(dto.date),
      categoryId: dto.categoryId ?? null,
      userId,
    });

    return transactionRepo.save(transaction);
  }

  async update(
    userId: string,
    id: string,
    dto: Partial<CreateTransactionDto>
  ): Promise<Transaction> {
    const transactionRepo = AppDataSource.getRepository(Transaction);

    const transaction = await transactionRepo.findOneBy({ id, userId });
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (dto.amount !== undefined) transaction.amount = dto.amount;
    if (dto.type !== undefined) transaction.type = dto.type;
    if (dto.description !== undefined) transaction.description = dto.description ?? null;
    if (dto.date !== undefined) transaction.date = new Date(dto.date);
    if (dto.categoryId !== undefined) transaction.categoryId = dto.categoryId ?? null;

    return transactionRepo.save(transaction);
  }

  async remove(userId: string, id: string): Promise<void> {
    const transactionRepo = AppDataSource.getRepository(Transaction);

    const transaction = await transactionRepo.findOneBy({ id, userId });
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    await transactionRepo.remove(transaction);
  }
}
