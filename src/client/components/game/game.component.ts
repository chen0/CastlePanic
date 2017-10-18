import {HandComponent} from '../hand/hand.component';
import { ViewChild,ElementRef, Component, Inject, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
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
    selector: 'game',
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
    private wallContainer: any;
    private lobbyid: string;
    private nickname: string;
    private alive: boolean; 
    private timer: Observable<number>; 
    private interval: number; 
    private zoneConstant: number[] = [0, 300, 0, 60, 120, 180, 240];
    private wallConstant: number[] = [545, 526, 547, 408, 648, 467, 554, 538, 656, 481, 655, 598, 547, 552, 648, 613, 546, 670
                                    , 530, 553, 529, 670, 428, 610, 523, 540, 421, 599, 421, 482, 530, 525, 428, 466, 530, 408];
    private wallTextConstant: number[] = [578, 465, 617, 536, 579, 610, 499, 610, 462, 536, 499, 465];


    @ViewChild('div') div:ElementRef;
    // reference to child component
    @ViewChild(HandComponent) private hand: HandComponent;
    
    // NOTE: you can update the hand component by resetting the value of players
    // this.hand.players = this.playerArray

    /**
     * Mock player Array to pass into hand component
     */
    private playerArray: any[] = [{userid: 'ben', cards: [
        {type: 'BlueArcher', ring: 0, color: 0},
        {type: 'GreenKnight', ring: 0, color: 0},
        {type: 'RedSwordsman', ring: 0, color: 0},
        {type: 'BlueSwordsman', ring: 0, color: 0},
        {type: 'GreenArcher', ring: 0, color: 0},
        {type: 'RedArcher', ring: 0, color: 0}
    ]}];

    // card selected in hand
    private selectedCard: number = -1;

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
     
      this.gameLoop();
      this.timer
          .takeWhile(() => this.alive)
          .subscribe(() => {
              this.gameLoop();
          });
      this.resize();
    }
    
    private gameLoop() {
        this.gameService.checkSession(this.lobbyid)
            .subscribe((gameSession) => {
                this.gameSession = gameSession;
                this.playerArray = _.get(gameSession,'state.players',[]);
        });
        try {
            this.monsterContainer.destroy();
            this.wallContainer.destroy();
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
        this.wallContainer = new Container();
        for (let tower of this.gameSession.state.towers) {
            if (tower.health === 0) continue;
            let graphics = new PIXI.Graphics();
            if (tower.health === 1) graphics.beginFill(0xe15620, 0.9); 
            else graphics.beginFill(0xDDDDDD, 0.9);
            graphics.lineStyle(0);
            graphics.moveTo(this.wallConstant[(tower.position.zone - 1) * 6], this.wallConstant[(tower.position.zone - 1) * 6 + 1]);
            graphics.lineTo(this.wallConstant[(tower.position.zone - 1) * 6 + 2], this.wallConstant[(tower.position.zone - 1) * 6 + 3]);
            graphics.lineTo(this.wallConstant[(tower.position.zone - 1) * 6 + 4], this.wallConstant[(tower.position.zone - 1) * 6 + 5]);
            graphics.lineTo(this.wallConstant[(tower.position.zone - 1) * 6], this.wallConstant[(tower.position.zone - 1) * 6 + 1]);
            graphics.endFill();
            let textStyle = new PIXI.TextStyle({
                wordWrapWidth: 100
            }); 
            let wallText = new PIXI.Text(tower.health, textStyle); 
            wallText.anchor.x = 0.5; 
            wallText.anchor.y = 0.5;
            wallText.x = this.wallTextConstant[(tower.position.zone - 1) * 2];
            wallText.y = this.wallTextConstant[(tower.position.zone - 1) * 2 + 1];
            this.wallContainer.addChild(graphics); 
            this.wallContainer.addChild(wallText); 
        }

        this.stage.addChild(this.monsterContainer); 
        this.stage.addChild(this.wallContainer);

        this.renderer.render(this.stage);
    }

    private onTouchstart(param, e) {
        console.log(param, e); 
    }

    private resize() {
        let parentWidth = this.div.nativeElement.offsetWidth;
        let parentHeight = window.innerHeight;
        let w;
        let h;
        if (parentWidth / parentHeight >= this.ratio) {
            w = parentHeight * this.ratio;
            h = parentHeight;
        } else {
            w = parentWidth;
            h = parentWidth / this.ratio;
        }
        
        this.renderer.view.style.width = w + 'px';
        this.renderer.view.style.height = h + 'px';
    }

    private ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
            this.lobbyid = params['sessionid']; 
            this.nickname = params['nickname'];
            // TODO ben
        }); 

        let size = [1080, 1080];
        this.ratio = size[0] / size[1];
        this.stage = new Container();
        let view1 = document.getElementById('gameBoard');
        this.renderer = autoDetectRenderer(size[0], size[1], view1);
        //document.body.appendChild(this.renderer.view);

        this.renderer.backgroundColor = 0xdddddd;

        this.renderer.view.style.left = '50%';
        this.renderer.view.style.top = '50%';

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

    private ngAfterViewInit() {
        this.div.nativeElement.appendChild(this.renderer.view); 
    }

     /**
     * Reset the hand component
     * 
     * @private
     * @memberof GameComponent
     */
    private reset() {
        this.hand.reset();
        this.selectedCard = -1;
    }

    /**
     * Updates the selectedCard index, called by child component
     * 
     * @private
     * @param {number} index 
     * @memberof GameComponent
     */
    private cardIndex(index: number) {
        this.selectedCard = index;
    }
}
