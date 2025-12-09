import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';

import { Statswidget } from './components/statswidget/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';

@Component({
    selector: 'app-dashboard',
    imports: [Statswidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-statswidget class="contents" />
            <div class="col-span-12 xl:col-span-6">
                <!-- <app-recent-sales-widget /> -->
                <app-best-selling-widget />
            </div>
            <!-- <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-notifications-widget />
            </div> -->
        </div>
    `
})
export class Dashboard {}
