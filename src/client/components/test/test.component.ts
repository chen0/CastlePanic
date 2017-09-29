import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router';
import template from './main.template.html';

@Component({
    selector: 'test',
    template: `
        <h1>test session</h1> {{count}}`,
})
export class TestComponent {
    private count: number = 43;

    constructor( @Inject(Router) private router: Router) {
        document.body.style.backgroundImage = '';
    }
}
