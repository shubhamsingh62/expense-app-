import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import {RouterModule} from '@angular/router'
import { LoginComponent } from './user/login/login.component';
import { AppService } from './app.service';
import { FormsModule }   from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { ExpenceComponent } from './expence/expence.component';
import { FileUploadModule } from 'ng2-file-upload';



 
@NgModule({
  declarations: [
    AppComponent,
    ExpenceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    UserModule,
    FormsModule,
    HttpClientModule,
    FileUploadModule,
    RouterModule.forRoot([
        {path:'login',component:LoginComponent,pathMatch:'full'},
        {path:'',redirectTo:'login',pathMatch:'full'},
        {path:'expence',component:ExpenceComponent},
        {path:'*',component:LoginComponent},
        {path:'**',component:LoginComponent}
    ])
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
