import { Routes } from "@angular/router";
import { Boutiques } from "./boutiques/boutiques";
import { Clients } from "./clients/clients";



export default [
    {path: 'clients', component: Clients},
    {path: 'boutiques', component: Boutiques}
] as Routes