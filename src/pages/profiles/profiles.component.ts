import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';
import { ProfilesService } from './services/profiles.service';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './profiles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onGlobalClick($event.target)',
  },
})
export class ProfilesComponent {
  private router = inject(Router);
  public profilesService = inject(ProfilesService);
  
  isAddProfileMenuOpen = signal(false);
  openActionMenuId = signal<string | null>(null);

  onGlobalClick(target: HTMLElement): void {
    if (!target.closest('.add-profile-container')) {
      this.isAddProfileMenuOpen.set(false);
    }
    if (!target.closest('.action-menu-container')) {
      this.closeActionMenu();
    }
  }

  toggleAddProfileMenu(event: Event): void {
    event.stopPropagation();
    this.isAddProfileMenuOpen.update(v => !v);
  }

  toggleActionMenu(id: string): void {
    this.openActionMenuId.update(current => current === id ? null : id);
  }

  closeActionMenu(): void {
    this.openActionMenuId.set(null);
  }

  deleteProfile(id: string): void {
    this.profilesService.deleteProfile(id);
    this.closeActionMenu();
  }

  addContextProfile(): void {
    this.router.navigate(['/app/cloud-edge/administration/profiles/add-context-profile']);
    this.isAddProfileMenuOpen.set(false);
  }

  addLayer7Profile(): void {
    console.log('Adding Layer 7 Profile');
    this.isAddProfileMenuOpen.set(false);
  }
}
