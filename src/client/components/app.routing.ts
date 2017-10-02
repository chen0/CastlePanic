import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { LobbyComponent } from './lobby/lobby.component';
import { TestComponent } from './test/test.component';

let routes: Routes = [
    { path: 'lobby/:sessionid/:nickname', component: LobbyComponent },
    { path: 'test', component: TestComponent }, 
    { path: '', component: IndexComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule],
})
export class AppRoutingModule { }

export const routingComponents = [LobbyComponent, TestComponent, IndexComponent];
