import { Component, ElementRef, EventEmitter, Output, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { user } from 'src/app/constant/constant';
import { ApiService } from 'src/app/service/api.service';
import { AuthService } from 'src/app/service/auth-service/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  modalRef!: NgbModalRef;
  email!: string;
  passwordVisible: boolean = false;
  forgotPasswordForm!: FormGroup;
  unlockAccountForm!: FormGroup;
  changePasswordForm!:FormGroup;

  captchaResponse: string | null = null;
  siteKey = "6Lf2pA0qAAAAAD2JbsviBovs_0v17NjbY6Nz-7Pe";

  expectedCaptcha: string = 'example'; 
  captchaInput: string = '';
  captchaInvalid: boolean = false;
 

  captchaText: string = '';
  userInput: string = '';
  isCaptchaValid: boolean = false;
  errorMessage: string = '';
  isVerificationAttempted: boolean = false;
  @ViewChild('captchaCanvas', { static: false })
  captchaCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('changePasswordContent')
  changePasswordContent!: TemplateRef<any>;
  modalPayload: any;

  alertMessage: string | null = null;
  alertType: 'success' | 'error' | 'info' | null = null;
  alertTimeout:any;

  // @Output() isLogin = new EventEmitter();
  @Output() isLogin = new EventEmitter<{isLoggedIn: boolean, screens: any[]}>();
  constructor(
    private fb: FormBuilder, 
    private modalService: NgbModal,
    private authService: AuthService,
    private elRef: ElementRef,
    private router: Router,
    private toastr: ToastrService
  ) { 
    this.generateCaptcha(); 
  }

  ngOnInit(): void {
  
    this.loginForm = this.fb.group({
      companyCode: ['', [Validators.required]],
      employeeCode: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });

    this.forgotPasswordForm = this.fb.group({
      EmailID: ['', [Validators.required, Validators.email]],
      MobileNo:['', [Validators.required]]
    });

    this.unlockAccountForm = this.fb.group({
      dob: ['', Validators.required],
      doj: ['', Validators.required]
    });

    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });
  }

  noSpecialCharsValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const regex = /^[a-zA-Z0-9]*$/; // Regex to allow only alphanumeric characters
      const isValid = regex.test(control.value);
      return isValid ? null : { 'pattern': { value: control.value } };
    };
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
  get f() {
    return this.loginForm.controls;
  }

  get fp() {
    return this.forgotPasswordForm.controls;
  }

  get ua() {
    return this.unlockAccountForm.controls;
  }

  get cp(){
    return this.changePasswordForm.controls;
  }
 
  ngAfterViewInit(): void {
    this.generateCaptcha();
  }

 
  generateCaptcha(): void {
    const length = 6; 
    this.captchaText = Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
    this.renderCaptcha();
}

  renderCaptcha(): void {
    if (this.captchaCanvas && this.captchaCanvas.nativeElement) {
      const canvas = this.captchaCanvas.nativeElement;
      const context = canvas.getContext('2d');
  
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = '30px Arial';
        context.fillText(this.captchaText, 10, 30);
      } else {
        console.error('Failed to get canvas context');
      }
    } else {
      console.error('Canvas element not found or initialized');
    }
  }
  verifyCaptcha(): void {
    const userInputLower = this.userInput.trim().toLowerCase();
    const captchaTextLower = this.captchaText.toLowerCase();
  
    this.isVerificationAttempted = true;
    this.isCaptchaValid = userInputLower === captchaTextLower;
  
    if (!this.isCaptchaValid) {
      console.log('Incorrect CAPTCHA code. Please try again.');
    } else {
      console.log('CAPTCHA verified successfully.');
    }
  }
  
  resolved(captchaResponse: any): void {
    this.captchaResponse = captchaResponse;
    this.captchaInvalid = !captchaResponse;
  }
  // onSubmit() {
  //   if (this.loginForm.invalid) {
  //     return;
  //   }
  
  //   const payload = {
  //     companyCode: this.loginForm.get('companyCode')?.value,
  //     employeeCode: this.loginForm.get('employeeCode')?.value,
  //     password: this.loginForm.get('password')?.value
  //   };
  
  //   this.authService.login(payload.companyCode, payload.employeeCode, payload.password).pipe(first())
  //     .subscribe({
  //       next: (res: any) => {
  //         console.log('Login successful', res);
  //         this.showAlertMessage('Login successful' , 'success')
  //         localStorage.setItem('token', res.token);
  //         this.isLogin.emit(true);
          
  //         if (res.user.firstLoggedIn === true) {
         
  //           const modalRef = this.modalService.open(this.changePasswordContent, { centered: true });
  //         } else {
  //           this.router.navigate(['/home']);
  //         }
  //       },
  //       error: (error: any) => {
  //         console.error('Login failed', error);
  //       }
  //     });
  // }
  
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      this.showAlertMessage('Please fill in all required fields', 'error');
      return;
    }

    const payload = {
      companyCode: this.loginForm.get('companyCode')?.value,
      employeeCode: this.loginForm.get('employeeCode')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.authService.login(payload.companyCode, payload.employeeCode, payload.password).pipe(first())
      .subscribe({
        next: (res: any) => {
          console.log('Login successful', res);
          this.showAlertMessage('Login successful', 'success');
          localStorage.setItem('token', res.token);
          // this.isLogin.emit(true);
          this.isLogin.emit({isLoggedIn: true, screens: res.user.screens});

          if (res.user.firstLoggedIn === true) {
            const modalRef = this.modalService.open(this.changePasswordContent, { centered: true });
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (error: any) => {
          console.error('Login failed', error);
          this.showAlertMessage('Invalid company code, employee code, or password', 'error');
        }
      });
  }
    openForgotPasswordModal(loginForm:FormGroup , content: any) {
      var payload = {
        userName: this.loginForm.get('employeeCode')?.value, 
        companyCode: this.loginForm.get('companyCode')?.value
      };
    
      this.authService.forgotPassword(payload).pipe(first())
        .subscribe({
          next: (res: any) => {
            if (res.code === 1) {
              this.modalService.open(content);
              console.log(res.message);

            } else {
              console.log(res.message);
              this.showAlertMessage(res.message)
            }
          },
          error: (error: any) => {
            console.log(error.message);
            this.showAlertMessage(error.message,'error')
          }
        });
    }
  
    openUnlockAccountModal(loginForm: FormGroup, content: any) {
      var payload = {
        userName: this.loginForm.get('employeeCode')?.value, 
        companyCode: this.loginForm.get('companyCode')?.value
      };
    
      this.authService.unlockedUser(payload).pipe(first())
        .subscribe({
          next: (res: any) => {
            if (res.code === 1) {
              this.modalService.open(content);
              console.log(res.message);
              this.showAlertMessage(res.message,'success')
            } else {
              console.log(res.message);
              this.showAlertMessage(res.message)
            }
          },
          error: (error: any) => {
            console.log(error.message);
            this.showAlertMessage(error.message,'error')
          }
        });
    }

    submitUnlockAccountForm(){
      var payload = {
        userName: this.loginForm.get('employeeCode')?.value, 
        companyCode: this.loginForm.get('companyCode')?.value,
        dob:this.unlockAccountForm.get('dob')?.value,
        doj:this.unlockAccountForm.get('doj')?.value
      };
    
      this.authService.unlockedUser(payload).pipe(first())
        .subscribe({
          next: (res: any) => {
            if (res.code === 1) {
              // this.modalService.open(content);
              console.log(res.message);
              this.showAlertMessage('Account unlocked successfully', 'success'); 
              this.modalService.dismissAll();
            } else {
              console.log(res.message);
            this.showAlertMessage(res.message,"error")
              this.modalService.dismissAll();
            }
          },
          error: (error: any) => {
            console.log(error.message);
            this.showAlertMessage('Failed to unlock account', 'error')
            this.modalService.dismissAll();
          }
        });
    }
    
    submitForgotPasswordForm(content: TemplateRef<any>): void {

      this.markFormGroupTouched(this.forgotPasswordForm);
      if (this.forgotPasswordForm.invalid) {
        this.showAlertMessage('please fill required field','error')
        return;
      }
      var payload = {
        userName: this.loginForm.get('employeeCode')?.value, 
        companyCode: this.loginForm.get('companyCode')?.value,
        EmailID:this.forgotPasswordForm.get('EmailID')?.value,
        MobileNo:this.forgotPasswordForm.get('MobileNo')?.value
      };
    
      this.authService.forgotPassword(payload).pipe(first())
        .subscribe({
          next: (res: any) => {
            if (res.code === 1) {
              console.log(res.message);
              // this.toastr.success(' successfully', 'Success'); 
              this.showAlertMessage(res.message, 'success');
              this.modalService.dismissAll();
            } else {
              console.log(res.message);
              this.modalService.dismissAll();
              this.showAlertMessage(res.message, 'error');
            }
          },
          error: (error: any) => {
            console.log(error);
            this.showAlertMessage('Failed to forgot password', 'error');
            // this.toastr.error('Failed to forgot password', 'Error')
            this.modalService.dismissAll();
          }
        });
    }
    openChangePasswordModal(content: TemplateRef<any>) {
      this.modalService.open(content, { centered: true });
    }
    closeForgotPasswordModal() {
      this.modalService.dismissAll();
    }
  
    closeUnlockAccountModal() {
      this.modalService.dismissAll();
    }

  closeChangePasswordModal(){
    this.modalService.dismissAll();
  }
  submitChangePasswordForm() {
    if (this.changePasswordForm.invalid) {
      return;
    }
  
    const { currentPassword, newPassword, confirmNewPassword } = this.changePasswordForm.value;
    const token = localStorage.getItem('token');
    const companyCode = this.loginForm.get('companyCode')?.value;
    const userName = this.loginForm.get('employeeCode')?.value;
  
    if (!token) {
      console.error('No token found');
      this.showAlertMessage('No token found' ,'error');
      return;
    }
  
    if (newPassword !== confirmNewPassword) {
      console.log('New password and confirm new password must match.');
      this.showAlertMessage('New password and confirm new password must match.' ,'error');
      return;
    }
  
    const payload = {
      companyCode: companyCode,
      userName: userName,
      currentPassword: currentPassword,
      newPassword: newPassword
    };
  
    this.authService.changePassword(token, payload).pipe(first())
      .subscribe({
        next: (res: any) => {
          console.log('Password change successful', res);
          this.showAlertMessage('Password changed successfully', 'success');
          this.modalService.dismissAll();
          this.router.navigate(['/home']);
        },
        error: (error: any) => {
          console.error('Password change failed', error);
          this.showAlertMessage('Failed to change password', 'error');
          this.modalService.dismissAll();
        }
      });
  }
  showAlertMessage(message: string, type?: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type || 'info'; 

    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    //    this.alertTimeout = setTimeout(() => {
    //   this.alertMessage = null;
    //   this.alertType = null;
    // }, 3000); 
  }

  dismissAlert(): void {
    this.alertMessage = null;
    this.alertType = null;
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
      this.alertTimeout = null;
    }
  }
}
