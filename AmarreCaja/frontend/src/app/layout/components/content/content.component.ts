import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, selectPermisosState } from 'app/store/app.states';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentComponent implements OnInit {

    getState: Observable<any>;
    subsAuth: Subscription;
    breadcrumb: any;

    constructor(
        private store: Store<AppState>,
    ) {
        this.getState = this.store.select(selectPermisosState);
    }

    ngOnInit() {
        this.subsAuth = this.getState.subscribe((state) => {
            this.breadcrumb = state.breadcrumb;
        })
    }
}
