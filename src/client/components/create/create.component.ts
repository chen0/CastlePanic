import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router';
import template from './main.template.html';

@Component({
    selector: 'create',
    template: `
        <h1>Create session</h1> {{count}}
        <button (click)=test()>test click</button>`,
})
export class CreateComponent {
    private count: number = 2;

    constructor( @Inject(Router) private router: Router) {
    }

    private test() {
        this.router.navigate(['/test']);
    }
}
