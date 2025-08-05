// src/app/services/modal.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Makes the service a singleton available throughout the app
})
export class ModalService {
  // A Subject is used to emit events. Components can subscribe to openModal$
  // to react when a modal needs to be opened.
  private openModalSource = new Subject<{ initialTab: 'login' | 'register', schoolId: string | null }>();
  openModal$ = this.openModalSource.asObservable(); // Expose as an Observable for components to subscribe

  /**
   * Requests the global Auth Modal to be opened.
   *
   * @param initialTab The tab to show initially ('login' or 'register').
   * @param schoolId Optional ID of a school if the modal is opened for a specific donation.
   */
  openAuthModal(initialTab: 'login' | 'register', schoolId: string | null = null): void {
    console.log('ModalService: Request to open Auth Modal for tab:', initialTab, 'School ID:', schoolId);
    this.openModalSource.next({ initialTab, schoolId });
  }

  // You generally don't need a public close method in the service if the modal itself
  // (AuthModalComponent) handles its own closure (e.g., via a close button click)
  // and emits an event to its parent (AppComponent) to handle the global state cleanup.
}