import { Component } from '@angular/core';
import { BUILD_DATE, BRANCH } from 'app/app.constants';

@Component({
    selector: 'jhi-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent {
    buildDate = BUILD_DATE;
    branch = BRANCH;
}
