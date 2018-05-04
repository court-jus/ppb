import { NgModule } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { GameComponent } from './game/game.component';
import { PlayersComponent } from './players/players.component';
import { HelpComponent } from './help/help.component';

const routes: Routes = [
  { path: 'players', component: PlayersComponent },
  { path: 'help', component: HelpComponent },
  { path: 'game/:level', component: GameComponent },

  { path: 'game', redirectTo: '/game/1', pathMatch: 'full' },
  { path: '', redirectTo: 'help', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
