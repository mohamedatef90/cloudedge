import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { PaginationComponent } from '../../../ids-ips-malware-prevention/components/pagination/pagination.component';

interface SecurityEvent {
  id: string;
  timestamp: Date;
  threatName: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  sourceIp: string;
  destination: string;
  action: 'Blocked' | 'Detected' | 'Allowed';
}

type SortColumn = keyof SecurityEvent;

const generateMockEvents = (count: number): SecurityEvent[] => {
  const events: SecurityEvent[] = [];
  const now = new Date();
  const severities: SecurityEvent['severity'][] = ['Low', 'Medium', 'High', 'Critical'];
  const actions: SecurityEvent['action'][] = ['Blocked', 'Detected', 'Allowed'];
  const threatNames = [
    'SQL Injection Attempt', 'ETPRO TROJAN Win32/Prorat', 'SSH Brute Force', 
    'Anomalous Port Scan', 'Cross-Site Scripting (XSS)', 'Malware Signature Match',
    'ET DNS Query for .su TLD', 'Outbound Connection to C&C Server', 'SMBv1 Usage Detected',
    'Suspicious PowerShell Command'
  ];

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // last 30 days
    events.push({
      id: `evt-${i + 1}`,
      timestamp,
      threatName: threatNames[Math.floor(Math.random() * threatNames.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      sourceIp: `104.28.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      destination: ['prod-db-01', 'dev-vm-win11', 'internal-git', 'Public-Web-VM'][Math.floor(Math.random() * 4)],
      action: actions[Math.floor(Math.random() * actions.length)],
    });
  }
  return events;
}

@Component({
  selector: 'app-event-logs-view',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, PaginationComponent],
  templateUrl: './event-logs-view.component.html',
  styleUrls: ['./event-logs-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLogsViewComponent {
  allEvents = signal<SecurityEvent[]>(generateMockEvents(128));
  searchTerm = signal('');
  sortColumn = signal<SortColumn>('timestamp');
  sortDirection = signal<'asc' | 'desc'>('desc');

  currentPage = signal(1);
  itemsPerPage = signal(25);

  filteredEvents = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const column = this.sortColumn();
    const direction = this.sortDirection();

    const filtered = this.allEvents().filter(e =>
      e.threatName.toLowerCase().includes(term) ||
      e.sourceIp.toLowerCase().includes(term) ||
      e.destination.toLowerCase().includes(term)
    );

    return [...filtered].sort((a, b) => {
        const aValue = a[column];
        const bValue = b[column];
        let comparison = 0;
        if (aValue instanceof Date && bValue instanceof Date) {
            comparison = aValue.getTime() - bValue.getTime();
        } else {
            comparison = String(aValue).localeCompare(String(bValue));
        }
        return direction === 'asc' ? comparison : -comparison;
    });
  });

  paginatedEvents = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    return this.filteredEvents().slice(startIndex, startIndex + this.itemsPerPage());
  });

  setSort(column: SortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('desc');
    }
  }

  getSeverityClass(severity: SecurityEvent['severity']): string {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-500';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border-orange-500';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-500';
      case 'Low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-500';
    }
  }

  getActionClass(action: SecurityEvent['action']): string {
    switch (action) {
      case 'Blocked': return 'text-red-500';
      case 'Detected': return 'text-yellow-500';
      case 'Allowed': return 'text-gray-500';
    }
  }
}
