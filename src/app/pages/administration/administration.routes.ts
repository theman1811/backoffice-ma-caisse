import { Routes } from "@angular/router";
import { Administrateurs } from "./administrateurs/administrateurs";
import { Facturation } from "./facturation/facturation";



export default [
    {path: 'administrateurs', component: Administrateurs},
    {path: 'facturation', component: Facturation}
] as Routes