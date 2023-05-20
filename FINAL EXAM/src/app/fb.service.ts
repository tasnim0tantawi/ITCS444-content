import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AlertController} from "@ionic/angular";
import {map} from "rxjs/operators";
import { Router } from '@angular/router';
export interface User {
  id?: string;
  name: string;
  shift: boolean[];
  quantity: number;
  status: string;
  approved: boolean;
}
@Injectable({
  providedIn: 'root'
})


export class FbService {
  usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private alertCtrl: AlertController, private router: Router) {
    this.usersCollection = db.collection<User>('finalexam');
    this.users = this.usersCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        }))
    );
  }
  createUser(user: User) {
    let id = "";
    return this.usersCollection.add(user).then(
        () => {
          // get the user id from the firebase
          this.usersCollection.get().subscribe(
              (querySnapshot) => {
                querySnapshot.forEach(
                    (doc) => {
                      if (doc.data().name === user.name) {
                        id = doc.id;
                      }
                    }
                );
              }
          );

          this.presentAlert(id, 'User is added successfully');

        }
    ).catch(
        () => {
          this.presentAlert('Error', 'Something went wrong');
        }
    )
  }
  getUserByName(name: string) {
    return this.db.collection('finalexam', ref => ref.where('name', '==', name)).valueChanges();
  }
  updateUser(user: User) {
    return this.usersCollection.doc(user.id).update(user).then(
        () => {
          this.presentAlert('Success', 'User is updated successfully');
        }
    ).catch(
        () => {
          this.presentAlert('Error', 'Something went wrong');
        }
    )
  }
  deleteUser(user: User) {
    return this.usersCollection.doc(user.id).delete().then(
        () => {
          this.presentAlert('Success', 'User is deleted successfully');
        }
    ).catch(
        () => {
          this.presentAlert('Error', 'Something went wrong');
        }
    )
  }
  async presentAlert(header: string, message: string) {
     const alert = await this.alertCtrl.create({
        header,
        message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

