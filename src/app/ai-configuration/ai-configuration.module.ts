import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiConfigurationRoutingModule } from './ai-configuration-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RouterLink } from '@angular/router';
import { AiConfigurationComponent } from './ai-configuration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AccordionModule } from 'ngx-bootstrap/accordion';
@NgModule({
  declarations: [AiConfigurationComponent],
  imports: [
    CommonModule,
    SharedModule,
    AiConfigurationRoutingModule,
    RouterLink,
    BrowserAnimationsModule,
    AccordionModule.forRoot(),
  ]
})
export class AiConfigurationModule { }
