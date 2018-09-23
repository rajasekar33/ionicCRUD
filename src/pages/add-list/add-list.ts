import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';



@Component({
  selector: 'page-add-list',
  templateUrl: 'add-list.html',
})
export class AddListPage {

  item : FormGroup;
  submitted = false;

  addListRef$ : AngularFireList<any>;

  countries = [
    {name: 'India', value: 'india'},
    {name: 'China', value: 'china'},
    {name: 'Us', value: 'us'},
    {name: 'UK', value: 'uk'},
  ]
  language = [
    { id: 100, name: 'Tamil' },
    { id: 200, name: 'English' },
    { id: 300, name: 'Telugu' },
    { id: 400, name: 'Hindi' }
  ];

  itemKey;
  singleItem:AngularFireObject<any>;;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public fb: FormBuilder, private database: AngularFireDatabase ) {

    this.addListRef$ = this.database.list('add-list');

    this.item = this.fb.group({
      name: new FormControl('', Validators['required']),
      email: new FormControl('', Validators['required']),
      gender: new FormControl('', Validators['required']),
      //maried: new FormControl('', Validators['required']),
      languages: this.fb.array([]),
      country: new FormControl('')
    });

    this.itemKey = this.navParams.get('edit');

    console.log(this.itemKey)
    if(this.itemKey){
     
      this.singleItem = this.database.object(`add-list/${this.itemKey}`)

        this.singleItem.snapshotChanges().subscribe(data=>{{
            let item = data.payload.val();

            if(item){
              this.item.get('name').patchValue(item.name);
              this.item.get('email').patchValue(item.email);
              this.item.get('gender').patchValue(item.gender);
              this.item.get('country').patchValue(item.country);
              this.item.setControl('languages', this.fb.array(item.languages || []));
            }
        }});
    }
  }



  addItem(valid, value){
    this.submitted = true;
    console.log(value, valid)

    if(valid){


      if(this.itemKey){

        this.database.object(`add-list/${this.itemKey}`).update(value).then(res=>{
          console.log(res);
        }).catch(err=>{
          console.log(err)
        })

      }else{

      this.addListRef$.push({
        name: value.name,
        email: value.email,
        gender: value.gender,
        country: value.country,
        languages: value.languages
      });
    }

      this.item.reset();
      this.navCtrl.pop();
    }
  }

  onChange(id, isChecked, index) {

    console.log(id, isChecked, index)

    // nested formarray, which is inside nested formgroup, inside outer array
    const answers = <FormArray>this.item.controls.languages;

   if(isChecked) {
      answers.push(new FormControl(id))
   } else {
      let idx = answers.controls.findIndex(x => x.value == id)
      answers.removeAt(idx)
   }
 }
}
