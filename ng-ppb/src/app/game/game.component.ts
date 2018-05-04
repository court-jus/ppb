import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Player } from '../player';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  players: Player[];
  level: number = 1;
  selectedPlayer: Player;

  constructor(
      private playerService: PlayerService,
      private route: ActivatedRoute,
      private location: Location
  ) { }

  ngOnInit() {
    this.getPlayers();
    this.setLevel();
  }

  getPlayers(): void {
    this.playerService.getPlayers()
        .subscribe(players => this.players = players);
  }

  setLevel(): void {
    const level = +this.route.snapshot.paramMap.get('level');
    this.level = level;
  }

  onSelect(player: Player): void {
    this.selectedPlayer = player;
  }

}
