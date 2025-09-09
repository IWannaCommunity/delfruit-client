import { 
  APIApi, AuthenticationApi, CompositeApi, DefaultApi, GamesApi,
  ListsApi, MessagesApi, NewsApi, RatingsApi, ReportsApi, ReviewsApi,
  ScreenshotsApi, TagsApi, UsersApi
 } from "delfruit-swagger-cg-sdk";
import { CFG } from "./config";

// A cache to hold singleton clients
const apiInstances = new Map<string, any>();

function getApi<T>(ApiClass: new (...args: any[]) => T, key: string): T {
  if (!apiInstances.has(key)) {
    // Construct only once
    apiInstances.set(key, new ApiClass(undefined, CFG.apiURL.origin));
  }
  return apiInstances.get(key);
}

export const API = {
  API: () => getApi<APIApi>(APIApi, "APIApi"),
  authentication: () => getApi<AuthenticationApi>(AuthenticationApi, "AuthenticationApi"),
  composite: () => getApi<CompositeApi>(CompositeApi, "CompositeApi"),
  default: () => getApi<DefaultApi>(DefaultApi, "DefaultApi"),
  games: () => getApi<GamesApi>(GamesApi, "GamesApi"),
  lists: () => getApi<ListsApi>(ListsApi, "ListsApi"),
  messages: () => getApi<MessagesApi>(MessagesApi, "MessagesApi"),
  news: () => getApi<NewsApi>(NewsApi, "NewsApi"),
  ratings: () => getApi<RatingsApi>(RatingsApi, "RatingsApi"),
  reports: () => getApi<ReportsApi>(ReportsApi, "ReportsApi"),
  reviews: () => getApi<ReviewsApi>(ReviewsApi, "ReviewsApi"),
  screenshots: () => getApi<ScreenshotsApi>(ScreenshotsApi, "ScreenshotsApi"),
  tags: () => getApi<TagsApi>(TagsApi, "TagsApi"),
  users: () => getApi<UsersApi>(UsersApi, "UsersApi"),
};