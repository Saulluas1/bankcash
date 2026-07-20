import { TransactionType } from './transaction.entity';

// TODO: Implement transaction CRUD using AppDataSource

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
  async findByUser(_userId: string, _filters: TransactionFilters): Promise<object> {
    // TODO: query with filters, pagination, and date range
    throw new Error('Not implemented');
  }

  async findOne(_userId: string, _id: string): Promise<object> {
    // TODO: find transaction by id verifying ownership
    throw new Error('Not implemented');
  }

  async create(_userId: string, _dto: CreateTransactionDto): Promise<object> {
    // TODO: create and save transaction entity
    throw new Error('Not implemented');
  }

  async update(_userId: string, _id: string, _dto: Partial<CreateTransactionDto>): Promise<object> {
    // TODO: verify ownership and update transaction
    throw new Error('Not implemented');
  }

  async remove(_userId: string, _id: string): Promise<void> {
    // TODO: verify ownership and delete transaction
    throw new Error('Not implemented');
  }
}
