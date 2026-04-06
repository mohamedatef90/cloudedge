
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
import { DashboardStateService, DashboardWidgetVisibility } from '../../services/dashboard-state.service';
import { CustomizeDashboardModalComponent } from './components/customize-dashboard-modal/customize-dashboard-modal.component';
import { GatewayService } from '../gateways/gateway.service';
import { NatService } from '../nats/nat.service';
import { VirtualMachineService } from '../virtual-machines/services/virtual-machine.service';

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
  template: `
    <!-- Header -->
    <div class="flex flex-wrap justify-between items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-[#293c51] dark:text-gray-200">CloudEdge Console</h1>
      </div>
      <div class="flex items-center space-x-3">
        <a routerLink="/app/cloud-edge/resources/virtual-machines/create" class="bg-[#679a41] text-white px-6 py-2.5 rounded-md text-sm font-bold hover:bg-[#537d34] transition-all duration-200 ease-in-out flex items-center shadow-sm">
          <app-icon name="fas fa-plus" className="mr-2 text-xs"></app-icon>
          Create VM
        </a>
        <button (click)="openCustomizeModal()" class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[#293c51] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 px-6 py-2.5 rounded-md text-sm font-bold transition-all duration-200 ease-in-out flex items-center shadow-sm">
          <app-icon name="fas fa-th-large" className="mr-2 text-xs text-gray-400"></app-icon>
          Custom Dashboard
        </button>
      </div>
    </div>

    <!-- Welcome Card for New Users -->
    @if (showWelcomeCard()) {
      <div class="relative bg-white dark:bg-slate-800 bg-gradient-to-br from-[#679a41]/5 dark:from-[#8cc866]/5 to-transparent rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 mb-8">
        <button (click)="dismissWelcomeCard()" class="absolute top-6 right-6 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <app-icon name="fas fa-times" />
        </button>
        <h2 class="text-2xl font-bold text-[#293c51] dark:text-gray-200">Welcome to CloudEdge, {{ user()?.displayName || 'User' }}!</h2>
        <p class="mt-2 text-base text-gray-500 dark:text-gray-400">We're glad to have you here. Here are some quick links to help you get started:</p>
        
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (link of quickStartLinks(); track link.title) {
            <a [routerLink]="link.path" class="group bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700/80 p-4 rounded-lg shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-slate-600 transition-all duration-200 flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#679a41]/20 text-[#679a41] dark:bg-[#8cc866]/20 dark:text-[#8cc866] rounded-lg">
                <app-icon [name]="link.icon" className="text-xl" />
              </div>
              <div>
                <h3 class="font-medium text-sm text-[#293c51] dark:text-gray-200 group-hover:text-[#679a41] dark:group-hover:text-[#8cc866] transition-colors">{{ link.title }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ link.description }}</p>
              </div>
            </a>
          }
        </div>
      </div>
    }

    <!-- Stats Grid -->
    @if(widgetVisibility().stats) {
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        @for(stat of animatedStats(); track stat.title) {
          <button (click)="openChartModal(stat)" class="text-left bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex flex-col transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#679a41] dark:focus:ring-offset-slate-900">
            <div class="flex justify-between items-start">
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{{ stat.title }}</h3>
              <div class="text-gray-400 dark:text-gray-500">
                <app-icon [name]="stat.icon" className="text-xl"></app-icon>
              </div>
            </div>
            <div class="mt-4">
              <span class="text-4xl font-bold text-[#293c51] dark:text-gray-200">{{ stat.value }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400"> / {{ stat.total }} {{ stat.unit }}</span>
            </div>
            <div class="mt-auto pt-6">
              <div class="bg-gray-100 dark:bg-slate-700 rounded-full h-2.5 w-full overflow-hidden">
                <div class="h-2.5 rounded-full transition-all duration-1000 ease-out"
                    [class.bg-orange-500]="stat.title === 'CPU Cores'"
                    [class.bg-blue-500]="stat.title === 'Memory'"
                    [class.bg-green-500]="stat.title === 'Storage'"
                    [class.bg-[#679a41]]="stat.title === 'Active VMs'"
                    [style.width.%]="stat.animatedPercentage"></div>
              </div>
              <div class="text-xs font-bold mt-3 text-gray-500 dark:text-gray-400">
                @if(stat.uptime) {
                  <span>{{ stat.uptime }}</span>
                } @else {
                  <span class="text-[#679a41] dark:text-[#8cc866]">{{ stat.percentage }}% {{ stat.label }}</span>
                }
              </div>
            </div>
          </button>
        }
      </div>
    }


    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Top VMs -->
        @if (widgetVisibility().topVms) {
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-bold text-[#293c51] dark:text-gray-200">Top VMs by Resource Usage</h3>
              <a routerLink="/app/cloud-edge/resources/virtual-machines" class="text-sm font-bold text-[#679a41] dark:text-[#8cc866] hover:underline">View All VMs</a>
            </div>
            <div class="space-y-6">
              @for (vm of animatedTopVMs(); track vm.id) {
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0 pt-1.5">
                    <span class="flex h-3 w-3 rounded-full" [class.bg-green-500]="vm.status === 'running'" [class.bg-red-500]="vm.status !== 'running'"></span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-3 mb-4">
                      @switch (vm.os) {
                        @case ('windows') {
                          <app-icon name="fab fa-windows" className="text-xl text-blue-500"></app-icon>
                        }
                        @case ('ubuntu') {
                          <app-icon name="fab fa-ubuntu" className="text-xl text-orange-500"></app-icon>
                        }
                        @case ('linux') {
                          <app-icon name="fab fa-linux" className="text-xl text-gray-700 dark:text-gray-300"></app-icon>
                        }
                      }
                      <p class="text-sm font-bold text-[#293c51] dark:text-gray-200 truncate">{{ vm.name }}</p>
                    </div>
                    <div class="space-y-3">
                      <!-- CPU -->
                      <div class="flex items-center">
                        <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 w-12 uppercase">CPU</span>
                        <div class="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 mx-3">
                          <div class="bg-orange-500 h-1.5 rounded-full transition-all duration-1000 ease-out" [style.width.%]="vm.animatedUsage.cpu"></div>
                        </div>
                        <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 w-8 text-right">{{ vm.cpu.usage }}%</span>
                      </div>
                      <!-- Memory -->
                      <div class="flex items-center">
                        <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 w-12 uppercase">Memory</span>
                        <div class="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 mx-3">
                          <div class="bg-blue-500 h-1.5 rounded-full transition-all duration-1000 ease-out" [style.width.%]="vm.animatedUsage.memory"></div>
                        </div>
                        <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 w-8 text-right">{{ vm.memory.usage }}%</span>
                      </div>
                      <!-- Storage -->
                      <div class="flex items-center">
                        <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 w-12 uppercase">Storage</span>
                        <div class="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 mx-3">
                          <div class="bg-green-500 h-1.5 rounded-full transition-all duration-1000 ease-out" [style.width.%]="vm.animatedUsage.storage"></div>
                        </div>
                        <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 w-8 text-right">{{ vm.storage.usage }}%</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex-shrink-0 relative vm-menu-container">
                    <button (click)="toggleVmMenu(vm.id)" class="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" aria-haspopup="true" [attr.aria-expanded]="openVmMenuId() === vm.id">
                      <app-icon name="fas fa-ellipsis-v"></app-icon>
                    </button>
                    @if (openVmMenuId() === vm.id) {
                      <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 focus:outline-none z-10">
                        <a href="#" (click)="$event.preventDefault(); closeVmMenu()" class="flex items-center px-4 py-2 text-sm text-[#293c51] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 hover:text-[#679a41] dark:hover:text-[#8cc866] transition-colors" [class.text-gray-400]="vm.status !== 'running'" [class.dark:text-gray-500]="vm.status !== 'running'" [class.pointer-events-none]="vm.status !== 'running'">
                          <app-icon name="fas fa-plug" className="w-4 h-4 mr-3" />
                          <span>Connect</span>
                        </a>
                        <a href="#" (click)="$event.preventDefault(); closeVmMenu()" class="flex items-center px-4 py-2 text-sm text-[#293c51] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 hover:text-[#679a41] dark:hover:text-[#8cc866] transition-colors">
                          <app-icon name="fas fa-tasks-alt" className="w-4 h-4 mr-3" />
                          <span>Manage</span>
                        </a>
                        <a routerLink="/app/cloud-edge/resources/virtual-machines" (click)="closeVmMenu()" class="flex items-center px-4 py-2 text-sm text-[#293c51] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 hover:text-[#679a41] dark:hover:text-[#8cc866] transition-colors">
                          <app-icon name="fas fa-info-circle" className="w-4 h-4 mr-3" />
                          <span>View Details</span>
                        </a>
                        <div class="border-t border-gray-200 dark:border-slate-700 my-1"></div>
                        <a href="#" (click)="$event.preventDefault(); closeVmMenu()" class="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <app-icon name="fas fa-trash-alt" className="w-4 h-4 mr-3" />
                          <span>Delete</span>
                        </a>
                      </div>
                    }
                  </div>
                </div>
                @if (!($last)) {
                  <hr class="my-6 border-gray-100 dark:border-slate-700">
                }
              }
            </div>
          </div>
        }
        
        <!-- Audit Trail -->
        @if(widgetVisibility().auditTrail) {
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-bold text-[#293c51] dark:text-gray-200">Audit Trail</h3>
              <a routerLink="/app/cloud-edge/administration/action-logs" class="text-sm font-bold text-[#679a41] dark:text-[#8cc866] hover:underline">View All Logs</a>
            </div>
            <div class="my-4">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <app-icon name="fas fa-search" className="text-gray-400" />
                </div>
                <input 
                  [(ngModel)]="auditTrailSearchTerm"
                  type="text" 
                  placeholder="Search user, event, resource..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md leading-5 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#679a41] dark:focus:ring-emerald-500 focus:border-[#679a41] dark:focus:border-emerald-500 sm:text-sm" />
              </div>
            </div>
            <div class="flow-root">
              <ul role="list" class="-my-4 divide-y divide-gray-200 dark:divide-slate-700">
                @for (entry of filteredAuditTrail(); track entry.id) {
                  <li class="py-4">
                    <div class="flex items-start space-x-4">
                      <div class="flex-shrink-0 pt-0.5">
                        <app-icon [name]="getAuditIcon(entry.eventSource)" className="h-5 w-5"></app-icon>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-[#293c51] dark:text-gray-200 truncate">
                          {{ entry.eventName }}
                          @if (entry.status === 'Failure') {
                            <span class="ml-2 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-0.5 rounded-full">Failed</span>
                          }
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          Resource: <span class="font-medium text-[#293c51] dark:text-gray-300">{{ entry.resourceName }}</span>
                        </p>
                        <div class="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span class="truncate">
                            <app-icon name="fas fa-user" className="mr-1" />
                            {{ entry.user }}
                          </span>
                          <span class="font-mono truncate">
                            <app-icon name="fas fa-network-wired" className="mr-1" />
                            {{ entry.ipAddress }}
                          </span>
                          <span class="text-right truncate">
                            <app-icon name="fas fa-clock" className="mr-1" />
                            {{ entry.eventTime }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                } @empty {
                  <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                      <app-icon name="fas fa-search" className="text-3xl mb-2"></app-icon>
                      <p>No audit trail entries found for your search.</p>
                  </div>
                }
              </ul>
            </div>
          </div>
        }
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Security Score -->
        @if(widgetVisibility().securityScore) {
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-bold text-[#293c51] dark:text-gray-200">Security Score</h3>
              <span class="text-[10px] font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded uppercase">Active</span>
            </div>
            <div class="flex flex-col items-center">
                <div class="relative w-44 h-44">
                    <svg class="w-full h-full" viewBox="0 0 140 140">
                        <circle class="text-gray-100 dark:text-slate-700" stroke-width="14" stroke="currentColor" fill="transparent" r="60" cx="70" cy="70" />
                        <circle class="text-[#679a41]" stroke-width="14" [attr.stroke-dasharray]="securityScoreCircumference" [attr.stroke-dashoffset]="securityScoreOffset()" stroke-linecap="round" stroke="currentColor" fill="transparent" r="60" cx="70" cy="70" style="transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset 1s ease-out;" />
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <span class="text-5xl font-bold text-[#293c51] dark:text-gray-200">{{ securityScore().score }}%</span>
                    </div>
                </div>
                <div class="w-full mt-8 space-y-4">
                  <div class="flex justify-between items-center text-sm">
                    <span class="font-bold text-[#293c51] dark:text-gray-400">Active Threats</span>
                    <span class="font-bold text-red-500">{{ securityScore().activeThreats }}</span>
                  </div>
                  <div class="flex justify-between items-center text-sm">
                    <span class="font-bold text-[#293c51] dark:text-gray-400">Blocked Attempts</span>
                    <span class="font-bold text-[#293c51] dark:text-gray-200">{{ securityScore().blockedAttempts }}</span>
                  </div>
                  <div class="flex justify-between items-center text-sm">
                    <span class="font-bold text-[#293c51] dark:text-gray-400">SSL Certificates</span>
                    <span class="font-bold text-green-500">{{ securityScore().sslCertificates }}</span>
                  </div>
                </div>
            </div>
          </div>
        }
        
        <!-- Network Status -->
        @if(widgetVisibility().networkStatus) {
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-bold text-[#293c51] dark:text-gray-200">Network Status</h3>
              <span class="text-[10px] font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded uppercase">Healthy</span>
            </div>
            <hr class="my-4 border-gray-200 dark:border-slate-700">
            <div class="space-y-4 text-sm">
              <div class="flex justify-between items-center">
                <span class="font-medium text-[#293c51] dark:text-gray-200">Configured Gateways</span>
                <span class="font-bold text-lg text-[#293c51] dark:text-gray-200">{{ networkStatus().gateways }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium text-[#293c51] dark:text-gray-200">Active NAT Rules</span>
                <span class="font-bold text-lg text-[#293c51] dark:text-gray-200">{{ networkStatus().activeNatRules }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium text-[#293c51] dark:text-gray-200">Download Speed</span>
                @if (networkStatus().isTestingSpeed) {
                  <span class="font-semibold text-gray-500 dark:text-gray-400 animate-pulse">Testing...</span>
                } @else if (networkStatus().speedTestResult) {
                  <span class="font-semibold text-[#679a41] dark:text-[#8cc866]">{{ networkStatus().speedTestResult }}</span>
                } @else {
                  <span class="font-semibold text-gray-500 dark:text-gray-400">-</span>
                }
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium text-[#293c51] dark:text-gray-200">Latency</span>
                <span class="font-semibold text-[#679a41] dark:text-[#8cc866]">{{ networkStatus().latency }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium text-[#293c51] dark:text-gray-200">Packet Loss</span>
                <span class="font-semibold text-[#679a41] dark:text-[#8cc866]">{{ networkStatus().packetLoss }}</span>
              </div>
            </div>
            <div class="mt-6">
                <button (click)="runSpeedTest()" [disabled]="networkStatus().isTestingSpeed" class="w-full bg-transparent border border-[#679a41] text-[#679a41] dark:border-[#8cc866] dark:text-[#8cc866] hover:bg-[#679a41]/10 dark:hover:bg-[#8cc866]/10 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ease-in-out flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-wait">
                    <app-icon [name]="networkStatus().isTestingSpeed ? 'fas fa-spinner fa-spin' : 'fas fa-tachometer-alt'" className="mr-2"></app-icon>
                    {{ networkStatus().isTestingSpeed ? 'Testing...' : 'Run Speed Test' }}
                </button>
            </div>
          </div>
        }
        
        <!-- Helpful Resources -->
        @if(widgetVisibility().helpfulResources) {
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
            <h3 class="text-lg font-bold text-[#293c51] dark:text-gray-200 mb-6">Helpful Resources</h3>
            <ul class="-mx-2 -my-1">
              @for (resource of helpfulResources(); track resource.title) {
                <li>
                  <a [routerLink]="resource.path" class="group flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors">
                    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#679a41]/10 text-[#679a41] dark:bg-[#8cc866]/10 dark:text-[#8cc866] rounded-md mt-0.5">
                      <app-icon [name]="resource.icon" className="text-base"></app-icon>
                    </div>
                    <div>
                      <h4 class="font-medium text-sm text-[#293c51] dark:text-gray-200 group-hover:text-[#679a41] dark:group-hover:text-[#8cc866] transition-colors">{{ resource.title }}</h4>
                      <p class="text-xs text-gray-500 dark:text-gray-400 leading-tight">{{ resource.description }}</p>
                    </div>
                  </a>
                </li>
              }
            </ul>
          </div>
        }
      </div>
    </div>

    <app-stat-chart-modal [isOpen]="isChartModalOpen()" [statData]="selectedStatForChart()" (close)="closeChartModal()"></app-stat-chart-modal>

    <app-customize-dashboard-modal
      [isOpen]="isCustomizeModalOpen()"
      [currentVisibility]="widgetVisibility()"
      (close)="closeCustomizeModal()"
      (save)="saveDashboardLayout($event)"
    ></app-customize-dashboard-modal>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent, RouterModule, FormsModule, StatChartModalComponent, CustomizeDashboardModalComponent],
  host: {
    '(document:click)': 'onGlobalClick($event.target)',
  },
})
export class DashboardComponent implements AfterViewInit {
  private animationService = inject(DashboardAnimationService);
  private authService = inject(AuthService);
  private dashboardStateService = inject(DashboardStateService);
  private gatewayService = inject(GatewayService);
  private natService = inject(NatService);
  private virtualMachineService = inject(VirtualMachineService);

  animationsReady = signal(false);
  openVmMenuId = signal<string | null>(null);
  user = this.authService.user;
  auditTrailSearchTerm = signal('');
  isTestingSpeed = signal(false);
  speedTestResult = signal<string | null>(null);

  // Widget visibility state from the service
  widgetVisibility = this.dashboardStateService.widgetVisibility;

  // Chart Modal State
  isChartModalOpen = signal(false);
  selectedStatForChart = signal<StatCard | null>(null);
  
  // Customize Modal State
  isCustomizeModalOpen = signal(false);

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
  
  // Methods for customize modal
  openCustomizeModal(): void {
    this.isCustomizeModalOpen.set(true);
  }

  closeCustomizeModal(): void {
    this.isCustomizeModalOpen.set(false);
  }

  saveDashboardLayout(newVisibility: DashboardWidgetVisibility): void {
    this.dashboardStateService.updateVisibility(newVisibility);
    this.isCustomizeModalOpen.set(false);
  }

  runSpeedTest(): void {
    this.isTestingSpeed.set(true);
    this.speedTestResult.set(null);
    // Simulate a network test
    setTimeout(() => {
      const downloadSpeedMbps = (Math.random() * (500 - 50) + 50).toFixed(2); // Random speed between 50 and 500 Mbps
      this.speedTestResult.set(`${downloadSpeedMbps} Mbps`);
      this.isTestingSpeed.set(false);
    }, 2500);
  }

  quickStartLinks = signal<QuickStartLink[]>([
    { title: 'Getting Started Guide', description: 'Follow our step-by-step guide.', icon: 'fas fa-rocket', path: '/app/cloud-edge/resources/getting-started' },
    { title: 'Create a Virtual Machine', description: 'Spin up a new server in minutes.', icon: 'fas fa-desktop', path: '/app/cloud-edge/resources/virtual-machines/create' },
    { title: 'Set up a Gateway', description: 'Configure your network entry point.', icon: 'fas fa-dungeon', path: '/app/cloud-edge/network/gateways/create' },
    { title: 'Configure Applications', description: 'Define applications for your policies.', icon: 'far fa-file-alt', path: '/app/cloud-edge/inventory/applications' },
  ]);

  helpfulResources = signal<HelpfulResource[]>([
    {
      title: 'Getting Started Guide',
      description: 'Our step-by-step guide to launch your first VM.',
      icon: 'fas fa-rocket',
      path: '/app/cloud-edge/resources/getting-started',
    },
    {
      title: 'Community Forum',
      description: 'Ask questions and share knowledge with others.',
      icon: 'fas fa-users',
      path: '/app/cloud-edge/resources/community-forum',
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

  topVMs = computed(() => {
    const allVMs = this.virtualMachineService.virtualMachines();

    // Map VMs to the format needed by the dashboard, adding mocked usage data.
    const vmsWithUsage = allVMs.map(vm => {
      const isRunning = vm.status === 'running';
      // Generate more realistic "high usage" for a "top VMs" widget.
      const cpuUsage = isRunning ? Math.floor(Math.random() * 35) + 60 : 0; // 60-95%
      const memoryUsage = isRunning ? Math.floor(Math.random() * 40) + 55 : 0; // 55-95%
      const storageUsage = isRunning ? Math.floor(Math.random() * 70) + 20 : 0; // 20-90%

      return {
        id: vm.id,
        name: vm.name,
        os: vm.os,
        status: vm.status,
        cpu: { usage: cpuUsage },
        memory: { usage: memoryUsage },
        storage: { usage: storageUsage },
        // Add a temporary property for sorting by overall "busyness"
        _combinedUsage: cpuUsage + memoryUsage 
      };
    });

    // Sort by combined CPU and Memory usage to find the "top" VMs, and take the top 3.
    return vmsWithUsage
      .sort((a, b) => b._combinedUsage - a._combinedUsage)
      .slice(0, 3)
      .map(({ _combinedUsage, ...vm }) => vm); // Remove the temporary property before returning
  });

  securityScore = signal({ score: 87, activeThreats: 2, blockedAttempts: 156, sslCertificates: '8 valid' });

  networkStatus = computed(() => {
    const gateways = this.gatewayService.gateways();
    const natRules = this.natService.natRules();
    
    return {
      gateways: gateways.length,
      activeNatRules: natRules.filter(r => r.status === 'Enabled').length,
      latency: '12ms',
      packetLoss: '0.01%',
      isTestingSpeed: this.isTestingSpeed(),
      speedTestResult: this.speedTestResult()
    };
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