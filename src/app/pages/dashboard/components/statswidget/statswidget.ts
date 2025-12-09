import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardMetricsService } from '@/core/services/dashboard-metrics.service';
import { DashboardMetrics, StatsCard } from '@/core/models/dashboard.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-statswidget',
  imports: [CommonModule],
  templateUrl: './statswidget.html',
  styleUrl: './statswidget.scss'
})
export class Statswidget implements OnInit, OnDestroy {
  metrics: DashboardMetrics = {
    totalUsers: 0,
    totalActiveBoutiques: 0,
    totalSales: 0,
    totalRevenue: 0,
    loading: true
  };

  statsCards: StatsCard[] = [];

  private subscription?: Subscription;

  constructor(private dashboardMetricsService: DashboardMetricsService) {}

  ngOnInit(): void {
    this.subscription = this.dashboardMetricsService.metrics.subscribe(metrics => {
      this.metrics = metrics;
      this.updateStatsCards();
    });

    // Charger les métriques au démarrage
    this.dashboardMetricsService.loadMetrics();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateStatsCards(): void {
    this.statsCards = [
      {
        title: 'Utilisateurs inscrits',
        value: this.metrics.totalUsers,
        icon: 'pi pi-users',
        color: 'blue',
        format: 'number'
      },
      {
        title: 'Boutiques actives',
        value: this.metrics.totalActiveBoutiques,
        icon: 'pi pi-shop',
        color: 'orange',
        format: 'number'
      },
      {
        title: 'Ventes totales',
        value: this.metrics.totalSales,
        icon: 'pi pi-shopping-cart',
        color: 'cyan',
        format: 'number'
      },
      {
        title: 'Chiffre d\'affaires',
        value: this.metrics.totalRevenue,
        icon: 'pi pi-dollar',
        color: 'purple',
        format: 'currency'
      }
    ];
  }

  formatValue(card: StatsCard): string {
    if (this.metrics.loading) {
      return '...';
    }

    if (card.format === 'currency') {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF'
      }).format(card.value);
    }

    return card.value.toLocaleString('fr-FR');
  }

  getCardClasses(color: string): string {
    return `flex items-center justify-center bg-${color}-100 dark:bg-${color}-400/10 rounded-border`;
  }

  getIconClasses(color: string): string {
    return `pi ${color}-500 text-xl!`;
  }
}
