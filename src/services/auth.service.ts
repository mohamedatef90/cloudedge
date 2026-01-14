import { Injectable, signal } from '@angular/core';
import { User, ApplicationCardData, AppLauncherData } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Mock user data.
  private mockUsers: Record<string, User> = {
      'customer': { id: 'user-001', role: 'customer', displayName: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/150?u=customer', isNewUser: true },
      'admin': { id: 'user-002', role: 'admin', displayName: 'Admin', avatarUrl: 'https://i.pravatar.cc/150?u=admin' },
      'reseller': { id: 'user-003', role: 'reseller', displayName: 'Reseller Inc.', avatarUrl: 'https://i.pravatar.cc/150?u=reseller' },
      'micro': { id: 'user-004', role: 'micro', displayName: 'Micro', avatarUrl: 'https://i.pravatar.cc/150?u=micro' },
  };

  user = signal<User | null>(this.mockUsers['admin']);
  isLoggedIn = signal<boolean>(true);

  constructor() {
    // Set admin user as the default logged in user.
    localStorage.setItem('currentUser', JSON.stringify(this.mockUsers['admin']));
  }

  logout(): void {
    // Logout is disabled in this context, but if called, it will just re-log as admin.
    this.user.set(this.mockUsers['admin']);
    this.isLoggedIn.set(true);
    localStorage.setItem('currentUser', JSON.stringify(this.mockUsers['admin']));
  }

  getAppLauncherItems(role: User['role'] | undefined): AppLauncherData {
    const corePortals: ApplicationCardData[] = [
        {
            id: 'website',
            name: 'WorldPosta.com',
            description: '',
            iconName: 'https://www.worldposta.com/assets/Newhomeimgs/vds-vs-vms/icons/Asset%201.png',
            launchUrl: 'https://user-types-of-worldposta-unified-si.vercel.app/#/'
        },
        { 
            id: 'cloudedge', 
            name: 'CloudEdge', 
            description: '',
            iconName: "https://console.worldposta.com/assets/loginImgs/edgeLogo.png", 
            launchUrl: '/#/app/cloud-edge' 
        },
        { 
            id: 'emailadmin', 
            name: 'Email Admin Suite', 
            description: '',
            iconName: "https://www.worldposta.com/assets/Posta-Logo.png", 
            launchUrl: 'https://user-types-of-worldposta-unified-si.vercel.app/#/app/email-admin-suite'
        }
    ];

    const customerApps: ApplicationCardData[] = [
        { id: 'dashboard', name: 'Dashboard', description: '', iconName: 'fas fa-home', launchUrl: '/#/app/cloud-edge'},
        { id: 'billing', name: 'Subscriptions', description: '', iconName: 'fas fa-wallet', launchUrl: '/#'},
        { id: 'invoices', name: 'Invoice History', description: '', iconName: 'fas fa-file-invoice', launchUrl: '/#'},
        { id: 'user-management', name: 'Users Management', description: '', iconName: 'fas fa-users-cog', launchUrl: '/#'},
        { id: 'support', name: 'Support Center', description: '', iconName: 'fas fa-headset', launchUrl: '/#'},
        { id: 'action-logs', name: 'Action Logs', description: '', iconName: 'fas fa-history', launchUrl: '/#/app/cloud-edge/administration/action-logs'},
        { id: 'settings', name: 'Settings', description: '', iconName: 'fas fa-cog', launchUrl: '/#'},
    ];

    let userApps: ApplicationCardData[] = [];

    if (role === 'customer') {
        userApps = customerApps;
    } else if (role === 'admin') {
        userApps = [
            { id: 'customers', name: 'Customers', description: '', iconName: 'fas fa-users', launchUrl: '/#' },
            { id: 'billing', name: 'Billing Overview', description: '', iconName: 'fas fa-cash-register', launchUrl: '/#' },
        ];
    } else if (role === 'reseller') {
        userApps = [
            { id: 'customers', name: 'My Customers', description: '', iconName: 'fas fa-user-friends', launchUrl: '/#' },
            { id: 'billing', name: 'Reseller Billing', description: '', iconName: 'fas fa-file-invoice-dollar', launchUrl: '/#' },
        ];
    }
    
    return { corePortals, userApps };
  };
}