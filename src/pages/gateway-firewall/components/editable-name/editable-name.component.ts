
import { ChangeDetectionStrategy, Component, ElementRef, effect, input, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';

@Component({
  selector: 'app-editable-name',
  templateUrl: './editable-name.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: contents; }
  `],
})
export class EditableNameComponent {
  name = input.required<string>();
  isPolicy = input<boolean>(false);
  save = output<string>();

  isEditing = signal(false);
  editedName = signal('');
  inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  constructor() {
    effect(() => {
        if(this.isEditing()) {
            this.editedName.set(this.name());
            setTimeout(() => this.inputEl()?.nativeElement.focus(), 0);
        }
    });
  }

  handleSave(): void {
    if (this.editedName().trim() && this.editedName() !== this.name()) {
        this.save.emit(this.editedName());
    }
    this.isEditing.set(false);
  }

  handleCancel(): void {
    this.isEditing.set(false);
  }
}
