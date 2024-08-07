import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private apiUrl = environment.apiUrl1;
   private userSubject: BehaviorSubject<User>;  
   public user: Observable<User>;
  
  constructor(private http: HttpClient) {  
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('token')!));
    this.user = this.userSubject.asObservable();
    
}

public get userValue() {
  return this.userSubject.value;
}
  login(companyCode: string, employeeCode: string, password: string): Observable<any> {
  
    const payload = { companyCode, employeeCode, password };
    return this.http.post(`${this.apiUrl}/Login`, payload);
  }

  unlockedUser(payload:any): Observable<any> {
   
    return this.http.post(`${this.apiUrl}/UnlockedUser`, payload);
  }

  forgotPassword(payload:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ForgotPassword`, payload);
  }
  changePassword(token: string, payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ChangePassword`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }


  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
debugger
    const decodedToken: any = jwtDecode(token);
    const username = decodedToken?.unique_name; 

    // Call the logout API
    return this.http.post(`${this.apiUrl}/LogOut`, { username }, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  clearSession() {
    localStorage.removeItem('token');
   
  }
 
}
