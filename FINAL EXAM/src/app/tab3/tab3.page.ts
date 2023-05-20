import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, GestureController } from '@ionic/angular';
import { FbService } from '../fb.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('zone') zone: ElementRef | undefined;
  @ViewChild('H') H!: ElementRef;
  @ViewChild('O') O!: ElementRef;
  @ViewChild('M') M!: ElementRef;
  @ViewChild('E') E!: ElementRef;

  List1: string[] = ["H", "O", "M", "E"];
  List2: string[] =[];
  List3: ElementRef<any>[] = [];

  constructor(private gestureCtrl: GestureController, private changeDetectorRef: ChangeDetectorRef, private alertCtr:AlertController, private fbService: FbService) {}

  ngAfterViewInit() {
    this.List3.push(this.H);
    this.List3.push(this.O);
    this.List3.push(this.M);
    this.List3.push(this.E);
    this.updateGestures();
  }
  updateGestures() {
    this.List3.forEach((item) => {
      const drag = this.gestureCtrl.create({
        el: item.nativeElement,
        gestureName: 'drag',
        threshold: 1,
        onStart: (ev) => {
          this.changeDetectorRef.detectChanges();

        },
        onMove: (ev) => {
          if (!(ev.currentX < this.zone!.nativeElement.getBoundingClientRect().left || ev.currentX >= this.zone!.nativeElement.getBoundingClientRect().right || ev.currentY < this.zone!.nativeElement.getBoundingClientRect().top || ev.currentY >= this.zone!.nativeElement.getBoundingClientRect().bottom)) {
            this.zone!.nativeElement.style.backgroundColor = "lightgray"
          } else {
            this.zone!.nativeElement.style.backgroundColor = "white"
          }
          item.nativeElement.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY}px)`;
          item.nativeElement.style.zIndex = 10;
          this.changeDetectorRef.detectChanges();
        },
        onEnd: (ev) => {
          if(!(ev.currentX < this.zone!.nativeElement.getBoundingClientRect().left || ev.currentX >= this.zone!.nativeElement.getBoundingClientRect().right || ev.currentY < this.zone!.nativeElement.getBoundingClientRect().top || ev.currentY >= this.zone!.nativeElement.getBoundingClientRect().bottom )){
            this.List2.push(item.nativeElement.id);
            item.nativeElement.style.display='none'
            console.log(this.List2);
            this.zone!.nativeElement.style.backgroundColor="white";
            this.changeDetectorRef.detectChanges();
          }
          else{
            item.nativeElement.style.transform = `translate(0px, 0px)`;
          }

        },
      });
      drag.enable();
    });
  }
  verify()
  {
    if (this.List1.toString() == this.List2.toString()) {
      this.fbService.presentAlert("Correct!","Congratulations! You have successfully completed the game!");
    }
    else {
      this.fbService.presentAlert("Incorrect","Sorry, got it wrong. Please try again!");
    }

  }

}
