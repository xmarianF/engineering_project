import { Component, OnInit, Input } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import { CoreService } from '../core/core.service';
import { AppService } from '../app.service';
import { ActivatedRoute } from '@angular/router';
import { ExchangeService } from './../exchange/exchange.service';
import { Exchange } from './../exchange/exchange';
import { UserGameService } from './../profile/user-games/user-games.service';
import { UserGame } from './../profile/user-games/user-games';
import { UserInfoService } from './../profile/user-info/user-info.service';
import { UserInfo } from './../profile/user-info/user-info';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
  providers: [AppService, CoreService, ExchangeService, UserInfoService]
})

export class ExchangeComponent implements OnInit {

  errorMessage: string;
  status: string;

  recipientID: string;
  recipientGame: UserGame; 
  recipientInfo: UserInfo;
  senderGames: UserGame[];
  senderInfo: UserInfo;

  constructor(
    private http: Http,
    private appService: AppService,
    private activeRoute: ActivatedRoute,
    private exchangeService: ExchangeService,
    private coreService: CoreService,
    private userInfoService: UserInfoService
  ) {}

  ngOnInit() {
  	if(localStorage.getItem('currentUser')) {
      this.getSenderUserGames();      
    }
  	this.getRecipientUserGame();    
  }

  // Pobierz gry nadawcy
  getSenderUserGames() {
    var id = this.appService.getCurrentUser()._id;
    this.exchangeService.getSenderGames(id)
                        .subscribe(
                            senderGames => {
                            	this.senderGames = senderGames;
                        	},
                        	error => this.errorMessage = <any>error);  
    this.getSenderUserInfo();  
  }

  // Pobierz dane nadawcy
  getSenderUserInfo(){
    var id = this.appService.getCurrentUser()._id;
    this.userInfoService.getUser(id)
                        .subscribe(
                            userInfo => {
                          		this.senderInfo = userInfo;
                        	},
                        	error => this.errorMessage = <any>error);    
  }

  // Pobierz grę odbiorcy
  getRecipientUserGame(){
    let gameID = this.activeRoute.snapshot.params['_id'];
    this.exchangeService.getRecipientGame(gameID)
                        .subscribe(
                            recipientGame => {
                              this.recipientGame = recipientGame;
                              this.recipientID = this.recipientGame.userID;
                            },
                            error => this.errorMessage = <any>error);
    this.getRecipientUserInfo(this.recipientID);
  }

  // Pobierz dane odbiorcy
  getRecipientUserInfo(id: string){    
    this.userInfoService.getUser(id)
                        .subscribe(
                            userInfo => {
                              this.recipientInfo = userInfo;
                          },
                          error => this.errorMessage = <any>error);    
  }
}