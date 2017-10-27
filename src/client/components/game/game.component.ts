import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Alert, AlertCenterComponent, AlertCenterService, AlertType } from 'ng2-alert-center';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Observable } from 'rxjs';
import { GameSessionService } from '../../services/game.session.service';
import { HandComponent } from '../hand/hand.component';

import css from './game.css';
import template from './game.template.html';

import * as _ from 'lodash';
import * as PIXII from 'pixi.js';

let PIXI: any = PIXII;

let Container = PIXI.Container;
let autoDetectRenderer = PIXI.autoDetectRenderer;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;

@Component({
    selector: 'game',
    template: template,
    styles: [css]
})

export class GameComponent {
    public modalRef: BsModalRef;
    private count: number = 43;
    private ratio: number;
    private stage: any;
    private renderer: any;
    private loader: any;
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
    private wallConstant: number[] = [545, 526, 547, 408, 648, 467, 554, 538, 656, 481, 655, 598, 547, 552, 648, 613,
                                      546, 670, 530, 553, 529, 670, 428, 610, 523, 540, 421, 599, 421, 482, 530, 525,
                                      428, 466, 530, 408];
    private wallTextConstant: number[] = [578, 465, 617, 536, 579, 610, 499, 610, 462, 536, 499, 465];
    private playerArray: any;
    private turnNum: number; 
    private win: boolean;
    private loss: boolean;

    @ViewChild('div') private div: ElementRef;
    // reference to child component
    @ViewChild(HandComponent) private hand: HandComponent;
    @ViewChild('gameOver') private gameOverModal: TemplateRef<any>;
    private modalOpen: boolean;

    // NOTE: you can update the hand component by resetting the value of players
    // this.hand.players = this.playerArray

    // card selected in hand
    private selectedCard: number = -1;

    constructor(
        @Inject(Router) private router: Router,
        @Inject(ActivatedRoute) private activatedRoute: ActivatedRoute,
        @Inject(GameSessionService) private gameService: GameSessionService,
        @Inject(AlertCenterService) private service: AlertCenterService,
        @Inject(BsModalService) private modalService: BsModalService,
    ) {
        this.alive = true;
        this.interval = 1000;
        this.timer = Observable.timer(0, this.interval);
        this.modalOpen = false;
    }

    public currentTurn(): string {
        let index = _.get(this.gameSession, 'state.turnNum', 0) % _.get(this.gameSession, 'state.players.length', 0);
        let player = this.gameSession.state.players[index];
        return _.get(player, 'userid', '');
    }

    private setup() {
      this.board = new Sprite(this.loader.resources['board.jpg'].texture);
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
                this.playerArray = _.get(gameSession, 'state.players', []);
                this.turnNum = this.gameSession.state.turnNum;
                this.win = gameSession.state.win;
                this.loss = gameSession.state.loss;
        });
        try {
            this.monsterContainer.destroy();
            this.wallContainer.destroy();
        } catch (Error) { /* empty */ }

        this.monsterContainer = new Container();

        if (_.get(this.gameSession, 'state.loss', false) && !this.modalOpen) {
            this.modalOpen = true;
            this.openModal(this.gameOverModal);
        } else if (_.get(this.gameSession, 'state.win', false) && !this.modalOpen) {
            /* this.modalOpen = true;
            this.openModal(this.gameOverModal); */
        }

        for (let i = 0; i < this.gameSession.state.monsters.length; i++) {

            let monster: any = this.gameSession.state.monsters[i];
            monster.index = i;

            if (_.get(monster, 'position.ring', 5) !== 5 && _.get(monster, 'health', 0) > 0) {

                let textStyle = new PIXI.TextStyle({
                    wordWrapWidth: 100
                });
                let graphics = new PIXI.Graphics();
                graphics.lineStyle(0);
                graphics.beginFill(0xFFFF0B, 0.5);
                graphics.drawCircle(50, 50, 50);
                graphics.endFill();
                graphics.interactive = true;
                graphics.pointerdown = this.onTouchstart.bind('param', { monster, ref: this });
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
        }
        this.wallContainer = new Container();
        for (let tower of this.gameSession.state.towers) {
            if (tower.health === 0) {
                continue;
            }
            let graphics = new PIXI.Graphics();
            if (tower.health === 1) {
                graphics.beginFill(0xe15620, 0.9); 
            } else {
                graphics.beginFill(0xDDDDDD, 0.9);
            }
            graphics.lineStyle(0);
            graphics.moveTo(this.wallConstant[(tower.position.zone - 1) * 6], 
                this.wallConstant[(tower.position.zone - 1) * 6 + 1]);
            graphics.lineTo(this.wallConstant[(tower.position.zone - 1) * 6 + 2], 
                this.wallConstant[(tower.position.zone - 1) * 6 + 3]);
            graphics.lineTo(this.wallConstant[(tower.position.zone - 1) * 6 + 4], 
                this.wallConstant[(tower.position.zone - 1) * 6 + 5]);
            graphics.lineTo(this.wallConstant[(tower.position.zone - 1) * 6], 
                this.wallConstant[(tower.position.zone - 1) * 6 + 1]);
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
        if (!_.isEqual(param.ref.selectedCard, -1)) {
            if (_.isEqual(param.ref.currentTurn(), param.ref.nickname)) {
                param.ref.gameService.playCard(param.ref.nickname, param.ref.lobbyid,
                    param.monster.index, param.ref.selectedCard).subscribe((result) => {
                        
                    if (result.success) {
                        param.ref.hand.reset();
                    } else {
                        let message = 'You cannot play that card there';
                        if ( _.isEqual(result.error, 'Error: Game is over') ) {
                            message = 'Game is over';
                        }
                        const alert = Alert.create(AlertType.DANGER, `<b>${message}</b>`, 5000);
                        param.ref.service.alert(alert);
                    }
                    });
            } else {
                const alert = Alert.create(AlertType.WARNING, '<b>Wait until your turn</b>', 5000);
                param.ref.service.alert(alert);
                param.ref.hand.reset();
            }
        }
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

    private ngOnDestroy() {
        this.alive = false;
    }

    private ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
            this.lobbyid = _.get(params, 'sessionid', '');
            this.nickname = _.get(params, 'nickname', '');
        });

        this.gameService.checkSession(this.lobbyid)
            .subscribe((gameSession) => {
                this.gameSession = gameSession;
                this.playerArray = this.gameSession.state.players; 
                this.turnNum = this.gameSession.state.turnNum;
            });

        let size = [1080, 1080];
        this.ratio = size[0] / size[1];
        this.stage = new Container();
        let view1 = document.getElementById('gameBoard');
        this.renderer = autoDetectRenderer(size[0], size[1], view1);
        this.renderer.backgroundColor = 0xdddddd;

        this.renderer.view.style.left = '50%';
        this.renderer.view.style.top = '50%';

        this.loader = new PIXI.loaders.Loader();
        this.loader.reset();
        this.loader
          .add('board.jpg')
          .load( () => {this.setup(); } );

        window.onresize = (event) => {
            this.resize();

        };
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

    private openModal(htmlTemplate: TemplateRef<any>) {
        this.modalRef = this.modalService.show(htmlTemplate);
    }

    private backToMenu() {
        this.router.navigate(['/']);
        this.modalRef.hide();
    }
}
