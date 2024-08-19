import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiConfigurationComponent } from './ai-configuration.component';

const routes: Routes = [{
  path: 'aiConfig',
  component: AiConfigurationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiConfigurationRoutingModule { }
