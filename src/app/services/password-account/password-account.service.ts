import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
      );
  }

  onGetData(): Observable<PasswordAccount[]> {
    return this.http
      .get(
        'https://angular-face-api-vault.firebaseio.com/pass-accounts.json',
      )
      .pipe(
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
