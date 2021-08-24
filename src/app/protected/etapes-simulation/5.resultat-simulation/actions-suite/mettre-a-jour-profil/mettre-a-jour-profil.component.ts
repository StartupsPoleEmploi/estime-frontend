import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-mettre-a-jour-profil',
  templateUrl: './mettre-a-jour-profil.component.html',
  styleUrls: ['./mettre-a-jour-profil.component.scss']
})
export class MettreAJourProfilComponent implements OnInit {
  @Input() onClickButtonMettreAJourProfil: () => void;
  stickyButton = false;

  constructor() { }

  ngOnInit(): void {
  }
}
