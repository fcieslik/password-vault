import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PasswordAccountService } from '../../services/password-account/password-account.service';
import { fromEvent, Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { PasswordGeneratorService } from '../../services/password-generator/password-generator.service';
import { ClipboardServiceService } from '../../services/clipboard/clipboard-service.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput', {static: false})
  input: ElementRef;

  subscription = new Subscription();
  availablePassAccounts: Observable<PasswordAccount[]>;
  isInProgress = true;
  isLoading = false;
  password: string;
  isErrored = false;
  searchText: string;

  constructor(private passwordAccount: PasswordAccountService,
              private passwordGenerator: PasswordGeneratorService,
              private clipboardService: ClipboardServiceService) {
  }

  ngOnInit() {
    this.isLoading = true;
    const passwordGetSub = this.passwordAccount.onGetData()
      .subscribe((response: PasswordAccount[]) => {
          if (response && response.length > 0) {
            this.availablePassAccounts = of(response);
          }

          this.isInProgress = false;
          this.isLoading = false;
        },
        error => {
          this.isInProgress = false;
          this.isLoading = false;
          this.isErrored = true;
        });
    this.subscription.add(passwordGetSub);
  }

  ngAfterViewInit(): void {
    const terms = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        //filter(query => query),
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(query => this.filterEntries(query))
      ).subscribe(val => {
        this.availablePassAccounts = val || this.availablePassAccounts;
        this.isLoading = false;
      });

    this.subscription.add(terms);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  filterEntries(query: string) {
    return of(this.availablePassAccounts
      .pipe(
        map(passwordAccounts => passwordAccounts.filter(passwordAccount => passwordAccount.title.includes(this.searchText)))
      ));
  }

  onCreatePost(form: NgForm, postData: { title: string; accountName: string; password: string }) {
    this.isInProgress = true;
    this.isLoading = true;
    const passCreatePost = this.passwordAccount.onCreatePost(postData)
      .pipe(
        mergeMap(() => this.passwordAccount.onGetData())
      )
      .subscribe((response: PasswordAccount[]) => {
        form.resetForm();
        this.availablePassAccounts = of(response);
        this.isInProgress = false;
        this.isLoading = false;
      });

    this.subscription.add(passCreatePost);
  }


  onDeleteData(id: string) {
    this.isInProgress = true;
    this.isLoading = true;
    const deletePassword = this.passwordAccount.onDeleteData(id)
      .pipe(
        mergeMap(() => this.passwordAccount.onGetData()),
      )
      .subscribe((response: PasswordAccount[]) => {
        response.length !== 0 ? this.availablePassAccounts = of(response) : this.availablePassAccounts = undefined;
        this.isInProgress = false;
        this.isLoading = false;
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
