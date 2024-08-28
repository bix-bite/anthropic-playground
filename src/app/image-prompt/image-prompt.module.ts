import { NgModule, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagePromptRoutingModule } from './image-prompt-routing.module';
import { ImagePromptComponent } from './image-prompt.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ ImagePromptComponent ],
  imports: [
    CommonModule,
    ImagePromptRoutingModule,
    SharedModule,
  ]
})
export class ImagePromptModule {

}
