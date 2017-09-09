import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MainComponent } from './main.component';

@NgModule({
    declarations: [
        MainComponent
    ],
    imports: [
        BrowserModule
    ],
    bootstrap: [
        MainComponent
    ]
})
export class MainModule { }

platformBrowserDynamic().bootstrapModule(MainModule);
