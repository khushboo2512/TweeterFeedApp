import { TweetTextPipe } from './tweet-text.pipe';

describe('TweetTextPipe', () => {
  let pipe: TweetTextPipe;

  beforeEach(() => {
    pipe = new TweetTextPipe();
  });

  it('should transform text by replacing URLs with links', () => {
    const text = 'Check this site: https://example.com';
    const entities = {
      urls: [
        {
          url: 'https://example.com',
          display_url: 'example.com',
          expanded_url: 'https://example.com'
        }
      ]
    };
    const transformedText = pipe.transform(text, entities);
    expect(transformedText).toContain('<a href="https://example.com" target="_blank">example.com</a>');
  });

  it('should transform text by replacing hashtags with links', () => {
    const text = 'Check out this #cool website';
    const entities = {
      hashtags: [
        {
          text: 'cool'
        }
      ]
    };
    const transformedText = pipe.transform(text, entities);
    expect(transformedText).toContain('<a href="https://twitter.com/hashtag/cool" target="_blank">#cool</a>');
  });

  it('should transform text by replacing user mentions with links', () => {
    const text = 'Check out @example_user';
    const entities = {
      user_mentions: [
        {
          screen_name: 'example_user'
        }
      ]
    };
    const transformedText = pipe.transform(text, entities);
    expect(transformedText).toContain('<a href="https://twitter.com/example_user" target="_blank">@example_user</a>');
  });

  it('should return original text if no entities are provided', () => {
    const text = 'This text has no entities';
    const transformedText = pipe.transform(text, null);
    expect(transformedText).toBe(text);
  });
});







