import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Provider, LOCALE_ID } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PostPageComponent } from './post-page/post-page.component';
import { PostComponent } from './shared/components/post/post.component';
import { AuthInterceptor } from './shared/auth.interceptor';
import { SharedModule } from './shared/shared.module';

registerLocaleData(localeRu);

const appInterceptors = [
  AuthInterceptor,
];

const interceptorsProviders = appInterceptors.map((interceptor): Provider => {
  return {
    provide: HTTP_INTERCEPTORS,
    useClass: interceptor,
    multi: true,
  }
});

// TODO: Пройтись по имеющимся проектам (angular-basics, angular-routing) и видео урокам. И внедрить всё, чего нету
@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HomePageComponent,
    PostPageComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ru-RU' },
    ...interceptorsProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
