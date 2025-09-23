
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  
  showSplash = signal(true);

  ngOnInit(): void {
    if (this.animationService.introPlayed()) {
      this.showSplash.set(false);
    }
  }

  onAnimationFinished(): void {
    this.showSplash.set(false);
    this.animationService.setIntroPlayed();
  }
}