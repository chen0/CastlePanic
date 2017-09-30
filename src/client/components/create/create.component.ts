import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router';
import template from './main.template.html';

@Component({
    selector: 'create',
    template: `
        <button (click)=test()>test click</button>`,
})
export class CreateComponent {

    constructor( @Inject(Router) private router: Router) {

    }

    private test() {
        this.router.navigate(['/test']);
    }
}