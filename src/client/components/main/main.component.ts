import {Component} from '@angular/core';
import template from './main.template.html';

@Component({
    selector: 'main',
    template: template,
})
export class MainComponent {
    private count: number = 1;
}
