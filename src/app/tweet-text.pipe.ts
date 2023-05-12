import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tweetText'
})
export class TweetTextPipe implements PipeTransform {

  transform(text: string, entities: any): string {
    if (!entities) {
      return text;
    }

    const urls = entities.urls || [];
    const hashtags = entities.hashtags || [];
    const userMentions = entities.user_mentions || [];
    const medias = entities.media || [];
    // Replace URLs
    if(urls){
    for (const url of urls) {
      const replacement = `<a href="${url.expanded_url}" target="_blank">${url.display_url}</a>`;
      text = text.replace(url.url, replacement);
    }}

    // Replace hashtags
    for (const hashtag of hashtags) {
      const replacement = `<a href="https://twitter.com/hashtag/${hashtag.text}" target="_blank">#${hashtag.text}</a>`;
      text = text.replace(`#${hashtag.text}`, replacement);
    }

    // Replace user mentions
    for (const userMention of userMentions) {
      const replacement = `<a href="https://twitter.com/${userMention.screen_name}" target="_blank">@${userMention.screen_name}</a>`;
      text = text.replace(`@${userMention.screen_name}`, replacement);
    }

    return text;
  }

}