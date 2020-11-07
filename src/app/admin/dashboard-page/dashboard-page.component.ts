import { AlertService } from './../shared/services/alert.service';
import { Post } from './../../shared/interfaces';
import { PostsService } from './../../shared/posts.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postSubscription: Subscription
  deleteSubscription: Subscription
  search: string = '';

  constructor(
    private postsService: PostsService,
    private alert: AlertService,
  ) { }

  ngOnInit(): void {
    this.postSubscription = this.postsService.getAll()
      .subscribe({
        next: (posts) => {
          console.log('posts', posts)
          this.posts = posts;
        }
      })
  }

  ngOnDestroy(): void {
    this.postSubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
  }

  remove(id: string) {
    this.deleteSubscription = this.postsService.remove(id).subscribe({
      next: () => {
        this.posts = this.posts.filter(post => post.id !== id);
        this.alert.error('Пост был успешно удалён :)')
      }
    })
  }
}
