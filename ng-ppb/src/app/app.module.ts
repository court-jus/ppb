import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { PlayerService } from './player.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { AppRoutingModule } from './/app-routing.module';
import { BoardComponent } from './board/board.component';
import { PlayersComponent } from './players/players.component';
import { CellComponent } from './cell/cell.component';
import { HelpComponent } from './help/help.component';


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    PlayerDetailComponent,
    MessagesComponent,
    BoardComponent,
    PlayersComponent,
    CellComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    PlayerService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
