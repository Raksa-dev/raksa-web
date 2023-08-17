import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule, NgbModalModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgSelectModule } from '@ng-select/ng-select';

import { PagesRoutingModule, RoutingComponents } from './pages-routing.module';


@NgModule({
    declarations: [RoutingComponents],
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        NgbModule, NgbModalModule, NgbNavModule,
        CarouselModule,
        NgSelectModule,
        PagesRoutingModule
    ]
})
export class PagesModule { }