import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { IconComponent } from '../../../../components/icon/icon.component';
import { ForumService } from '../../forum.service';

@Component({
  selector: 'app-topic-page',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule],
  templateUrl: './topic-page.component.html',
  styleUrls: ['./topic-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private forumService = inject(ForumService);

  private topicId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));

  topicData = computed(() => {
    const id = this.topicId();
    if (id) {
      return this.forumService.getTopicById(id);
    }
    return undefined;
  });

  topic = computed(() => this.topicData()?.topic);
  category = computed(() => this.topicData()?.category);

  ngOnInit() {
    // Scroll to top on component load
    window.scrollTo(0, 0);
  }
}
