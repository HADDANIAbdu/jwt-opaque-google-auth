import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  user: any;
  editableUser: any;
  selectedFile: File | null = null;
  isGoogle: boolean = false;
  isUploading: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' | null = null;

  constructor(private authService: AuthServiceService, private router: Router){}

  ngOnInit(): void {
    this.user = this.authService.getItem('user-info');
    this.isGoogle = this.user?.isGoogle || false;
    this.editableUser = { ...this.user };
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = '';
      this.alertType = null;
    }, 5000);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadPhoto(file);
    }
  }

  uploadPhoto(file: File): void {
    this.isUploading = true;
    this.authService.addPhoto(file).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.user = this.authService.getItem('user-info');
          this.editableUser = { ...this.user };
          this.showAlert(response.message, response.status === 'success' ? 'success' : 'error');
        }
      },
      error: (error) => {
        console.error('Error uploading photo:', error);
        this.showAlert(error.message || 'حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى.', 'error');
      },
      complete: () => {
        this.isUploading = false;
      }
    });
  }

  onUpdateProfile(): void {
    this.authService.setItem('user-info', this.editableUser);
    this.user = { ...this.editableUser }; 
    this.showAlert('تم تحديث الملف الشخصي بنجاح!', 'success');
  }

}
