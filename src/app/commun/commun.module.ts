import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SigninRedirectCallbackComponent } from '@app/commun/components/signin-redirect-callback/signin-redirect-callback.component';
import { AutofocusDirective } from "@app/commun/directives/autofocus.directive";
import { CarouselSwipeDirective } from "@app/commun/directives/carousel-swipe.directive";
import { CallbackPipe } from "@app/commun/pipes/callback.pipe";
import { AlertModule } from 'ngx-bootstrap/alert';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PageLoadingComponent } from "./components/page-loading/page-loading.component";
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalSessionExpiredComponent } from './components/modal-session-expired/modal-session-expired.component';
import { FilArianeComponent } from './components/fil-ariane/fil-ariane.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { DateInputsComponent } from './components/date-inputs/date-inputs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextWithEuroSymbolComponent } from './components/text-with-euro-symbol/text-with-euro-symbol.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { MessageInfoComponent } from './components/message-info/message-info.component';
import { StatsComponent } from './components/stats/stats.component';
import { ActionSuiteComponent } from './components/actions-suite/action-suite/action-suite.component';
import { ActionsSuiteComponent } from './components/actions-suite/actions-suite.component';

@NgModule({
  declarations: [
    AutofocusDirective,
    CarouselSwipeDirective,
    CallbackPipe,
    FilArianeComponent,
    ModalSessionExpiredComponent,
    NotFoundComponent,
    PageLoadingComponent,
    SigninRedirectCallbackComponent,
    DateInputsComponent,
    TextWithEuroSymbolComponent,
    TooltipComponent,
    MessageInfoComponent,
    StatsComponent,
    ActionSuiteComponent,
    ActionsSuiteComponent
  ],
  imports: [
    AlertModule.forRoot(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
  ],
  exports: [
    AutofocusDirective,
    CarouselSwipeDirective,
    CallbackPipe,
    CommonModule,
    FilArianeComponent,
    PageLoadingComponent,
    DateInputsComponent,
    TextWithEuroSymbolComponent,
    TooltipComponent,
    MessageInfoComponent,
    StatsComponent,
    ActionSuiteComponent,
    ActionsSuiteComponent
  ]
})
export class CommunModule { }
