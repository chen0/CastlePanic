import {Component, TemplateRef, Inject } from '@angular/core';
import template from './main.template.html';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
    selector: 'main',
    template: template,
})
export class MainComponent {
    private count: number = 1;
	public modalRef: BsModalRef;
	constructor( @Inject(BsModalService) private modalService: BsModalService) {}
	
}