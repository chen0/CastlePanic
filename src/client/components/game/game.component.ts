import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router';
import * as PIXI from 'pixi.js';
import template from './game.template.html';

// declare var PIXI: any;

@Component({
    selector: 'test',
    template: template
})
export class GameComponent {

    constructor( @Inject(Router) private router: Router) {
        
    }

}
