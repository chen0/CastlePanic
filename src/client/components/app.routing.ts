import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { IndexComponent } from './index/index.component';
import { LobbyComponent } from './lobby/lobby.component';

let routes: Routes = [
    { path: 'lobby/:sessionid/:nickname', component: LobbyComponent },
    { path: 'game/:sessionid/:nickname', component: GameComponent }, 
    { path: '', component: IndexComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule],
})
export class AppRoutingModule { }

export const routingComponents = [LobbyComponent, GameComponent, IndexComponent];
