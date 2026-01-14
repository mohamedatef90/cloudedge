
import { ChangeDetectionStrategy, Component, output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginSuccess = output<void>();
  
  private authService = inject(AuthService);

  username = signal('');
  password = signal('');
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  async onLogin(): Promise<void> {
    if (!this.username() || !this.password()) {
        this.errorMessage.set('Please enter both username and password.');
        return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const success = await this.authService.login(this.username(), this.password());
      if (success) {
        this.loginSuccess.emit();
      } else {
        this.errorMessage.set('Invalid username or password.');
      }
    } catch (error) {
      this.errorMessage.set('An unexpected error occurred.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
