import { Component } from '@angular/core';
import { FbService, User } from '../fb.service';
import { FormBuilder, FormControl, Validators, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  loginForm: FormGroup;
  userName: string = '';
  shift: boolean[] = [];
  morning: boolean = false;
  afternoon: boolean = false;
  night: boolean = false;
  status: string = "Error";
  quantity: number = 0;
  approve: boolean = false;


  constructor(private fbService: FbService, private formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z0-9 ]*')])],
    });
  }
  reset() {
    this.userName = '';
  }
  verify() {
    if (this.loginForm.valid) {
      this.status = "Pending";
      this.fbService.presentAlert("Verified", "Information is valid");
    } else {
      this.status = "Error";
      this.fbService.presentAlert("Error", "Information is invalid");
    }
  }
  inc() {
    this.quantity++;
  }
  dec() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }
  insert() {
    this.shift = [this.morning, this.afternoon, this.night];
    this.fbService.createUser({
      name: this.userName,
      shift: this.shift,
      quantity: this.quantity,
      status: this.status,
      approved: this.approve
});
    }


}
