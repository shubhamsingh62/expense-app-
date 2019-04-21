import { Component, OnInit , ViewContainerRef } from '@angular/core';
import {Router} from '@angular/router'
import { AppService } from 'src/app/app.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  firstName: any;
  lastName: any;
  email: any;
  mobileNumber: any;
  password: any;

  constructor(public router:Router,public appservice:AppService,vcr: ViewContainerRef
    ) { 
    console.log("signup constructor are called")
  }

  ngOnInit() {
  }

  public gotosignin = () =>{
    this.router.navigate(['/login'])
  }
  public signUpFunction = () =>{
    if(!this.firstName){
    }else if(!this.lastName){
    }else if(!this.email){
    }else if(!this.mobileNumber){
    }else if(!this.password){
    }else{
      let data = {
          firstName:this.firstName,
          lastName:this.lastName,
          email:this.email,
          mobileNumber:this.mobileNumber,
          password:this.password
      }

      this.appservice.signUp(data).subscribe((apiResponse)=>{
        console.log(apiResponse)
        if(apiResponse.status === 200){

          setTimeout(()=>{
            this.gotosignin()
          },2000)
        }else{
        
        }
        (err)=>{
          console.log('error')
        }
      })
    }
    
  }

}
