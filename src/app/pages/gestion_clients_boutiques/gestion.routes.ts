import { Routes } from "@angular/router";
import { Boutiques } from "./boutiques/boutiques";
import { Clients } from "./clients/clients";
import { BoutiqueDetails } from "./boutique-details/boutique-details";



export default [
    {path: 'clients', component: Clients},
    {path: 'boutiques', component: Boutiques},
    {path: 'boutiques/:id', component: BoutiqueDetails}
] as Routes