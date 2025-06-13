import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AuthServiceService } from './services/auth-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  
  constructor(private authService: AuthServiceService, private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params["code"] !== undefined){
        this.authService.getToken(params["code"]).subscribe(result => {
          if(result === true){
            this.router.navigate(['/dashboard']);
          }
          else{
            this.router.navigate(['/login']);
          }
        });
      }
    })
  }


}
