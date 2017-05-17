import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { User } from './users/user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class AppService {

  private rootUrl = 'http://localhost:8080';
  private usersUrl = this.getUrl('/app/users');

  constructor (private http: Http) {}

  getUrl(url: string) {
    return this.rootUrl + url;
  }

  getUser(id: string) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(`${this.getUrl('/app/users')}/${id}`, options)
                    .map((response: Response) => {
                      localStorage.setItem('currentUser', JSON.stringify(response.json()));
                    })
                    .catch(this.handleError);
  }

  extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
