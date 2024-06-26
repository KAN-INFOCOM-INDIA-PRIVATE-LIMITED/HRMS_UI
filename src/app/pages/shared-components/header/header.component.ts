import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() isLogin = new EventEmitter();
  // @Output() isCollapse =new EventEmitter();
 user:any;
 isCollapsed:boolean=false;

 constructor(private formBuilder: FormBuilder,
  private appService: ApiService){
    
  }
  ngOnInit(){
    this.user = JSON.parse(localStorage.getItem("user")as string);
    // debugger;
  }
  toggleCollapse() {
     this.isCollapsed =!this.isCollapsed
    // this.isCollapse.emit(true);
  }
  logout(){
    this.appService.logout();
    this.isCollapsed =!this.isCollapsed;
    this.isLogin.emit(false);
  }
}
