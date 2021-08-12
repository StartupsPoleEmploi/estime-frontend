import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mettre-a-jour-profil',
  templateUrl: './mettre-a-jour-profil.component.html',
  styleUrls: ['./mettre-a-jour-profil.component.scss']
})
export class MettreAJourProfilComponent implements OnInit {
  stickyButton = false;

  constructor() { }

  btnClick = function(){
    window.open('https://candidat.pole-emploi.fr/profil-professionnel/#/profil/synthese', '_blank');
  }

  ngOnInit(): void {
  }

}
