import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';
import { CommonModule } from '@angular/common';
import { GettingStartedService } from './getting-started.service';

interface GettingStartedStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  callToAction: string;
  completed: boolean;
}

@Component({
  selector: 'app-getting-started',
  imports: [RouterModule, IconComponent, CommonModule],
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(wheel)': 'onWheelScroll($event)'
  }
})
export class GettingStartedComponent {
  private gettingStartedService = inject(GettingStartedService);
  private completionStatus = this.gettingStartedService.completionStatus;
  
  private baseSteps = signal<Omit<GettingStartedStep, 'completed'>[]>([
    {
      id: 'create-reservation',
      title: 'Create a Reservation',
      description: 'Ensure capacity and get the best pricing by reserving your resources in advance. Choose a plan that fits your needs.',
      icon: 'fas fa-calendar-check',
      path: '/app/cloud-edge/resources/reservations/add',
      callToAction: 'Add a Reservation'
    },
    {
      id: 'create-vm',
      title: 'Create Your First Virtual Machine',
      description: 'The foundation of your cloud infrastructure. Choose an OS image and configure CPU, RAM, and storage to match your workload.',
      icon: 'fas fa-rocket',
      path: '/app/cloud-edge/resources/virtual-machines/create',
      callToAction: 'Create a VM'
    },
    {
      id: 'configure-network',
      title: 'Configure Your Network',
      description: "A Gateway is your network's entry and exit point. Set up subnets and NAT rules to manage traffic flow.",
      icon: 'fas fa-dungeon',
      path: '/app/cloud-edge/network/gateways',
      callToAction: 'Set up a Gateway'
    },
    {
      id: 'secure-environment',
      title: 'Secure Your Environment',
      description: 'Our Distributed Firewall allows you to create granular security policies to control traffic between your VMs.',
      icon: 'fas fa-shield-alt',
      path: '/app/cloud-edge/security/distributed-firewall',
      callToAction: 'Explore Firewall Policies'
    },
    {
      id: 'join-community',
      title: 'Join the Community',
      description: 'Connect, share, and learn with other CloudEdge users. Ask questions and get help from the community and our team.',
      icon: 'fas fa-users',
      path: '/app/cloud-edge/resources/community-forum',
      callToAction: 'Visit the Forum'
    }
  ]);

  steps = computed(() => {
    const status = this.completionStatus();
    return this.baseSteps().map(step => ({
      ...step,
      completed: status[step.id as keyof typeof status] ?? false,
    }));
  });
  
  activeStepIndex = signal(0);
  private lastScrollTime = 0;
  
  // Angle per step in degrees
  private anglePerStep = computed(() => 360 / this.steps().length);
  
  // The main rotation of the circle container
  rotation = computed(() => 90 - (this.activeStepIndex() * this.anglePerStep()));

  positionedSteps = computed(() => {
    const steps = this.steps();
    const numSteps = steps.length;
    const radius = 330; // in pixels, adjusted for larger circle
    const anglePerStep = 360 / numSteps;

    return steps.map((step, index) => {
      // Start from -90 degrees (top of the circle)
      const angle = (index * anglePerStep) - 90; 
      const x = radius * Math.cos(angle * Math.PI / 180);
      const y = radius * Math.sin(angle * Math.PI / 180);

      return {
        ...step,
        top: `calc(50% + ${y}px)`,
        left: `calc(50% + ${x}px)`,
        // Counter-rotation to keep numbers upright
        rotation: -this.rotation()
      };
    });
  });

  activeStep = computed(() => this.steps()[this.activeStepIndex()]);

  onWheelScroll(event: WheelEvent) {
    const currentTime = Date.now();
    if (currentTime - this.lastScrollTime < 700) { // Throttle scroll to 700ms for smoother feel
      return;
    }
    this.lastScrollTime = currentTime;

    event.preventDefault();

    if (event.deltaY > 0) {
      // Scroll down
      this.activeStepIndex.update(i => (i + 1) % this.steps().length);
    } else {
      // Scroll up
      this.activeStepIndex.update(i => (i - 1 + this.steps().length) % this.steps().length);
    }
  }

  setActiveStep(index: number) {
      this.activeStepIndex.set(index);
  }
}
