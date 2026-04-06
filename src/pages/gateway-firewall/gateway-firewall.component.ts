
import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../components/icon/icon.component';
import { GatewayPolicy, GatewayRule } from './types';
import { Service } from '../distributed-firewall/types';
import { AdvancedDeleteConfirmationModalComponent } from '../../components/advanced-delete-confirmation-modal/advanced-delete-confirmation-modal.component';
import { EditableNameComponent } from './components/editable-name/editable-name.component';
import { ActionDropdownComponent } from './components/action-dropdown/action-dropdown.component';
import { ToggleSwitchComponent } from '../distributed-firewall/components/toggle-switch/toggle-switch.component';
import { GatewayFirewallService } from '../../services/gateway-firewall.service';

@Component({
  selector: 'app-gateway-firewall',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    AdvancedDeleteConfirmationModalComponent,
    EditableNameComponent,
    ActionDropdownComponent,
    ToggleSwitchComponent,
    FormsModule
  ],
  template: `
    <div class="rounded-xl p-6 bg-white dark:bg-slate-800 shadow space-y-4">
      <!-- Header -->
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-[#293c51] dark:text-gray-200">Gateway Firewall</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage gateway security policies and rules across your infrastructure.</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="relative">
              <button (click)="isActionsMenuOpen.set(!isActionsMenuOpen())"
                class="bg-[#679a41] text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-[#537d34] transition-colors duration-200 flex items-center gap-2">
                ACTIONS
                <app-icon name="fas fa-chevron-down" className="ml-1 text-xs"></app-icon>
              </button>
              @if (isActionsMenuOpen()) {
                <div class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-700 ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 focus:outline-none z-10">
                  <div class="py-1">
                    <button (click)="isActionsMenuOpen.set(false)" class="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600">
                      <app-icon name="fas fa-save" className="mr-3 w-4"></app-icon>
                      Save as a draft
                    </button>
                    <button (click)="isActionsMenuOpen.set(false)" class="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600">
                      <app-icon name="fas fa-file-export" className="mr-3 w-4"></app-icon>
                      Export FW configuration
                    </button>
                  </div>
                </div>
              }
            </div>
            <button class="text-xl text-gray-400">
              <app-icon name="far fa-question-circle"></app-icon>
            </button>
          </div>
        </div>
        <div class="border-b border-gray-100 dark:border-slate-700"></div>
      </div>

      <!-- Toolbar -->
      <div class="flex items-center space-x-2 py-1">
        <button (click)="handleAddPolicyClick()" class="bg-[#679a41] text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-[#537d34] transition-colors duration-200 flex items-center gap-2">
          <app-icon name="fas fa-plus-circle"></app-icon> ADD POLICY
        </button>
      </div>

      <!-- Policies List -->
      <div class="overflow-x-auto border rounded-lg dark:border-gray-700">
        <table class="min-w-full w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
          <thead class="bg-gray-50 dark:bg-slate-700/50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase w-[20%]">Rule Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase w-[12%]">Source</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase w-[12%]">Destination</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase w-[12%]">Applied To</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase w-[12%]">Service</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase w-[10%]">Action</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase w-[10%]">Status</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase w-[12%]">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
            @for (policy of filteredPolicies(); track policy.id) {
              <!-- Policy Row -->
              <tr class="bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 h-[52px]">
                <td class="px-4 py-3 truncate" colspan="5">
                  <div class="flex items-center gap-x-2">
                    <button (click)="togglePolicy(policy.id)" class="text-gray-500 w-5 text-center flex-shrink-0">
                      <app-icon [name]="policy.isExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-right'" />
                    </button>
                    <app-editable-name [name]="policy.name" [isPolicy]="true" (save)="handlePolicyNameSave(policy.id, $event)" />
                    <span class="text-xs font-medium bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{{ policy.rules.length }} Rules</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm" colspan="2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <app-icon name="fas fa-check-circle" />
                      <span class="font-semibold">Success</span>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button (click)="handleEditPolicy(policy)" class="p-1.5 text-gray-400 hover:text-[#679a41] hover:bg-[#679a41]/10 rounded-md transition-all" title="Edit Policy">
                      <app-icon name="fas fa-edit" className="text-sm"></app-icon>
                    </button>
                    <button (click)="handleDeletePolicy(policy)" class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-md transition-all" title="Delete Policy">
                      <app-icon name="fas fa-trash-alt" className="text-sm"></app-icon>
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Rules Rows -->
              @if (policy.isExpanded) {
                @for (rule of policy.rules; track rule.id) {
                  <tr class="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td class="px-4 py-4 align-top">
                      <div class="flex items-center gap-x-2 pl-6">
                        <app-editable-name [name]="rule.name" (save)="handleRuleNameSave(policy.id, rule.id, $event)" />
                      </div>
                    </td>
                    <td class="px-4 py-4 align-top">
                      @let sItems = getDisplayItems(rule.sources);
                      <div class="space-y-1.5">
                        @for(item of sItems.slice(0, 3); track item) {
                          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <app-icon [name]="isIpAddress(item) ? 'fas fa-network-wired' : 'fas fa-folder'" className="text-gray-400 text-xs"></app-icon>
                            <span class="truncate max-w-[150px] text-sm">{{ item }}</span>
                          </div>
                        }
                        @if(sItems.length > 3) {
                          <button (click)="openViewSourcesModal(rule.sources)" class="text-[#679a41] dark:text-[#8cc866] text-xs font-semibold hover:underline flex items-center mt-1">
                            <app-icon name="fas fa-plus" className="mr-1 text-[8px]" />
                            {{ sItems.length - 3 }} more
                          </button>
                        }
                      </div>
                    </td>
                    <td class="px-4 py-4 align-top">
                      <div class="space-y-1.5">
                        @for(item of getDisplayItems(rule.destinations); track item) {
                          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <app-icon [name]="isIpAddress(item) ? 'fas fa-network-wired' : 'fas fa-folder'" className="text-gray-400 text-xs"></app-icon>
                            <span class="truncate max-w-[150px] text-sm">{{ item }}</span>
                          </div>
                        }
                      </div>
                    </td>
                    <td class="px-4 py-4 align-top">
                      <div class="space-y-1.5">
                        @for(item of getDisplayItems(rule.appliedTo); track item) {
                          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <app-icon [name]="isIpAddress(item) ? 'fas fa-network-wired' : 'fas fa-folder'" className="text-gray-400 text-xs"></app-icon>
                            <span class="truncate max-w-[150px] text-sm">{{ item }}</span>
                          </div>
                        }
                      </div>
                    </td>
                    <td class="px-4 py-4 align-top text-gray-600 dark:text-gray-300">
                      <div class="flex flex-wrap gap-1.5">
                        @for(service of rule.services; track service.name) {
                          <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-white dark:bg-slate-700 text-[#293c51] dark:text-gray-200 border border-gray-200 dark:border-slate-600 shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition-all hover:shadow-md hover:border-[#679a41]/30">
                            {{ service.name }}
                          </span>
                        }
                      </div>
                    </td>
                    <td class="px-4 py-4 align-top">
                      <div class="flex flex-col gap-2">
                        @if (rule.action === 'Allow') {
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 w-fit">
                            <app-icon name="fas fa-check-circle" className="mr-1.5 text-[10px]" />
                            ALLOW
                          </span>
                        } @else {
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 w-fit">
                            <app-icon name="fas fa-ban" className="mr-1.5 text-[10px]" />
                            DROP
                          </span>
                        }
                      </div>
                    </td>
                    <td class="px-4 py-4 align-top text-center">
                      <div class="flex justify-center">
                        <span class="relative flex h-2.5 w-2.5">
                          @if (rule.status === 'Success' || !rule.status) {
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                          } @else {
                            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                          }
                        </span>
                      </div>
                    </td>
                    <td class="px-4 py-4 align-top text-center">
                      <div class="flex items-center justify-center gap-2">
                        <button (click)="handleEditRule(policy.id, rule)" class="p-1.5 text-gray-400 hover:text-[#679a41] hover:bg-[#679a41]/10 rounded-md transition-all" title="Edit Rule">
                          <app-icon name="fas fa-edit" className="text-sm"></app-icon>
                        </button>
                        <button (click)="handleDeleteRule(policy.id, rule.id)" class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-md transition-all" title="Delete Rule">
                          <app-icon name="fas fa-trash-alt" className="text-sm"></app-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="8" class="text-center py-8 text-gray-500 dark:text-gray-400 italic">No rules defined in this policy.</td>
                  </tr>
                }
              }
            } @empty {
              <tr>
                <td colspan="8" class="p-12 text-center">
                  <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 mb-4">
                    <app-icon name="fas fa-shield-alt" className="text-3xl"></app-icon>
                  </div>
                  <h3 class="text-lg font-semibold text-[#293c51] dark:text-gray-200">No Gateway Policies</h3>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">You haven't created any gateway policies yet. Click "Add Policy" to get started.</p>
                  <button (click)="handleAddPolicyClick()" class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#679a41] hover:bg-[#537d34] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#679a41]">
                    <app-icon name="fas fa-plus" className="mr-2" />
                    Create First Policy
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <app-advanced-delete-confirmation-modal
      [isOpen]="isDeletePolicyModalOpen()"
      itemType="Policy"
      [itemName]="policyToDelete()?.name || ''"
      (close)="isDeletePolicyModalOpen.set(false); policyToDelete.set(null)"
      (confirm)="handleConfirmDeletePolicy()">
    </app-advanced-delete-confirmation-modal>

    <app-advanced-delete-confirmation-modal
      [isOpen]="isDeleteModalOpen()"
      itemType="Item"
      [itemCount]="selectedItems().length"
      [itemName]="''"
      (close)="isDeleteModalOpen.set(false)"
      (confirm)="handleConfirmDelete()">
    </app-advanced-delete-confirmation-modal>

    <!-- View Sources Modal -->
    @if(isViewSourcesModalOpen()) {
      <div (click)="isViewSourcesModalOpen.set(false)" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div (click)="$event.stopPropagation()" class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[80vh] overflow-hidden border border-gray-200 dark:border-slate-700">
          <div class="p-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/30">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-[#679a41]/10 text-[#679a41] flex items-center justify-center">
                <app-icon name="fas fa-list" />
              </div>
              <h2 class="text-lg font-bold text-[#293c51] dark:text-gray-200">All Sources</h2>
            </div>
            <button (click)="isViewSourcesModalOpen.set(false)" class="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
              <app-icon name="fas fa-times" />
            </button>
          </div>
          <div class="p-6 overflow-y-auto">
            <div class="grid grid-cols-1 gap-2">
              @for(source of sourcesToView(); track source) {
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600">
                  <div class="flex items-center gap-3">
                    <app-icon [name]="isIpAddress(source) ? 'fas fa-network-wired' : 'fas fa-folder'" className="text-gray-400"></app-icon>
                    <span class="text-sm font-medium text-[#293c51] dark:text-gray-200">{{ source }}</span>
                  </div>
                  <span class="text-[10px] uppercase font-bold text-gray-400">{{ isIpAddress(source) ? 'IP' : 'Group' }}</span>
                </div>
              }
            </div>
          </div>
          <div class="p-4 flex justify-end bg-gray-50/50 dark:bg-slate-900/30 border-t border-gray-100 dark:border-slate-700">
            <button (click)="isViewSourcesModalOpen.set(false)" class="px-6 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-[#293c51] dark:text-gray-200 rounded-md text-sm font-bold hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors shadow-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GatewayFirewallComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private gatewayService = inject(GatewayFirewallService);

  // Main state
  policies = this.gatewayService.policies;
  selectedItems = signal<string[]>([]);
  isActionsMenuOpen = signal(false);

  // Modal states
  isDeletePolicyModalOpen = signal(false);
  policyToDelete = signal<GatewayPolicy | null>(null);
  isViewSourcesModalOpen = signal(false);
  sourcesToView = signal<string[]>([]);
  isDeleteModalOpen = signal(false);
  
  filteredPolicies = computed(() => {
    return this.policies();
  });

  isSelectionEmpty = computed(() => this.selectedItems().length === 0);
  isSingleSelection = computed(() => this.selectedItems().length === 1);
  isSinglePolicySelected = computed(() => {
    const selected = this.selectedItems();
    if (selected.length !== 1) return false;
    return this.policies().some(p => p.id === selected[0]);
  });

  togglePolicy(policyId: string): void {
    this.gatewayService.updatePolicy(policyId, { isExpanded: !this.gatewayService.getPolicyById(policyId)?.isExpanded });
  }
  
  handleSelect(id: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedItems.update(prev => 
      isChecked ? [...prev, id] : prev.filter(i => i !== id)
    );
  }

  handleDeleteClick(): void {
    if (this.isSelectionEmpty()) return;
    this.isDeleteModalOpen.set(true);
  }

  handleConfirmDelete(): void {
    const selected = this.selectedItems();
    selected.forEach(id => {
        this.gatewayService.deletePolicy(id);
    });
    this.selectedItems.set([]);
    this.isDeleteModalOpen.set(false);
  }

  handlePolicyNameSave(policyId: string, newName: string): void {
      this.gatewayService.updatePolicy(policyId, { name: newName });
  }

  handleRuleNameSave(policyId: string, ruleId: string, newName: string): void {
      this.gatewayService.updateRule(policyId, ruleId, { name: newName });
  }

  handleRuleActionChange(policyId: string, ruleId: string, newAction: 'Allow' | 'Drop' | 'Reject'): void {
    this.gatewayService.updateRule(policyId, ruleId, { action: newAction });
  }

  handleRuleUpdate(policyId: string, ruleId: string, field: keyof Omit<GatewayRule, 'id' | 'ruleId'>, value: any): void {
    this.gatewayService.updateRule(policyId, ruleId, { [field]: value });
  }

  getDisplayItems(value: string): string[] {
    if (!value) return [];
    return value.split(',').map(item => item.trim());
  }

  isIpAddress(value: string): boolean {
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return ipRegex.test(value);
  }

  getServiceNames(services: Service[]): string {
    return services.map(s => s.name).join(', ');
  }

  public handleAddPolicyClick(): void {
    this.router.navigate(['add-policy'], { relativeTo: this.route });
  }

  handleEditPolicy(policy: GatewayPolicy): void {
    this.router.navigate(['edit-policy', policy.id], { relativeTo: this.route });
  }

  handleEditRule(policyId: string, rule: GatewayRule): void {
    this.router.navigate(['edit-policy', policyId], { relativeTo: this.route });
  }

  handleDeleteRule(policyId: string, ruleId: string): void {
    this.gatewayService.removeRule(policyId, ruleId);
  }

  handleDeletePolicy(policy: GatewayPolicy): void {
    this.policyToDelete.set(policy);
    this.isDeletePolicyModalOpen.set(true);
  }

  handleConfirmDeletePolicy(): void {
    const policy = this.policyToDelete();
    if (policy) {
        this.gatewayService.deletePolicy(policy.id);
    }
    this.isDeletePolicyModalOpen.set(false);
    this.policyToDelete.set(null);
  }

  openViewSourcesModal(sources: string): void {
    this.sourcesToView.set(this.getDisplayItems(sources));
    this.isViewSourcesModalOpen.set(true);
  }
}
