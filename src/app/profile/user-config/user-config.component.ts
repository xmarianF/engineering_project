import { Component, ElementRef, OnInit } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import { UserConfigService } from './user-config.service';
import { AppService } from '../../app.service';
import { UserInfo } from '../user-info/user-info';
import { UserInfoComponent } from '../user-info/user-info.component';
import { IMyOptions} from 'mydatepicker';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';


@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.css'],
  providers: [UserConfigService, AppService]
})


export class UserConfigComponent implements OnInit {

  errorMessage: string;
  status: string;
  userInfo: UserInfo;
  avatarImgName: string;
  currentDate = new Date();
  numberOfGames: number;

  public URL = this.appService.getUrl('/app/avatarUpload');
  public avatarUploader:FileUploader = new FileUploader({url: this.URL, itemAlias: 'photo'});

  constructor(private http: Http,
              private el: ElementRef,
              private appService: AppService,
              private userConfigService: UserConfigService) { }

  private myDatePickerOptions: IMyOptions = {
        dateFormat: 'dd-mm-yyyy',
        showTodayBtn: false,
        maxYear: this.currentDate.getFullYear()
    };

    model = {
      datepicker: { date: {year: 2000, month: 1, day: 1 }},
      dateBirth: '',
      city: '',
      contactNumber: '',
      password: '',
      confirmPassword: '',
      numberOfGames: 0,
      numberOfExchanges: 0,
      numberOfRatings: 0,
      sumOfGrades: 0
    }

  ngOnInit() {
    this.getUserInfo();
    this.avatarUploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    this.avatarUploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {};
  }

  file: File;
  onChange(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    this.file = files[0];
    this.avatarImgName = this.file.name;
  }

  //get user information

  getUserInfo() {

    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var userID = currentUser._id;

    this.userConfigService.getUser(userID)
                     .subscribe(
                        userInfo => {
                          if(userInfo.dateBirth != null) {
                            this.model.datepicker = {
                              date: {
                                year: parseInt(userInfo.dateBirth.substring(6,10)),
                                month: parseInt(userInfo.dateBirth.substring(4,5)),
                                day: parseInt(userInfo.dateBirth.substring(0,2))
                              }
                            }                            
                          }
                          this.userInfo = userInfo;
                          this.model.dateBirth = userInfo.dateBirth;
                          this.numberOfGames = userInfo.numberOfGames;
                        },
                        error => this.errorMessage = <any>error);
  }

  //edit user information

  editUserInfo(id: string, city: string, contactNumber: string, avatarImage: string, password: string) {

    var d = this.model.datepicker.date.year;
    var m =this.model.datepicker.date.month;
    var y = this.model.datepicker.date.day;
    var date = '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);

    this.userConfigService.updateUser(id, date, city, contactNumber, this.avatarImgName, password, this.numberOfGames)
                     .subscribe(
                        userInfo  => {
                          this.userInfo;
                          this.getUserInfo();
                          this.appService.showNotification('Powiadomienie', 'Dane użytkownika zostały zmienione.', 'success');
                        },
                        error =>  {
                          this.errorMessage = <any>error
                        });
  }
}
