
import { Injectable, signal } from '@angular/core';
import { Reservation, MOCK_INITIAL_RESERVATIONS } from './reservation.types';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private reservationsState = signal<Reservation[]>(MOCK_INITIAL_RESERVATIONS.slice(0, 3));
  
  reservations = this.reservationsState.asReadonly();

  addReservation(reservation: Reservation): void {
    this.reservationsState.update(reservations => [reservation, ...reservations]);
  }
}
