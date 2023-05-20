import { Component } from '@angular/core';
import { FbService, User } from '../fb.service';
import { LoadingController} from "@ionic/angular";

declare var dynamics: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  checked: boolean[] = [];

  constructor(public fbService: FbService, public loadingController: LoadingController) {
    this.fbService.users.subscribe(
        (data) => {
          for (let i = 0; i < data.length; i++) {
            this.checked.push(false);
          }
        }
    );
  }

   showDetail(user: User, index: number) {
     let arrows = []
     if(this.checked[index]) {
       for (let i = 0; i < user.shift.length; i++) {
         if (user.shift[i]) {
           arrows.push("play");
         }
       }
     }
     return arrows;
   }

   animate(i: number, j: number) {
    this.showLoading();

      let element = document.getElementById(`arrow${i}${j}`);
      dynamics.animate(element, {
        translateX: 100,
        translateY: 0,

      }, {
        type: dynamics.linear,
        duration: 1500,
        // when the animation is complete, close the loading controller
        complete: () => {
          this.loadingController.dismiss();
        }
      });
   }
   showLoading(){
      this.loadingController.create({
        message: 'Moving...',
        duration: 2000
      }).then((res) => {
        res.present();
        res.onDidDismiss().then((dis) => {
          console.log('Done!');
        });
      });


   }
   deleteUser(user: User) {
     this.fbService.deleteUser(user);
   }
}


