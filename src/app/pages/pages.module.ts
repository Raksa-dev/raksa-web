import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule, NgbModalModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgSelectModule } from '@ng-select/ng-select';

import { PagesRoutingModule, RoutingComponents } from './pages-routing.module';
import { AdminComponent } from './admin/admin.component';
import { LinkcreationComponent } from './admin/linkcreation/linkcreation.component';
import { AboutousComponent } from './aboutous/aboutous.component';
import { ContactousComponent } from './contactous/contactous.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { TermsandconditionsComponent } from './termsandconditions/termsandconditions.component';


@NgModule({
    declarations: [RoutingComponents, AdminComponent, LinkcreationComponent, AboutousComponent, ContactousComponent, PrivacypolicyComponent, TermsandconditionsComponent],
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