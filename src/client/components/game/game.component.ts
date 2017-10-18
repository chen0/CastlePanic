import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable } from 'rxjs'; 
import { GameSessionService } from '../../services/game.session.service';

import css from './game.css';
import template from './game.template.html';

import * as _ from 'lodash'; 
import * as PIXII from 'pixi.js';

let PIXI: any = PIXII;

let Container = PIXI.Container;
let autoDetectRenderer = PIXI.autoDetectRenderer;
let loader = PIXI.loader;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;

@Component({
    selector: 'test',
    template: template, 
    styles: [css]
})
export class GameComponent {
    private count: number = 43;
    private ratio: number;
    private stage: any; 
    private renderer: any;
    private board: any; 
    private gameSession: any;
    private monsterContainer: any;
    private lobbyid: string;
    private nickname: string;
    private alive: boolean; 
    private timer: Observable<number>; 
    private interval: number; 
    private zoneConstant: number[] = [0, 300, 0, 60, 120, 180, 240];

    constructor( 
        @Inject(Router) private router: Router, 
        @Inject(ActivatedRoute) private activatedRoute: ActivatedRoute, 
        @Inject(GameSessionService) private gameService: GameSessionService
    ) {
        this.alive = true; 
        this.interval = 1000; 
        this.timer = Observable.timer(0, this.interval); 
    }

    private setup() {
      this.board = new Sprite(loader.resources['board.jpg'].texture);
      this.board.interactive = true;
      this.board.x = 0;
      this.board.y = 0; 
      this.board.width = 1080;
      this.board.height = 1080;
      this.stage.addChild(this.board);
      this.board.mousedown = this.onTouchstart.bind('param', 'test'); 
     
      this.gameLoop();
      this.timer
          .takeWhile(() => this.alive)
          .subscribe(() => {
              this.gameLoop();
          });
      this.resize();
    }
    
    private gameLoop() {

        try {
            this.monsterContainer.destroy();
        } catch (Error) { }
        this.monsterContainer = new Container(); 
        let monsterArray = _.filter(this.gameSession.state.monsters, (monster) => {
            return _.get(monster, 'position.ring', 5) !== 5; 
        }); 
        for (let monster of monsterArray) {

            let textStyle = new PIXI.TextStyle({
                wordWrapWidth: 100
            }); 
            let graphics = new PIXI.Graphics(); 
            graphics.lineStyle(0);
            graphics.beginFill(0xFFFF0B, 0.5);
            graphics.drawCircle(50, 50, 50);
            graphics.endFill();
            graphics.interactive = true;
            graphics.mousedown = this.onTouchstart.bind('param', monster); 
            let monsterNameAndHealth = _.get(monster, 'type', '') + '\nHP: ' + _.get(monster, 'health', 0); 
            let monsterText = new PIXI.Text(monsterNameAndHealth, textStyle); 
            monsterText.anchor.x = 0.5;
            monsterText.anchor.y = 0.5;
            monsterText.x = 50; 
            monsterText.y = 50; 
            let mContainer = new Container(); 
            mContainer.addChild(graphics); 
            mContainer.addChild(monsterText); 
            mContainer.position.set(
                (539 - 50) + ((_.get(monster, 'position.ring', 5) + 1) * 95) 
                * Math.cos(this.zoneConstant[_.get(monster, 'position.zone', 1)] / 57.3), 
                (539 - 50) + ((_.get(monster, 'position.ring', 5) + 1) * 95) 
                * Math.sin(this.zoneConstant[_.get(monster, 'position.zone', 1)] / 57.3)); 
            this.monsterContainer.addChild(mContainer); 
        }
        this.stage.addChild(this.monsterContainer); 

        this.renderer.render(this.stage);
    }

    private onTouchstart(param, e) {
        console.log(param, e); 
    }

    private resize() {
        let w;
        let h;
        if (window.innerWidth / window.innerHeight >= this.ratio) {
            w = window.innerHeight * this.ratio;
            h = window.innerHeight;
        } else {
            w = window.innerWidth;
            h = window.innerWidth / this.ratio;
        }
        this.renderer.view.style.width = w + 'px';
        this.renderer.view.style.height = h + 'px';
    }

    private ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
            this.lobbyid = params['sessionid']; 
            this.nickname = params['nickname']; 
        }); 

        let size = [1920, 1080];
        this.ratio = size[0] / size[1];
        this.stage = new Container();
        this.renderer = autoDetectRenderer(size[0], size[1]);
        document.body.appendChild(this.renderer.view);
        this.renderer.backgroundColor = 0xdddddd;

        this.renderer.view.style.position = 'absolute';
        this.renderer.view.style.left = '50%';
        this.renderer.view.style.top = '50%';
        this.renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';

        loader
          .add('board.jpg')
          .load( () => {this.setup(); } );

        window.onresize = (event) => {
            this.resize();

        };

        this.gameService.checkSession(this.lobbyid)
            .subscribe((gameSession) => {
                this.gameSession = gameSession;
            });
    }
}
