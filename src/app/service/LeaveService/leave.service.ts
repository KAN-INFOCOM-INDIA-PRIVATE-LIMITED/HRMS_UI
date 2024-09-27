import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { LeaveRequestDto } from 'src/app/models/leave-request.dto';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'https://localhost:7254/UserDetails/GetLeaveRequestsForApprover';
  private apiUrl1 = 'https://localhost:7254/UserDetails/LeaveRequest';
  private baseUrl = 'https://localhost:7254/UserDetails';
  private holidayApiUrl = 'https://localhost:7254/UserDetails/FetchHolidayDetails';
  constructor(private http : HttpClient) { }
  
  fetchEmployeeLeaveDetails(employeeCode: string): Observable<any> {
    const url = `${environment.apiUrl}/UserDetails/FetchEmployeeLeaveDetails`;
    return this.http.post(`${environment.apiUrl}/UserDetails/FetchEmployeeLeaveDetails`, { employeeCode });
  }
  fetchHolidayDetails(employeeCode: string): Observable<any> {
    const url = this.holidayApiUrl;
    return this.http.post(url, { employeeCode });
  }
  
  applyLeave(leaveRequestPayload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/UserDetails/LeaveRequest`, leaveRequestPayload);
  }
 
  fetchCompOffLeaves(employeeCode: string): Observable<any> {
    debugger
    const payload = { employeeCode }; 
    return this.http.post<any>(`${this.baseUrl}/FetchCompOffLeaves`, payload);
  }

   getLeaveRequests(payload: any): Observable<LeaveRequestDto[]> {
    // const params = new HttpParams().set('leaveApprover', payload);
    return this.http.post<LeaveRequestDto[]>(`${environment.apiUrl}/UserDetails/GetLeaveRequests`, payload);
  }

  getLeaveHistory(payload: any): Observable<LeaveRequestDto[]> {
    // const params = new HttpParams().set('leaveApprover', payload);
    return this.http.post<LeaveRequestDto[]>(`${environment.apiUrl}/UserDetails/FetchLeaveHistory`, payload);
  }

  getRegularizationRequests(payload: any): Observable<LeaveRequestDto[]> {
    // const params = new HttpParams().set('leaveApprover', payload);
    return this.http.post<LeaveRequestDto[]>(`${environment.apiUrl}/UserDetails/FetchRegularizationRequests`, payload);
  }

  // applyLeave(leaveRequestPayload: any): Observable<any> {
  //   return this.http.post(`${environment.apiUrl}/UserDetails/LeaveRequest`, leaveRequestPayload);
  // }

  approveLeaveRequest(leaveApprovalPayload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/UserDetails/LeaveApproval`, leaveApprovalPayload);
  }

  approveRegularizationRequest(leaveApprovalPayload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/UserDetails/RegularizationApproval`, leaveApprovalPayload);
  }

  searchEmployee(payload:any):Observable<any>{
    return this.http.post(`${environment.apiUrl}/UserDetails/GetEmployeeDetails`,payload);
  }
  getAttendanceData(payload:any):Observable<any>{
    return this.http.post(`${environment.apiUrl}/UserDetails/GetCalendarDetails`,payload);
  }

  getEmployeeCode(){
    const token = JSON.parse(localStorage.getItem('token') as string);
    const decodedToken: any = jwtDecode(token);
    return decodedToken.unique_name;
  }
}
