import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppRoutingModule, routingComponents } from './app.routing';
import { MainComponent } from './main/main.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpModule, JsonpModule } from '@angular/http';
import { ParticlesModule } from 'angular-particle';

import { GameSessionService } from '../services/game.session.service';
import { Game } from '../services/game';


@NgModule({
    imports: [
        BrowserModule,
        ModalModule.forRoot(),
        AppRoutingModule, 
        HttpModule, 
        JsonpModule, 
        ParticlesModule
    ],
    declarations: [
        MainComponent,
        routingComponents,        
    ],
    bootstrap: [
        MainComponent, 
    ], 
    providers: [
        GameSessionService, 
        HttpModule
    ]
})
export class MainModule { }

platformBrowserDynamic().bootstrapModule(MainModule);
