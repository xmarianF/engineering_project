import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppService } from '../../app.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/do";

import { UserHistory } from './user-history';


@Injectable()
export class UserHistoryService {

  	private exchangeUrl = this.appService.getUrl('/app/exchanges');

  	constructor (private http: Http, private appService: AppService) {}

  	getHistoryExchanges(id: string): Observable<UserHistory[]> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
    	let options = new RequestOptions({ headers: headers });

    	return this.http.get(`${this.exchangeUrl}/${id}`, options)
                    .map(this.appService.extractData)
                    .catch(this.appService.handleError);
       
	}
}