import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, throwIfEmpty } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordAccountService {

  constructor(private http: HttpClient) {
  }

  onCreatePost(postData: { title: string; accountName: string; password: string; }) {
    return this.http
      .post(
        'https://angular-face-api-vault.firebaseio.com/pass-accounts.json',
        postData
/*        {
          observe: 'response'
        }*/
      );
  }

  onGetData(): Observable<PasswordAccount[]> {
    return this.http
      .get<PasswordAccount[]>(
        'https://angular-face-api-vault.firebaseio.com/pass-accounts.json',
        {
          headers: new HttpHeaders()
        }
      )
      .pipe(
        catchError(err => {
          return throwError(err);
        }),
        map(response => {
          return response ? this.generatePassAccounts(response) : [];
        })
      );
  }

  onGetWithParamsData(): Observable<PasswordAccount[]> {
    const queryParams = new HttpParams().set('print', 'pretty');
    return this.http
      .get<PasswordAccount[]>(
        'https://angular-face-api-vault.firebaseio.com/pass-accounts.json',
        {
          params: queryParams
        }
      )
      .pipe(
        catchError(err => {
          return throwError(err);
        }),
        map(response => {
          return response ? this.generatePassAccounts(response) : [];
        })
      );
  }

  onDeleteData(key: string) {
    return this.http.delete(`https://angular-face-api-vault.firebaseio.com/pass-accounts/${key}.json`);
  }

  private generatePassAccounts(response: any) {
    return Object.keys(response).map(key => {
      return {...response[key], id: key};
    });
  }
}
