import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { environment } from '../../../environements/env';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  url: string = "";
  message: string = "";
  
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  constructor(private authService: AuthServiceService, private router: Router) {}

  ngOnInit(): void {
    this.getGoogleUrl();
  }

  getGoogleUrl(): void {
    this.authService.getGoogleUrl().subscribe({
      next: (data: any) => this.url = data.authURL,
      error: (error: any) => console.log(error.message)
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.message = "يرجى ملء جميع الحقول بشكل صحيح";
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (response: any) => {
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        console.log(email,password);
        console.log(error.message);
        this.message = error.message || "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.";
      }
    });
  }

  // Helper methods for form validation
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
