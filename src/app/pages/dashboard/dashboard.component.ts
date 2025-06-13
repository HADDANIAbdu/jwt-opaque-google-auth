import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { ApiResponse } from '../../services/auth-service.service';
import { response } from 'express';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  ResponseMessage: any;
  documents: Document[] = [];

  constructor(private authService: AuthServiceService, private router: Router){}

  ngOnInit(): void {
    this.getUserInfo();
    this.getDocuments();
  }

  getUserInfo(): void{ 
    this.authService.getUserInfo().subscribe({
      next: (response: ApiResponse) => {
        this.ResponseMessage = response;
      },
      error: (error:any) => {
        this.router.navigate(['/login']);
      }
    });
  }

  getDocuments(): void{
    this.authService.getDocuments().subscribe({
      next: response => this.documents = response.data,
      error: error => console.log(error.message)
    })
  }

}

interface Document{
  documentId: string,
  documentName: string,
  documentCategory: string,
  documentImage: any
}