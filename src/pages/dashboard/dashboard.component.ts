import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  AfterViewInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../components/icon/icon.component';
import { DashboardAnimationService } from '../../services/dashboard-animation.service';
import { AuthService } from '../../services/auth.service';
import { StatCard, VirtualMachine, AuditTrailEntry, QuickStartLink, HelpfulResource } from './dashboard.types';
import { StatChartModalComponent } from './components/stat-chart-modal/stat-chart-modal.component';

// Helper function to generate mock historical data
const generateHistoricalData = (days: number, pointsPerHour: number, max: number, startPercent: number = 0.6, noise: number = 0.2, sineFactor: number = 0.1) => {
  const data: { time: Date; value: number }[] = [];
  const now = new Date();
  const totalPoints = days * 24 * pointsPerHour;
  for (let i = totalPoints; i > 0; i--) {
    const time = new Date(now.getTime() - i * (3600 * 1000 / pointsPerHour));
    // some randomness
    let value = max * startPercent + (Math.random() - 0.5) * max * noise + Math.sin(i / (pointsPerHour * 3)) * max * sineFactor;
    value = Math.max(0, Math.min(max, value));
    data.push({ time, value });
  }
  return data;
};


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent, RouterModule, FormsModule, StatChartModalComponent],
  host: {
    '(document:click)': 'onGlobalClick($event.target)',
  },
})
export class DashboardComponent implements AfterViewInit {
  private animationService = inject(DashboardAnimationService);
  private authService = inject(AuthService);

  animationsReady = signal(false);
  openVmMenuId = signal<string | null>(null);
  user = this.authService.user;
  auditTrailSearchTerm = signal('');

  // Chart Modal State
  isChartModalOpen = signal(false);
  selectedStatForChart = signal<StatCard | null>(null);

  showWelcomeCard = computed(() => this.user()?.isNewUser && !this.animationService.welcomeDismissed());

  constructor() {
    // If animations have already run in this session, set the component to the final state immediately.
    if (this.animationService.hasAnimated()) {
      this.animationsReady.set(true);
    }
  }

  onGlobalClick(target: HTMLElement): void {
    if (!target.closest('.vm-menu-container')) {
      this.closeVmMenu();
    }
  }

  ngAfterViewInit(): void {
    // Only run the animation sequence if it hasn't run before in this session.
    if (!this.animationService.hasAnimated()) {
      // Use setTimeout to ensure the initial state is rendered before starting the animation
      setTimeout(() => {
        this.animationsReady.set(true);
        this.animationService.setAnimated(); // Mark as animated for the rest of the session.
      }, 100);
    }
  }

  dismissWelcomeCard(): void {
    this.animationService.dismissWelcome();
  }

  toggleVmMenu(vmId: string): void {
    this.openVmMenuId.update(currentId => (currentId === vmId ? null : vmId));
  }

  closeVmMenu(): void {
    this.openVmMenuId.set(null);
  }
  
  openChartModal(stat: StatCard): void {
    this.selectedStatForChart.set(stat);
    this.isChartModalOpen.set(true);
  }

  closeChartModal(): void {
    this.isChartModalOpen.set(false);
  }

  runSpeedTest(): void {
    // In a real app, this would trigger a network test. For now, it's a placeholder.
    alert('Running network speed test...');
  }

  quickStartLinks = signal<QuickStartLink[]>([
    { title: 'Create a Virtual Machine', description: 'Spin up a new server in minutes.', icon: 'fas fa-desktop', path: '/app/cloud-edge/resources/virtual-machines' },
    { title: 'Set up a Gateway', description: 'Configure your network entry point.', icon: 'fas fa-dungeon', path: '/app/cloud-edge/network/gateways' },
    { title: 'Configure Applications', description: 'Define applications for your policies.', icon: 'far fa-file-alt', path: '/app/cloud-edge/inventory/applications' },
    { title: 'View Documentation', description: 'Find detailed guides and help.', icon: 'fas fa-book', path: '/#' }
  ]);

  helpfulResources = signal<HelpfulResource[]>([
    {
      title: 'Getting Started Guide',
      description: 'Our step-by-step guide to launch your first VM.',
      icon: 'fas fa-rocket',
      path: '/#',
    },
    {
      title: 'API Documentation',
      description: 'Automate your infrastructure with our powerful API.',
      icon: 'fas fa-code',
      path: '/#',
    },
    {
      title: 'Community Forum',
      description: 'Ask questions and share knowledge with others.',
      icon: 'fas fa-users',
      path: '/#',
    },
    {
      title: 'Contact Support',
      description: 'Get help from our expert support team when you need it.',
      icon: 'fas fa-headset',
      path: '/app/cloud-edge/administration/tickets',
    },
  ]);

  stats = signal<StatCard[]>([
    {
      title: 'CPU Cores', icon: 'fa-solid fa-microchip', value: 45, total: 64, unit: 'cores', percentage: 70, label: 'utilized',
      historicalData: generateHistoricalData(7, 4, 100, 0.65),
    },
    {
      title: 'Memory', icon: 'fa-solid fa-chart-simple', value: 182, total: 256, unit: 'GB', percentage: 71, label: 'utilized',
      historicalData: generateHistoricalData(7, 4, 100, 0.7),
    },
    {
      title: 'Storage', icon: 'fa-solid fa-database', value: 1456, total: 2048, unit: 'GB', percentage: 71, label: 'utilized',
      historicalData: generateHistoricalData(7, 4, 100, 0.7, 0.05, 0.02),
    },
    {
      title: 'Active VMs', icon: 'fa-solid fa-layer-group', value: 12, total: 18, unit: 'total', percentage: Math.round((12 / 18) * 100), label: '', uptime: 'Uptime: 99.8%',
      historicalData: generateHistoricalData(7, 1, 18, 0.6, 0.3).map(d => ({...d, value: Math.round(d.value)})),
    },
  ]);

  animatedStats = computed(() => {
    const ready = this.animationsReady();
    return this.stats().map((stat) => ({
      ...stat,
      animatedPercentage: ready ? stat.percentage : 0,
    }));
  });

  topVMs = signal<VirtualMachine[]>([
    { id: 'vm-01', name: 'Production Web Server', os: 'linux', status: 'running', cpu: { usage: 85 }, memory: { usage: 76 }, storage: { usage: 60 } },
    { id: 'vm-02', name: 'Database Cluster Node 1', os: 'ubuntu', status: 'running', cpu: { usage: 72 }, memory: { usage: 88 }, storage: { usage: 45 } },
    { id: 'vm-03', name: 'Development Environment', os: 'windows', status: 'stopped', cpu: { usage: 0 }, memory: { usage: 0 }, storage: { usage: 80 } },
  ]);

  securityScore = signal({ score: 87, activeThreats: 2, blockedAttempts: 156, sslCertificates: '8 valid' });

  networkStatus = signal({
    bandwidthUsage: { used: 3.2, total: 10, unit: 'Gbps', percentage: 32 },
    latency: '12ms', activeConnections: '2,847', packetLoss: '0.01%',
  });
  
  auditTrailEntries = signal<AuditTrailEntry[]>([
    { id: 'evt-1', eventName: 'StartInstances', eventSource: 'Compute', eventTime: '5 minutes ago', user: 'Admin', resourceName: 'prod-web-server-01', ipAddress: '73.125.88.10', status: 'Success' },
    { id: 'evt-2', eventName: 'CreatePolicy', eventSource: 'Security', eventTime: '1 hour ago', user: 'Admin', resourceName: 'Allow-HTTP-External', ipAddress: '73.125.88.10', status: 'Success' },
    { id: 'evt-3', eventName: 'RunSecurityScan', eventSource: 'Security', eventTime: '3 hours ago', user: 'System', resourceName: 'All Production VMs', ipAddress: 'internal-system', status: 'Success' },
    { id: 'evt-4', eventName: 'AttachVolume', eventSource: 'Compute', eventTime: '6 hours ago', user: 'Admin', resourceName: 'data-archive-01', ipAddress: '73.125.88.10', status: 'Success' },
    { id: 'evt-5', eventName: 'ConsoleLogin', eventSource: 'Identity', eventTime: 'Yesterday', user: 'Jane Doe', resourceName: 'user/jane.doe', ipAddress: '104.28.71.118', status: 'Success' },
    { id: 'evt-6', eventName: 'UpdateGateway', eventSource: 'Network', eventTime: '2 days ago', user: 'Admin', resourceName: 'main-gateway-01', ipAddress: '73.125.88.10', status: 'Failure' }
  ]);
  
  filteredAuditTrail = computed(() => {
    const term = this.auditTrailSearchTerm().toLowerCase();
    if (!term) return this.auditTrailEntries();
    return this.auditTrailEntries().filter(entry => 
        entry.eventName.toLowerCase().includes(term) ||
        entry.user.toLowerCase().includes(term) ||
        entry.resourceName.toLowerCase().includes(term) ||
        entry.ipAddress.toLowerCase().includes(term) ||
        entry.eventSource.toLowerCase().includes(term)
    );
  });

  getAuditIcon(source: AuditTrailEntry['eventSource']): string {
    switch (source) {
        case 'Compute': return 'fas fa-desktop text-blue-500';
        case 'Security': return 'fas fa-shield-alt text-yellow-500';
        case 'Network': return 'fas fa-network-wired text-purple-500';
        case 'Identity': return 'fas fa-user-circle text-green-500';
    }
  }

  animatedTopVMs = computed(() => {
    const ready = this.animationsReady();
    return this.topVMs().map((vm) => ({
      ...vm,
      animatedUsage: {
        cpu: ready ? vm.cpu.usage : 0,
        memory: ready ? vm.memory.usage : 0,
        storage: ready ? vm.storage.usage : 0,
      },
    }));
  });

  animatedSecurityScore = computed(() => {
    if (!this.animationsReady()) return 5;
    return this.securityScore().score;
  });

  readonly securityScoreRadius = 60;
  readonly securityScoreCircumference = 2 * Math.PI * this.securityScoreRadius;
  securityScoreOffset = computed(() => {
    const percent = this.animatedSecurityScore();
    return this.securityScoreCircumference - (percent / 100) * this.securityScoreCircumference;
  });
}