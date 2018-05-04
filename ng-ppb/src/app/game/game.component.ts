import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

import { Player } from '../player';
import { PlayerService } from '../player.service';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  players: Player[];
  level: number = 1;
  selectedPlayer: Player;
  @ViewChild(BoardComponent) board: BoardComponent;

  constructor(
      private playerService: PlayerService,
      private route: ActivatedRoute,
      private router: Router,
      private location: Location
  ) { }

  ngOnInit() {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.setLevel();
          this.board.newGame(this.level);
        }
      });
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

  newGame(): void {
    this.board.newGame(this.level);
  }

}
