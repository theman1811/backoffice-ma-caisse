import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

interface Boutique {
  nom: string;
  proprietaire: string;
  nbVendeurs: number;
  produits: number;
  ventes: string;
  statut: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-boutiques',
  imports: [TableModule, TagModule, ButtonModule],
  templateUrl: './boutiques.html',
  styleUrl: './boutiques.scss'
})
export class Boutiques {
  boutiques: Boutique[] = [
    {
      nom: 'Mode Parisienne',
      proprietaire: 'Marie Dubois',
      nbVendeurs: 10,
      produits: 45,
      ventes: '€2,340',
      statut: 'Active'
    },
    {
      nom: 'Tech Store',
      proprietaire: 'Pierre Martin',
      nbVendeurs: 5,
      produits: 23,
      ventes: '€890',
      statut: 'Inactive'
    },
    {
      nom: 'Bijoux Élégants',
      proprietaire: 'Sophie Laurent',
      nbVendeurs: 3,
      produits: 67,
      ventes: '€4,120',
      statut: 'Active'
    },
    {
      nom: 'Librairie Moderne',
      proprietaire: 'Jean Dupont',
      nbVendeurs: 6,
      produits: 156,
      ventes: '€1,560',
      statut: 'Active'
    },
    {
      nom: 'Beauty Corner',
      proprietaire: 'Emma Wilson',
      nbVendeurs: 7,
      produits: 34,
      ventes: '€1,230',
      statut: 'Inactive'
    }
  ];

  toggleStatut(boutique: Boutique): void {
    boutique.statut = boutique.statut === 'Active' ? 'Inactive' : 'Active';
  }
}
