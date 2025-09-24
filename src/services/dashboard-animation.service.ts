import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardAnimationService {
  /**
   * A signal to track if the dashboard's initial animations have been played.
   * This ensures animations only run once per application session.
   */
  hasAnimated = signal(false);

  /**
   * A signal to track if the intro splash screen has been played.
   */
  introPlayed = signal(false);

  /**
   * A signal to track if the welcome card has been dismissed by the user.
   * Reads from localStorage to persist the state across sessions.
   */
  welcomeDismissed = signal(localStorage.getItem('welcomeDismissed') === 'true');

  /**
   * Marks the dashboard animations as having been played.
   */
  setAnimated(): void {
    this.hasAnimated.set(true);
  }

  /**
   * Marks the intro as having been played.
   */
  setIntroPlayed(): void {
    this.introPlayed.set(true);
  }
  
  /**
   * Marks the welcome card as dismissed and saves the state to localStorage.
   */
  dismissWelcome(): void {
    this.welcomeDismissed.set(true);
    localStorage.setItem('welcomeDismissed', 'true');
  }
}