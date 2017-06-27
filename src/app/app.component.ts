import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyResolutions } from '../pages/myResolutions/myResolutions.component';
import { LoginComponent } from '../pages/login/login.component';
import { ManageResolutionsComponent } from '../pages/manageResolutions/manageResolutions.component';
import firebase from 'firebase';
import { firebaseConfig } from "./firebaseAppData";
import { AuthData } from '../providers/auth-data';
import { Utilities } from './utilities';
import { AlertController } from "ionic-angular";

firebase.initializeApp(firebaseConfig);

@Component({
  templateUrl: 'app.html',
  providers: [AuthData, Utilities]
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MyResolutions;

  pages: Array<{ title: string, component: any }>;
  notificationPressed: boolean = false;
  authenticated: boolean = false;

  constructor(public alertCtrl: AlertController, public authData: AuthData, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public utilities: Utilities) {
    this.initializeApp();

    firebase.auth().onAuthStateChanged((user) => {
      //utilities.user = user;

      if (user != undefined) {
        utilities.user = user;
        utilities.setUserData();
        //utilities.setPlayers();
        this.checkIfUserDeleted(user.uid);
      }
      if (!user) {
        utilities.loggedIn = false;
        utilities.user = {};
        this.rootPage = LoginComponent;
      } else {
        if (this.nav.getActive() == undefined) {
          //if (this.loadUserCredentials()) {
          this.rootPage = MyResolutions;
          this.authenticated = true;
          /*} else {
            this.rootPage = LoginComponent;
          }*/
        }
      }
      //this.utilities.countOpen();
      this.notificationPressed = false;
    });
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'MyResolutions', component: MyResolutions },
      { title: 'Resolution Management', component: ManageResolutionsComponent }
    ];

  }

  checkIfUserDeleted(userID: any): any {
    this.utilities.getUser(userID)
      .then(user => {
        console.log("in then");
        console.log(user);
        console.log(user.val());
        if (user.val() != null) {
          if (!this.utilities.inRegister) {
            this.checkForVerification();
          }
          if (user.val().email) {
            this.checkPlatform(userID);
          }
          this.utilities.loggedIn = true;
        } else {
          this.logout();
          let alert = this.alertCtrl.create({
            title: 'Ihr Account wurde gelöscht',
            message: 'Es scheint so als wäre Ihr Account gelöscht worden. Bitte kontaktieren Sie Ihren Trainer.',
            buttons: [
              {
                text: "Ok",
                handler: () => {

                }
              }
            ]
          });
          alert.present();
        }
      })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    this.authData.logoutUser();
    this.nav.setRoot(LoginComponent);
  }

  checkPlatform(userID) {
    let flag = false;
    let tempPlat = "";

    if (this.platform.is('ios')) {
      tempPlat = "ios";
    } else if (this.platform.is('android')) {
      tempPlat = "android";
    } else {
      tempPlat = "web";
    }

    this.utilities.updateUser(userID, { platform: tempPlat });
  }

  checkForVerification() {
    if (!this.utilities.user.emailVerified) {
      let confirm = this.alertCtrl.create({
        title: 'Bitte bestätigen Sie Ihre Email Adresse',
        message: 'Bestätigunsmail erneut senden?',
        buttons: [
          {
            text: 'Nein',
            handler: () => {
            }
          },
          {
            text: 'Ja',
            handler: () => {
              this.utilities.user.sendEmailVerification();
            }
          }
        ]
      });
      confirm.present();
    }
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
