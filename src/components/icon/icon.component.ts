
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class IconComponent {
  name = input.required<string>();
  className = input<string>('');
  fixedWidth = input<boolean>(false);

  iconClasses = computed(() => {
    const classes: { [key: string]: boolean } = {};
    this.name().split(' ').forEach(cls => classes[cls] = true);
    if (this.className()) {
        this.className().split(' ').forEach(cls => classes[cls] = true);
    }
    classes['fa-fw'] = this.fixedWidth();
    return classes;
  });
}
