import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

interface Administrateur {
  id: number;
  nom: string;
  email: string;
  role: string;
  statut: string;
  derniereConnexion: string;
  creeLe: string;
}

@Component({
  selector: 'app-administrateurs',
  imports: [TableModule, ButtonModule, TagModule, CommonModule],
  templateUrl: './administrateurs.html',
  styleUrl: './administrateurs.scss'
})
export class Administrateurs {
  administrateurs: Administrateur[] = [
    {
      id: 1,
      nom: 'Alice Dupont',
      email: 'alice@maboutique.com',
      role: 'Super Admin',
      statut: 'Actif',
      derniereConnexion: '20/03/2024',
      creeLe: '15/01/2024'
    },
    {
      id: 2,
      nom: 'Bob Martin',
      email: 'bob@maboutique.com',
      role: 'Admin',
      statut: 'Actif',
      derniereConnexion: '19/03/2024',
      creeLe: '10/02/2024'
    },
    {
      id: 3,
      nom: 'Claire Laurent',
      email: 'claire@maboutique.com',
      role: 'Modérateur',
      statut: 'Inactif',
      derniereConnexion: '15/03/2024',
      creeLe: '20/01/2024'
    }
  ];

  getRoleSeverity(role: string): string {
    switch (role) {
      case 'Super Admin':
        return 'danger';
      case 'Admin':
        return 'info';
      case 'Modérateur':
        return 'secondary';
      default:
        return 'secondary';
    }
  }

  editAdministrateur(administrateur: Administrateur): void {
    console.log('Édition de l\'administrateur:', administrateur);
    // TODO: Implémenter la logique d'édition
  }

  deleteAdministrateur(administrateur: Administrateur): void {
    console.log('Suppression de l\'administrateur:', administrateur);
    // TODO: Implémenter la logique de suppression
  }
}
