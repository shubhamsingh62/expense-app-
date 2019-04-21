import { Injectable } from '@angular/core';

// import 'rxjs/add/operator/catch'
// import 'rxjs/add/operator/do'
// import 'rxjs/add/operator/toPromise'
// import {HttpClient,HttpHeaders} from '@angular/common/http'
import {HttpErrorResponse,HttpParams,HttpClient} from '@angular/common/http'
import { Observable} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AppService {

  baseUrl ="http://localhost:3000/api/v1";
  constructor(public http:HttpClient) { }


  public getUserInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
 }  


  public setUserInfoInLocalStorage = (data) =>{
    localStorage.setItem('userInfo', JSON.stringify(data))
}  
public signUp(data):Observable<any>{
  const params = new HttpParams()
  .set('firstName',data.firstName)
  .set('lastName',data.lastName)    
  .set('email',data.email)
  .set('password',data.password)
  .set('mobileNumber',data.mobileNumber)
  return this.http.post(this.baseUrl+'/users/signup',params);
}  

public signin(data):Observable<any>{
  const params = new HttpParams()
  .set('email',data.email)
  .set('password',data.password)
  return this.http.post(this.baseUrl+'/users/login',params);
}

public create(data):Observable<any>{
  const params = new HttpParams()
  .set('name',data.name)
  .set('price',data.price)
  .set('category',data.category)
  return this.http.post(this.baseUrl+'/users/create',params)
}

public getall():Observable<any>{
  return this.http.get(this.baseUrl+'/users/all')
}
private handleError(err: HttpErrorResponse) {
  let errorMessage = '';
  if (err.error instanceof Error) {
    errorMessage = `An error occurred: ${err.error.message}`;
  } else {
    errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
  } // end condition *if
  console.error(errorMessage)
  return Observable.throw(errorMessage);
}  // End handleError

}
