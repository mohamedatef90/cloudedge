import { Injectable, signal } from '@angular/core';

export interface Profile {
  id: string;
  name: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  profiles = signal<Profile[]>([
    { id: '1', name: 'Default Profile', type: 'System' }
  ]);

  addProfile(profile: Omit<Profile, 'id'>) {
    const newProfile = { ...profile, id: Date.now().toString() };
    this.profiles.update(p => [...p, newProfile]);
  }

  deleteProfile(id: string) {
    this.profiles.update(p => p.filter(profile => profile.id !== id));
  }
}
