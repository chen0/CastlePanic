import {Component, Inject, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import template from './main.template.html';

@Component({
    selector: 'main',
    template: template,
})
export class MainComponent {
    public modalRef: BsModalRef;
    constructor( @Inject(BsModalService) private modalService: BsModalService) {}
    
}
