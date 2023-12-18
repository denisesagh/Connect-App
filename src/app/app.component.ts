import { Component } from '@angular/core';
import {NavigationStart, Router} from "@angular/router";
import {CreatePostComponent} from "./component/createPost/create-post.component";
import {MatDialog} from "@angular/material/dialog";
import {LogoutComponent} from "./component/logout/logout.component"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {

  }


  ngOnInit(): void {


  }



  title = 'Connect-App';
}

