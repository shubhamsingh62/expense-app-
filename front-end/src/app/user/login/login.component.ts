import { Component, OnInit , ViewContainerRef } from '@angular/core';
import {Router} from '@angular/router'
import { AppService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: any;
  password: any;

  constructor(public router:Router,public appservice:AppService,vcr: ViewContainerRef) { 
    console.log("login constructor are called")
  }

  ngOnInit() {
  }
   
public signinFunction = ()=>{
  if(!this.email){
  }else if(!this.password){
  }else {
    let data = {
      email:this.email,
      password:this.password
    }

    this.appservice.signin(data).subscribe((apiResponse)=>{
       if(apiResponse.status === 200){
         console.log("apisuccessfully called")
         console.log(apiResponse)
         Cookie.set('authToken',apiResponse.data.authToken)
         Cookie.set('reciverId',apiResponse.data.userDetails.userId)
         Cookie.set('reciverName',apiResponse.data.userDetails.firstName+' '+apiResponse.data.userDetails.lastName)
         this.appservice.setUserInfoInLocalStorage(apiResponse.data.userDetails)
         this.router.navigate(['/expence'])
       }
    })
  }
}
}
