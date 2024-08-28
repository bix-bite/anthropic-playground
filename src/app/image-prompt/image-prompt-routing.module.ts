import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImagePromptComponent } from './image-prompt.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: 'imagePrompt',
    component: ImagePromptComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule],
  exports: [RouterModule]
})
export class ImagePromptRoutingModule { }
