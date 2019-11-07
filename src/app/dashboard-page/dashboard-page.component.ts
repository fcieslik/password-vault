import { Component, OnDestroy, OnInit } from '@angular/core';
import { PasswordAccountService } from '../services/password-account/password-account.service';
import { Observable, of, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { PasswordGeneratorService } from '../services/password-generator/password-generator.service';
import { ClipboardServiceService } from '../services/clipboard/clipboard-service.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  availablePassAccounts: Observable<PasswordAccount[]>;
  isInProgress = true;
  password: string;

  constructor(private passwordAccount: PasswordAccountService,
              private passwordGenerator: PasswordGeneratorService,
              private clipboardService: ClipboardServiceService) {
  }

  ngOnInit() {
    const passwordGetSub = this.passwordAccount.onGetData()
      .subscribe((response: PasswordAccount[]) => {
        if (response && response.length > 0) {
          this.availablePassAccounts = of(response);
        }

        this.isInProgress = false;
      });
    this.subscription.add(passwordGetSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCreatePost(form: NgForm, postData: { title: string; accountName: string; password: string }) {
    this.isInProgress = true;
    const passCreatePost = this.passwordAccount.onCreatePost(postData)
      .pipe(
        mergeMap(() => this.passwordAccount.onGetData())
      )
      .subscribe((response: PasswordAccount[]) => {
        form.resetForm();
        this.availablePassAccounts = of(response);
        this.isInProgress = false;
      });

    this.subscription.add(passCreatePost);
  }


  onDeleteData(id: string) {
    this.isInProgress = true;
    const deletePassword = this.passwordAccount.onDeleteData(id)
      .pipe(
        mergeMap(() => this.passwordAccount.onGetData()),
      )
      .subscribe((response: PasswordAccount[]) => {
        response.length !== 0 ? this.availablePassAccounts = of(response) : this.availablePassAccounts = undefined;
        this.isInProgress = false;
      });

    this.subscription.add(deletePassword);
  }

  generateRandomPass() {
    this.password = this.passwordGenerator.randomString(8);
  }

  toClipboard(item: string) {
    this.clipboardService.copyToClipboard(item);
  }
}
