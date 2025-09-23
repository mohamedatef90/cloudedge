import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  AfterViewInit,
  inject,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';
import { DashboardAnimationService } from '../../services/dashboard-animation.service';

interface StatCard {
  title: string;
  icon: string;
  value: number;
  total: number;
  unit: string;
  percentage: number;
  label: string;
  uptime?: string;
}

interface VirtualMachine {
  id: string;
  name: string;
  os: 'windows' | 'ubuntu' | 'linux';
  status: 'running' | 'stopped' | 'suspended';
  cpu: {
    usage: number; // percentage
  };
  memory: {
    usage: number; // percentage
  };
  storage: {
    usage: number; // percentage
  };
}

interface RecentActivity {
  icon: string;
  description: string;
  timestamp: string;
  user: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent, RouterModule],
})
export class DashboardComponent implements AfterViewInit {
  private animationService = inject(DashboardAnimationService);
  animationsReady = signal(false);
  openVmMenuId = signal<string | null>(null);

  constructor() {
    // If animations have already run in this session, set the component to the final state immediately.
    if (this.animationService.hasAnimated()) {
      this.animationsReady.set(true);
    }
  }

  @HostListener('document:click', ['$event.target'])
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

  toggleVmMenu(vmId: string): void {
    this.openVmMenuId.update(currentId => (currentId === vmId ? null : vmId));
  }

  closeVmMenu(): void {
    this.openVmMenuId.set(null);
  }

  stats = signal<StatCard[]>([
    {
      title: 'CPU Cores',
      icon: 'fa-solid fa-microchip',
      value: 45,
      total: 64,
      unit: 'cores',
      percentage: 70,
      label: 'utilized',
    },
    {
      title: 'Memory',
      icon: 'fa-solid fa-chart-simple',
      value: 182,
      total: 256,
      unit: 'GB',
      percentage: 71,
      label: 'utilized',
    },
    {
      title: 'Storage',
      icon: 'fa-solid fa-database',
      value: 1456,
      total: 2048,
      unit: 'GB',
      percentage: 71,
      label: 'utilized',
    },
    {
      title: 'Active VMs',
      icon: 'fa-solid fa-layer-group',
      value: 12,
      total: 18,
      unit: 'total',
      percentage: Math.round((12 / 18) * 100),
      label: '',
      uptime: 'Uptime: 99.8%',
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
    {
      id: 'vm-01',
      name: 'Production Web Server',
      os: 'linux',
      status: 'running',
      cpu: { usage: 85 },
      memory: { usage: 76 },
      storage: { usage: 60 },
    },
    {
      id: 'vm-02',
      name: 'Database Cluster Node 1',
      os: 'ubuntu',
      status: 'running',
      cpu: { usage: 72 },
      memory: { usage: 88 },
      storage: { usage: 45 },
    },
    {
      id: 'vm-03',
      name: 'Development Environment',
      os: 'windows',
      status: 'stopped',
      cpu: { usage: 0 },
      memory: { usage: 0 },
      storage: { usage: 80 },
    },
  ]);

  securityScore = signal({
    score: 87,
    activeThreats: 2,
    blockedAttempts: 156,
    sslCertificates: '8 valid',
  });

  networkStatus = signal({
    bandwidthUsage: {
      used: 3.2,
      total: 10,
      unit: 'Gbps',
      percentage: 32,
    },
    latency: '12ms',
    activeConnections: '2,847',
    packetLoss: '0.01%',
  });
  
  recentActivities = signal<RecentActivity[]>([
    {
      icon: 'fas fa-power-off text-green-500',
      description: "VM 'Production Web Server' was started.",
      timestamp: '5 minutes ago',
      user: 'Admin'
    },
    {
      icon: 'fas fa-plus-circle text-blue-500',
      description: "New firewall policy 'Allow-HTTP' was created.",
      timestamp: '1 hour ago',
      user: 'Admin'
    },
    {
      icon: 'fas fa-user-shield text-yellow-500',
      description: "Security scan completed with 2 vulnerabilities found.",
      timestamp: '3 hours ago',
      user: 'System'
    },
    {
      icon: 'fas fa-hdd text-purple-500',
      description: "Storage volume 'data-archive-01' attached to 'Database Cluster Node 1'.",
      timestamp: '6 hours ago',
      user: 'Admin'
    },
    {
      icon: 'fas fa-sign-in-alt text-gray-500',
      description: "User 'Jane Doe' logged in successfully.",
      timestamp: 'Yesterday',
      user: 'Jane Doe'
    }
  ]);

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
    if (!this.animationsReady()) {
      return 5;
    }
    return this.securityScore().score;
  });

  readonly securityScoreRadius = 60;
  readonly securityScoreCircumference = 2 * Math.PI * this.securityScoreRadius;
  securityScoreOffset = computed(() => {
    const percent = this.animatedSecurityScore();
    return (
      this.securityScoreCircumference -
      (percent / 100) * this.securityScoreCircumference
    );
  });
}