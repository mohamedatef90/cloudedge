import { ChangeDetectionStrategy, Component, OnInit, output } from '@angular/core';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashScreenComponent implements OnInit {
  animationFinished = output<void>();

  ngOnInit(): void {
    setTimeout(() => {
      this.animationFinished.emit();
    }, 5000);
  }
}
