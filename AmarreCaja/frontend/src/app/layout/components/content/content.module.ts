import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

import { ContentComponent } from 'app/layout/components/content/content.component';
import { BreadcrumbsComponent } from '../../../utilerias/breadcrumbs/breadcrumbs.component'

@NgModule({
    declarations: [
        ContentComponent,
        BreadcrumbsComponent
    ],
    imports     : [
        RouterModule,
        FuseSharedModule
    ],
    exports     : [
        ContentComponent
    ]
})
export class ContentModule
{
}
