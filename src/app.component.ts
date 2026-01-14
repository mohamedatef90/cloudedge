import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { DashboardAnimationService } from './services/dashboard-animation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SplashScreenComponent],
})
export class AppComponent implements OnInit {
  private animationService = inject(DashboardAnimationService);
  private router = inject(Router);
  
  showSplash = signal(false);

  ngOnInit(): void {
    if (this.animationService.introPlayed()) {
      this.showSplash.set(false);
      if(this.router.url === '/' || this.router.url === '/#/') {
         this.router.navigate(['/app/cloud-edge']);
      }
    } else {
      this.showSplash.set(true);
    }
  }

  onAnimationFinished(): void {
    this.showSplash.set(false);
    this.animationService.setIntroPlayed();
    this.router.navigate(['/app/cloud-edge']);
  }
}