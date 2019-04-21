import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import { AppService } from 'src/app/app.service';
import { FileSelectDirective , FileUploader }  from 'ng2-file-upload';

const url = 'http://localhost:3000/user/upload'

@Component({
  selector: 'app-expence',
  templateUrl: './expence.component.html',
  styleUrls: ['./expence.component.css']
})
export class ExpenceComponent implements OnInit {
  name: any;
  category: any;
  allData: any;
  price: any;
  attachmentList: any = [];


  uploader:FileUploader = new FileUploader({url:url})

  constructor(private router:Router , public appservice:AppService) {

       this.uploader.onCompleteItem = (item:any , response:any , status:any , header:any) =>{
            this.attachmentList.push(JSON.parse(response))
       }

   }

  ngOnInit() {
    this.alldata()
  }

  public createdexpences = ()=>{
    let data = {
      name:this.name,
      price:this.price,
      category:this.category
    }
    this.appservice.create(data).subscribe((apiResponse)=>{
      if(apiResponse == 200){
        console.log("succesfully created")
      }
    })
    location.reload(); 
  }

  public alldata = () =>{
     this.name = ""
     this.price = ""
     this.category = ""
      //handling observables when using http service
      this.allData = this.appservice.getall().subscribe(
        data => {
          console.log(data)
          this.alldata=data["data"]
        },

        error =>{
          console.log("some error occured");
          console.log(error.errorMessage);
        }
    )
  }

  //for logout
  public logout = () =>{
    window.localStorage.clear();
    this.router.navigate(['/login'])
  }
}
