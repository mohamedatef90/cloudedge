
import { Injectable, signal } from '@angular/core';
import { Reservation, MOCK_INITIAL_RESERVATIONS } from './reservation.types';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private reservationsState = signal<Reservation[]>(MOCK_INITIAL_RESERVATIONS);
  
  reservations = this.reservationsState.asReadonly();

  getReservationById(id: string): Reservation | undefined {
    return this.reservations().find(res => res.id === id);
  }

  addReservation(reservation: Reservation): void {
    this.reservationsState.update(reservations => [reservation, ...reservations]);
  }
}