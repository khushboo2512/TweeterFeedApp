import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TwitterFeedComponent } from './twitter-feed.component';
import { TweetService } from '../tweet.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('TwitterFeedComponent', () => {
  let component: TwitterFeedComponent;
  let fixture: ComponentFixture<TwitterFeedComponent>;
  let tweetService: TweetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [TwitterFeedComponent],
      providers: [TweetService]
    });
    fixture = TestBed.createComponent(TwitterFeedComponent);
    component = fixture.componentInstance;
    tweetService = TestBed.inject(TweetService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component', () => {
    const mockTweets = [{ id: 1, text: 'My tweet' }, { id: 2, text: 'Another tweet today' }];
    spyOn(tweetService, 'getTweets').and.returnValue(of(mockTweets));
    component.ngOnInit();
    expect(component.currentPage).toBe(1);
    expect(component.tweetsPerPage).toBe(5);
  });
  it('should get all tweets and paginate them correctly', () => {
    const mockTweets = [{ id: 1, text: 'My tweet', user: { screen_name: 'username', name: 'User name' } }, { id: 2, text: 'Another tweet today', user: { screen_name: 'username2', name: 'User Name 2' } }];
    spyOn(tweetService, 'getTweets').and.returnValue(of(mockTweets));
    spyOn(component, 'onPostsPerPageChange');
    component.getAllTweets();
    expect(component.tweets).toEqual(mockTweets);
    expect(component.filteredTweets).toEqual(mockTweets);
    expect(component.onPostsPerPageChange).toHaveBeenCalled();
  });

  it('should filter tweets by search term', () => {
    const mockTweets = [
      { id: 1, text: 'A tweet by Mark', user: { name: 'Mark', screen_name: 'Mark.A' } },
      { id: 2, text: 'A tweet by Mark', user: { name: 'Mark', screen_name: 'Mark.B' } },
      { id: 3, text: 'A retweet by Chris', user: { name: 'Chris', screen_name: 'Chris.A' }, retweeted_status: {} }
    ];
    component.tweets = mockTweets;
    component.searchTerm = 'Mark';
    component.searchTweet();
    expect(component.filteredTweets.length).toBe(2);
    expect(component.filteredTweets[0].id).toBe(1);
    expect(component.filteredTweets[1].id).toBe(2);
  });
  it('should set filteredTweets to all tweets on searchTweet when searchTerm is empty', () => {
    component.filteredTweets = [];
    component.searchTerm = '';
    component.searchTweet();
    expect(component.filteredTweets).toEqual(component.tweets);
  });
  it('should filter retweets only', () => {
    const mockTweets = [
      { id: 1, text: 'A tweet by Mark', user: { name: 'Mark', screen_name: 'Mark.A' } },
      { id: 2, text: 'A tweet by Mark', user: { name: 'Mark', screen_name: 'Mark.B' } },
      { id: 3, text: 'A retweet by Chris', user: { name: 'Chris', screen_name: 'Chris.A' }, retweeted_status: {} }
    ];
    component.tweets = mockTweets;
    component.retweetFilter = true;
    component.filterRetweets();
    expect(component.retweetsOnly.length).toBe(1);
    expect(component.retweetsOnly[0].id).toBe(3);
  });
  it('should generate correct page numbers', () => {
    component.totalPages = 3;
    component.generatePageNumbers();
    expect(component.pageNumbers.length).toBe(3);
    expect(component.pageNumbers[0]).toBe(1);
    expect(component.pageNumbers[1]).toBe(2);
  });
  it('should paginate properly when page is changed', () => {
    const mockpageNumber = 2;
    spyOn(component, 'paginateTweets');
    component.onPageChange(mockpageNumber);
    expect(component.currentPage).toBe(2);
    expect(component.paginateTweets).toHaveBeenCalled();
  });
  it('should paginate tweets', () => {
    component.tweetsPerPage = 2;
    component.tweets = [
      { user: { screen_name: 'user1', name: 'User One' }, text: 'This is tweet one' },
      { user: { screen_name: 'user2', name: 'User Two' }, text: 'This is tweet two' },
      { user: { screen_name: 'user3', name: 'User Three' }, text: 'This is tweet three' },
      { user: { screen_name: 'user4', name: 'User Four' }, text: 'This is tweet four' }
    ];
    component.onPostsPerPageChange();
    expect(component.totalPages).toEqual(2);
    expect(component.pageNumbers).toEqual([1, 2]);
    expect(component.currentPage).toEqual(1);
    expect(component.filteredTweets.length).toEqual(2);
  });
  it('should update filteredTweets and generate page numbers on on call of retweet filter', () => {
    const mockTweets = [
      { id: 1, text: 'Hi from user1', user: { screen_name: 'user1', name: 'User 1' } },
      { id: 2, text: 'Hi from user2', user: { screen_name: 'user2', name: 'User 2' }, retweeted_status: {} },
    ];
    component.tweets = mockTweets;
    component.toggleRetweetFilter();
    expect(component.filteredTweets).toEqual([mockTweets[1]]);
    expect(component.totalPages).toBe(1);
    expect(component.pageNumbers).toEqual([1]);
  });
  it('should update image src when its broken', () => {
    const event = {
      target: {
        style: { display: 'block' },
        parentNode: {
          class: '',
          style: {
            backgroundColor:'',
            color:'',
            lineHeight:'',
            borderRadius:''
          },
          innerHTML: '<img src="invalid_image_url">'
        }
      }
    };
    const name = 'mark';
    component.onImageError(event, name);
    expect(event.target.parentNode.style.backgroundColor).toEqual('rgb(209 63 63)');
    expect(event.target.parentNode.style.color).toEqual('white');
    expect(event.target.parentNode.style.lineHeight).toEqual('45px');
    expect(event.target.parentNode.style.borderRadius).toEqual('50%');
    expect(event.target.parentNode.innerHTML).toEqual('M');
  });
});
