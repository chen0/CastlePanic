import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppRoutingModule, routingComponents } from './app.routing';
import { CreateComponent } from './create/create.component';
import { MainComponent } from './main/main.component';

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    declarations: [
        MainComponent,
        routingComponents
    ],
    bootstrap: [
        MainComponent
    ]
})
export class MainModule { }

platformBrowserDynamic().bootstrapModule(MainModule);
