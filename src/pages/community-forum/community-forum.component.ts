import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../components/icon/icon.component';
import { RouterModule } from '@angular/router';
import { ForumService } from './forum.service';

@Component({
  selector: 'app-community-forum',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule],
  templateUrl: './community-forum.component.html',
  styleUrls: ['./community-forum.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityForumComponent {
  private forumService = inject(ForumService);
  categories = this.forumService.getCategories();
}