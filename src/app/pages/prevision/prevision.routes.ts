import { Routes } from "@angular/router";
import { Analytiques } from "./analytiques/analytiques";
import { Transactions } from "./transactions/transactions";



export default [
    {path: 'analytiques', component: Analytiques},
    {path: 'transactions', component: Transactions}
] as Routes