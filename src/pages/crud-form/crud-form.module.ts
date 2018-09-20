import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrudFormPage } from './crud-form';

@NgModule({
  declarations: [
    CrudFormPage,
  ],
  imports: [
    IonicPageModule.forChild(CrudFormPage),
  ],
})
export class CrudFormPageModule {}
