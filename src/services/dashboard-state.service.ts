
import { Injectable, signal, effect } from '@angular/core';

export interface DashboardWidgetVisibility {
  stats: boolean;
  topVms: boolean;
  auditTrail: boolean;
  securityScore: boolean;
  networkStatus: boolean;
  helpfulResources: boolean;
}

const DEFAULT_VISIBILITY: DashboardWidgetVisibility = {
  stats: true,
  topVms: true,
  auditTrail: true,
  securityScore: true,
  networkStatus: true,
  helpfulResources: true,
};

@Injectable({
  providedIn: 'root',
})
export class DashboardStateService {
  private readonly storageKey = 'dashboardWidgetVisibility';

  widgetVisibility = signal<DashboardWidgetVisibility>(this.loadState());

  constructor() {
    effect(() => {
      this.saveState(this.widgetVisibility());
    });
  }

  private loadState(): DashboardWidgetVisibility {
    try {
      const storedState = localStorage.getItem(this.storageKey);
      if (storedState) {
        // Make sure stored state has all keys from default
        const parsed = JSON.parse(storedState);
        return { ...DEFAULT_VISIBILITY, ...parsed };
      }
    } catch (e) {
      console.error('Error loading dashboard state from localStorage', e);
    }
    return DEFAULT_VISIBILITY;
  }

  private saveState(state: DashboardWidgetVisibility): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving dashboard state to localStorage', e);
    }
  }

  updateVisibility(newVisibility: DashboardWidgetVisibility): void {
    this.widgetVisibility.set(newVisibility);
  }
}
