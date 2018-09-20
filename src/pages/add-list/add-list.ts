import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'

import { ListItem } from '../../app/models/add-list/add-list.interface';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms'


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
  }



  addItem(valid, value){
    this.submitted = true;
    console.log(value, valid)

    if(valid){
      this.addListRef$.push({
        name: value.name,
        email: value.email,
        gender: value.gender,
        country: value.country,
        languages: value.languages
      });

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
