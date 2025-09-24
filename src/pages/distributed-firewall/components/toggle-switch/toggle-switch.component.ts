
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleSwitchComponent {
  checked = input.required<boolean>();
  disabled = input<boolean>(false);
  size = input<'sm' | 'md'>('md');
  
  // In a real app, this would emit the new value.
  // For this demo, clicking it just toggles visually.
  change = output<boolean>();

  toggle(): void {
    if (!this.disabled()) {
      this.change.emit(!this.checked());
    }
  }
}
