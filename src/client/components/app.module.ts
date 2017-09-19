import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ParticlesModule } from 'angular-particle';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Game } from '../services/game';
import { GameSessionService } from '../services/game.session.service';
import { AppRoutingModule, routingComponents } from './app.routing';
import { MainComponent } from './main/main.component';

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
