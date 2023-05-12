import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  private apiUrl = 'assets/data.json';

  constructor(private http: HttpClient) { }

  getTweets() {
    return this.http.get(this.apiUrl);
  }
}