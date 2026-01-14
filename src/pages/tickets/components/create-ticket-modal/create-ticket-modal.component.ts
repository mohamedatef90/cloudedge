import { ChangeDetectionStrategy, Component, output, input, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/icon/icon.component';

@Component({
  selector: 'app-create-ticket-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './create-ticket-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTicketModalComponent implements OnInit {
  isOpen = input.required<boolean>();
  close = output<void>();
  create = output<any>();
  
  private fb = inject(FormBuilder);
  ticketForm!: FormGroup;

  departments = ['Technical Support', 'Billing', 'Sales'];
  priorities = ['Low', 'Medium', 'High'];

  ngOnInit(): void {
    this.ticketForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(5)]],
      department: ['Technical Support', Validators.required],
      priority: ['Medium', Validators.required],
      message: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  onSave(): void {
    if (this.ticketForm.valid) {
      this.create.emit(this.ticketForm.value);
      this.ticketForm.reset({
        department: 'Technical Support',
        priority: 'Medium'
      });
    } else {
      this.ticketForm.markAllAsTouched();
    }
  }

  onClose(): void {
    this.ticketForm.reset({
        department: 'Technical Support',
        priority: 'Medium'
    });
    this.close.emit();
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
