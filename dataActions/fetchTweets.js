require('dotenv').config();

const sendErrorEmail = require('../utils/emails').sendErrorEmail;
const TwitterAccount = require('./../db/models').TwitterAccount;
const Tweet = require('./../db/models').Tweet;
const Twitter = require('twitter-lite');
const db = require('./../db/models');
const differenceInDays = require('date-fns').differenceInDays;
const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();

const user = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET
});

(async () => {
  try {
    await db.sequelize.authenticate();

    const response = await user.getBearerToken();
    const app = new Twitter({ bearer_token: response.access_token });
    const accounts = await TwitterAccount.findAll();

    const fetchAndMapTweets = async account => {
      try {
        const data = await app.get('statuses/user_timeline', {
          screen_name: account.name,
          include_rts: true,
          exclude_replies: true,
          count: 15
        });

        const createTweet = async tweet => {
          const publishedDate = tweet.created_at || new Date();

          if (differenceInDays(new Date(publishedDate), new Date()) < -1) return;

          const newTweet = {
            twitterAccountId: account.id,
            text: entities.decode(tweet.text),
            tweetId: tweet.id_str,
            publishedDate,
            screenName: tweet.user.screen_name,
            name: tweet.user.name,
            profileImageUrl: tweet.user.profile_image_url_https,
            mediaUrl: tweet.extended_entities
              ? tweet.extended_entities.media[0].media_url_https
              : null,
            profileBannerUrl: tweet.user.profile_banner_url || null
          };

          const [dbTweet, created] = await Tweet.findCreateFind({
            where: { tweetId: newTweet.tweetId },
            defaults: newTweet
          });

          if (created) console.log('tweet created', dbTweet.text);
        };

        await Promise.all(data.map(createTweet));
      } catch (err) {
        return err;
      }
    };

    await Promise.all(accounts.map(account => fetchAndMapTweets(account)));

    db.sequelize.close();
  } catch (err) {
    console.error('main fetch tweets error(s)', err);
    sendErrorEmail('Fetch Tweets error', { err });
    db.sequelize.close();
  }
})();
