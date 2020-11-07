import { AuthService } from './../shared/services/auth.service';
import { User } from './../../shared/interfaces';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  form: FormGroup
  submitted: boolean = false;
  message: string | null = null;

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params.loginAgain) {
        this.message = 'Пожалуйста, введите данные для авторизации.';
      }

      if (params.authFailed) {
        this.message = 'Сессия истекла. Пожалуйста, авторизуйтесь снова.';
      }
    })

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    })
  }

  submit() {
    if (this.form.invalid) return;

    this.submitted = true;

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
    }

    this.auth.login(user)
      .subscribe({
        next: () => {
          this.form.reset();
          this.router.navigate(['/admin', 'dashboard']);
          this.submitted = false;
        },
        error: () => {
          this.submitted = false;
        }
      })
  }
}
