import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';


import { AddListPage } from '../add-list/add-list'
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';


@Component({
  selector: 'page-crud-form',
  templateUrl: 'crud-form.html',
})
export class CrudFormPage {

  itemList$:  Observable<any>;
  itemArray = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private database: AngularFireDatabase,
              private actionCont: ActionSheetController) {

         this.itemList$ = this.database.list('add-list')
                          .snapshotChanges()
                          .pipe(map(items => { 
                            return items.map(a => {
                              let data = a.payload.val();
                              data['key'] = a.payload.key;
                              return data;           // or {key, ...data} in case data is Obj
                            });
                          }));

        
  }

  navigateToAddList(){
    this.navCtrl.push(AddListPage)
  }

  showActionSheet(item){

    this.actionCont.create({
      title: `${item.name}`,

      buttons: [
        {
          text: 'edit',
          handler: ()=>{

            this.navCtrl.push(AddListPage, {edit: item.key});

          }
        },
        {
          text: 'delete',
          role: 'destructive',
          handler: ()=>{
            this.database.object('add-list/'+item.key).remove().then(res=>{

              console.log(res)
            }).catch(err=>{
              console.log(err)
            });
          }
        },
        {
          text: 'cancel',
          role: 'cancel',
          handler: ()=>{
            console.log('cancelling the option')
          }
        }
      ]
    }).present()

  }
}
