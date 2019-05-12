import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Account, AccountService, LoginModalService } from 'app/core';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;

    constructor(
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private router: Router
    ) {}

    ngOnInit() {
        console.log('init!');
        this.proceedWithUser();
        this.registerAuthenticationSuccess();
    }

    private proceedWithUser() {
        this.accountService.identity().then((account: Account) => {
            this.account = account;
            if (this.isAuthenticated()) {
                console.log('logged in!');
                if (this.accountService.hasAnyAuthority(['ROLE_CUSTOMER'])) {
                    console.log('role: ROLE_CUSTOMER');
                    this.router.navigate(['/offer']);
                } else if (this.accountService.hasAnyAuthority(['ROLE_COMPANY_OWNER'])) {
                    console.log('role: ROLE_COMPANY_OWNER');
                    this.router.navigate(['/reservation-order']);
                } else if (this.accountService.hasAnyAuthority(['ROLE_ADMIN'])) {
                    console.log('role: ROLE_ADMIN);');
                    this.router.navigate(['/admin/user-management']);
                }
            }
        });
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', () => {
            this.proceedWithUser();
        });
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
}
