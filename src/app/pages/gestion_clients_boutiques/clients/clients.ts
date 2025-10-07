import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  boutique: string;
  statut: 'Actif' | 'Inactif';
  dateInscription: string;
}

@Component({
  selector: 'app-clients',
  imports: [TableModule, ButtonModule, TagModule, CommonModule],
  templateUrl: './clients.html',
  styleUrl: './clients.scss'
})
export class Clients {
  utilisateurs: Utilisateur[] = [
    {
      id: 1,
      nom: 'Marie Dubois',
      email: 'marie@email.com',
      boutique: '5',
      statut: 'Actif',
      dateInscription: '15/01/2024'
    },
    {
      id: 2,
      nom: 'Pierre Martin',
      email: 'pierre@email.com',
      boutique: '10',
      statut: 'Inactif',
      dateInscription: '10/02/2024'
    },
    {
      id: 3,
      nom: 'Sophie Laurent',
      email: 'sophie@email.com',
      boutique: '3',
      statut: 'Actif',
      dateInscription: '20/01/2024'
    },
    {
      id: 4,
      nom: 'Jean Dupont',
      email: 'jean@email.com',
      boutique: '2',
      statut: 'Actif',
      dateInscription: '05/03/2024'
    },
    {
      id: 5,
      nom: 'Emma Wilson',
      email: 'emma@email.com',
      boutique: '4',
      statut: 'Inactif',
      dateInscription: '28/02/2024'
    }
  ];

  toggleStatut(utilisateur: Utilisateur): void {
    utilisateur.statut = utilisateur.statut === 'Actif' ? 'Inactif' : 'Actif';
  }
}
