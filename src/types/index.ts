
export interface User {
  id: string;
  role: 'customer' | 'admin' | 'reseller' | 'micro';
  displayName: string;
  avatarUrl?: string;
  isNewUser?: boolean;
}

export interface NavItem {
  name: string;
  path: string;
  iconName: string;
}

export interface ApplicationCardData {
  id: string;
  name: string;
  description: string;
  iconName: string;
  launchUrl: string;
}

export interface AppLauncherData {
  corePortals: ApplicationCardData[];
  userApps: ApplicationCardData[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}