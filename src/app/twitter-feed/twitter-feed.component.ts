import { Component, OnInit } from '@angular/core';
import { TweetService } from '../tweet.service';

@Component({
  selector: 'app-twitter-feed',
  templateUrl: './twitter-feed.component.html',
  styleUrls: ['./twitter-feed.component.css']
})
export class TwitterFeedComponent implements OnInit{
  tweets!: any[];
  filteredTweets!: any[];
  retweetsOnly!: any[];
  searchedTweets!: any[];
  searchTerm!: string;
  retweetFilter: boolean = false;
  tweetsPerPage!: number;
  currentPage!: number;
  totalPages: any;
  pageNumbers: number[] = [];

  constructor(private tweetService: TweetService) { }

  ngOnInit() {
    this.getAllTweets();
    this.searchTerm = '';
    this.retweetFilter = false;
    this.tweetsPerPage = 5;
    this.currentPage = 1;
  }

  getAllTweets() {
    this.tweetService.getTweets().subscribe((data: any) => {
      this.tweets = data;
      this.filteredTweets = this.tweets;
      this.onPostsPerPageChange();
    });
  }
  searchTweet() {
    if (this.searchTerm.trim() === '') {
      this.filteredTweets = this.tweets;
      return;
    }
    this.searchedTweets = this.tweets.filter(tweet => tweet.user.screen_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      || tweet.user.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    this.onPostsPerPageChange();
  }

  toggleRetweetFilter() {
    this.retweetFilter = !this.retweetFilter;
    this.filterRetweets();
  }

  filterRetweets() {
    this.retweetsOnly = this.tweets.filter(tweet => {
      if (this.retweetFilter) {
        return tweet.retweeted_status !== undefined;
      }
      return true;
    });
    this.onPostsPerPageChange();
  }

  onPostsPerPageChange(): void {
    if (this.retweetFilter) {
      this.totalPages = Math.ceil(this.retweetsOnly.length / this.tweetsPerPage);
    } else if (this.searchTerm) {
      this.totalPages = Math.ceil(this.searchedTweets.length / this.tweetsPerPage);
    } else {
      this.totalPages = Math.ceil(this.tweets.length / this.tweetsPerPage);
    }
    this.generatePageNumbers();
    this.paginateTweets();
  }

  generatePageNumbers() {
    this.pageNumbers = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pageNumbers.push(i);
    }
  }

  paginateTweets() {
    const start = (this.currentPage - 1) * this.tweetsPerPage;
    const end = start + this.tweetsPerPage;
    if (this.retweetFilter) {
      this.filteredTweets = this.retweetsOnly.slice(start, end);
    } else if (this.searchTerm) {
      this.filteredTweets = this.searchedTweets.slice(start, end);
    } else {
      this.filteredTweets = this.tweets.slice(start, end);
    }
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.paginateTweets();
  } 
  onImageError(event:any, name:string) {
    event.target.style.display = 'none';
    const firstLetter = name.charAt(0).toUpperCase();
    event.target.parentNode.class='rounded-circle';
    event.target.parentNode.style.backgroundColor = 'rgb(209 63 63)';
    event.target.parentNode.style.textAlign = 'center';
    event.target.parentNode.style.color = 'white';
    event.target.parentNode.style.lineHeight = '45px';
    event.target.parentNode.style.borderRadius='50%';
    event.target.parentNode.style.width='6.333333%';
    event.target.parentNode.innerHTML = firstLetter;
  }
}
