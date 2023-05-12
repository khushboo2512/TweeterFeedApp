import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TwitterFeedComponent } from './twitter-feed/twitter-feed.component';

const routes: Routes = [
  { path: '', component: TwitterFeedComponent },
  { path: 'tweeterFeed', component: TwitterFeedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
