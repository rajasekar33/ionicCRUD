import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore'


import { AddListPage } from '../add-list/add-list'
import { Observable } from 'rxjs';



@Component({
  selector: 'page-crud-form',
  templateUrl: 'crud-form.html',
})
export class CrudFormPage {

  itemList$:  Observable<any[]>;
  itemArray = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, private database: AngularFirestore) {

         this.itemList$ = this.database.collection('add-list').valueChanges();
  }

  navigateToAddList(){
    this.navCtrl.push(AddListPage)
  }
}
