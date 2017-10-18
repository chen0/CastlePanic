import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ParticlesModule } from 'angular-particle';
import { AlertCenterModule  } from 'ng2-alert-center';

import { AvatarModule } from 'ngx-avatar'; 
import { ModalModule } from 'ngx-bootstrap/modal';

import { Game } from '../services/game';
import { GameSessionService } from '../services/game.session.service';
import { AppRoutingModule, routingComponents } from './app.routing';
import { HandComponent } from './hand/hand.component';
import { MainComponent } from './main/main.component';

@NgModule({
    imports: [
        BrowserModule,
        ModalModule.forRoot(),
        AppRoutingModule, 
        HttpModule, 
        JsonpModule, 
        ParticlesModule, 
        AlertCenterModule, 
        BrowserAnimationsModule, 
        AvatarModule
    ],
    declarations: [
        MainComponent,
        routingComponents,
        HandComponent,        
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
