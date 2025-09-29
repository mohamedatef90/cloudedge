
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-group-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-group-modal.component.html',
  styleUrls: ['./edit-group-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditGroupModalComponent {

}
