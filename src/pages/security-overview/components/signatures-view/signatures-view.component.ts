import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-signatures-view',
  standalone: true,
  template: `
    <div class="rounded-xl p-6 bg-white dark:bg-slate-800 shadow">
      <h2 class="text-xl font-bold text-[#293c51] dark:text-gray-200">Signature Management</h2>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        This section will allow for viewing, enabling, and managing IDS/IPS signatures. Feature coming soon.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignaturesViewComponent {}
