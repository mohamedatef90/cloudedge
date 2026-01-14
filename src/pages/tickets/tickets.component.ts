import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../components/icon/icon.component';
import { CreateTicketModalComponent } from './components/create-ticket-modal/create-ticket-modal.component';

interface Ticket {
  id: string;
  subject: string;
  department: 'Sales' | 'Technical Support' | 'Billing';
  status: 'Open' | 'In Progress' | 'Closed';
  lastUpdate: string;
  priority: 'Low' | 'Medium' | 'High';
}

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, IconComponent, CreateTicketModalComponent],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketsComponent {
  isModalOpen = signal(false);

  tickets = signal<Ticket[]>([
    { id: '#73829', subject: 'Cannot access newly created VM', department: 'Technical Support', status: 'Open', lastUpdate: '2 hours ago', priority: 'High' },
    { id: '#73828', subject: 'Question about monthly invoice', department: 'Billing', status: 'In Progress', lastUpdate: '1 day ago', priority: 'Medium' },
    { id: '#73825', subject: 'Firewall rule not applying correctly', department: 'Technical Support', status: 'In Progress', lastUpdate: '2 days ago', priority: 'High' },
    { id: '#73824', subject: 'Inquiry about volume discounts', department: 'Sales', status: 'Closed', lastUpdate: '5 days ago', priority: 'Low' },
    { id: '#73822', subject: 'API rate limit question', department: 'Technical Support', status: 'Closed', lastUpdate: '1 week ago', priority: 'Low' },
  ]);

  handleCreateTicket(ticketData: Omit<Ticket, 'id' | 'lastUpdate' | 'status'>): void {
    const newTicket: Ticket = {
      ...ticketData,
      id: `#${Math.floor(Math.random() * 90000) + 10000}`,
      status: 'Open',
      lastUpdate: 'Just now',
    };
    this.tickets.update(currentTickets => [newTicket, ...currentTickets]);
    this.isModalOpen.set(false);
  }
  
  getStatusClass(status: Ticket['status']): string {
    switch(status) {
      case 'Open': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Closed': return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300';
      default: return '';
    }
  }

  getPriorityClass(priority: Ticket['priority']): string {
    switch(priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  }
}
