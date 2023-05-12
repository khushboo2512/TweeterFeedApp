import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TwitterFeedComponent } from './twitter-feed/twitter-feed.component';
import { TweetTextPipe } from './tweet-text.pipe';
import { TweetService } from './tweet.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    TwitterFeedComponent,
    TweetTextPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [TweetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
