export interface DashboardMetrics {
  totalUsers: number;
  totalActiveBoutiques: number;
  totalSales: number;
  totalRevenue: number;
  loading?: boolean;
  error?: string;
}

export interface StatsCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  format?: 'number' | 'currency';
}