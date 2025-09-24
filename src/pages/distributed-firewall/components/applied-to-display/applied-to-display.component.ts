import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../../../components/icon/icon.component';

@Component({
  selector: 'app-applied-to-display',
  templateUrl: './applied-to-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class AppliedToDisplayComponent {
  value = input.required<string>();
  isReadOnly = input<boolean>(false);
  edit = output<void>();

  onEdit(): void {
    if (!this.isReadOnly()) {
      this.edit.emit();
    }
  }
}
