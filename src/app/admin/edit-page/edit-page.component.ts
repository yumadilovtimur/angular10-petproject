import { AlertService } from './../shared/services/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Post } from './../../shared/interfaces';
import { PostsService } from './../../shared/posts.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {
  form: FormGroup
  post: Post
  submitted: boolean = false
  updateSubscription: Subscription

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private alert: AlertService,
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.postsService.getById(params['id'])
        }),
      )
      .subscribe({
        next: (post: Post) => {
          this.post = post;
          this.form = new FormGroup({
            title: new FormControl(post.title, Validators.required),
            text: new FormControl(post.text, Validators.required),
          })
        }
      })
  }

  ngOnDestroy(): void {
    this.updateSubscription?.unsubscribe();
  }

  submit() {
    if (this.form.invalid) return;

    this.submitted = true;

    this.postsService.update({
      ...this.post,
      title: this.form.value.title,
      text: this.form.value.text,
    })
      .subscribe({
        next: () => {
          this.submitted = false;
          this.alert.success('Пост был успешно обновлён :)')
        },
      });
  }
}
