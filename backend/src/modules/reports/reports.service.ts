// TODO: Implement report queries using AppDataSource with raw SQL / QueryBuilder

export class ReportsService {
  async getMonthlySummary(_userId: string, _month: string): Promise<object> {
    // TODO: Return total income, total expense, and balance for a given month (YYYY-MM)
    throw new Error('Not implemented');
  }

  async getByCategory(_userId: string, _startDate: string, _endDate: string): Promise<object[]> {
    // TODO: Return array of { categoryName, categoryColor, total } grouped by category
    // Used for the pie/doughnut chart in the frontend
    throw new Error('Not implemented');
  }

  async getTrend(_userId: string, _months: number): Promise<object[]> {
    // TODO: Return array of { month, income, expense } for the last N months
    // Used for bar/line charts in the frontend
    throw new Error('Not implemented');
  }
}
