import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoaderComponent } from './pages/shared-components/laoder/loader.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { FooterComponent } from './pages/shared-components/footer/footer.component';
import { HeaderComponent } from './pages/shared-components/header/header.component';
import { EmployeeListDataComponent } from './pages/EmployeeDataManagement/employee-list-data.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ExpensepiechatComponent } from './pages/shared-components/expensepiechat/expensepiechat.component';
import { PrjstatuschartComponent } from './pages/shared-components/prjstatuschart/prjstatuschart.component';
import { EmpdeptchartComponent } from './pages/shared-components/empdeptchart/empdeptchart.component';
import { PaymentbarchartComponent } from './pages/shared-components/paymentbarchart/paymentbarchart.component';
import { JobPostComponent } from './pages/recruiter/job-post/job-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AddAttendanceComponent } from './pages/time-and-attendance/add-attendance/add-attendance.component';
import { ImportAttendancesComponent } from './pages/time-and-attendance/import-attendances/import-attendances.component';
import { EmplyeeDetailsSummaryComponent } from './pages/EmployeeData/employee-details-summary/employee-details-summary.component';
import { PersonalDetailsComponent } from './pages/EmployeeData/personal-details/personal-details.component';
import { EmploymentDetailsComponent } from './pages/EmployeeData/employment-details/employment-details.component';
import { DocumentsComponent } from './pages/EmployeeData/documents/documents.component';
import { ContactDetailsComponent } from './pages/EmployeeData/contact-details/contact-details.component';
import { NominationDetailsComponent } from './pages/EmployeeData/nomination-details/nomination-details.component';
import { EducationDetailsComponent } from './pages/EmployeeData/education-details/education-details.component';
import { BankDetailsComponent } from './pages/EmployeeData/bank-details/bank-details.component';
import { CompanyMasterComponent } from './pages/master/company-master/company-master.component';
import { MyApplicationComponent } from './pages/time-and-attendance/my-application/my-application.component';
import { ErrorInterceptor } from './service/error.interceptor';
import { JwtInterceptor } from './service/jwt.interceptor';
import { subNav } from './pages/shared-components/header/navbar1.component';
import { NoCommaNumberPipe } from './pages/customePipe/no-comma-number.pipe';
import { NoDataFound } from './pages/shared-components/no-data-found.component';
// import { EmployeeDataManagementComponent } from './pages/EmployeeDataManagement/employee-list-data.component';
import { CreateEmployeeComponent } from './pages/EmployeeDataManagement/create-employee/create-employee.component';
import { SalaryCalculatorComponent } from './pages/Payroll/salary-calculator/salary-calculator.component';
import { MyTimesheetComponent } from './pages/time-and-attendance/my-timesheet/my-timesheet.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FooterComponent,
    HeaderComponent,
    AdminDashboardComponent,
    ExpensepiechatComponent,
    PrjstatuschartComponent,
    EmpdeptchartComponent,
    PaymentbarchartComponent
    EmployeeListDataComponent,
    JobPostComponent,
    AddAttendanceComponent,
    ImportAttendancesComponent,
    EmplyeeDetailsSummaryComponent,
    PersonalDetailsComponent,
    EmploymentDetailsComponent,
    DocumentsComponent,
    ContactDetailsComponent,
    NominationDetailsComponent,
    EducationDetailsComponent,
    BankDetailsComponent,
    CompanyMasterComponent,
    MyApplicationComponent,
    LoaderComponent,
    subNav,
    NoCommaNumberPipe,
    NoDataFound,
    // EmployeeDataManagementComponent,
    SalaryCalculatorComponent,
    MyTimesheetComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    // ToastrModule.forRoot(),
    ToastrModule.forRoot({
      // positionClass: 'toast-top-center',
       
    }),
    NgbModule,
    NgxPaginationModule,
    Ng2SearchPipeModule    
  ],
  providers: [
              DatePipe,
              CUSTOM_ELEMENTS_SCHEMA,
              { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
