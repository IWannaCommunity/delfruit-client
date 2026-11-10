import { API } from "@/utils/api";

let cachedCount: number | null = null;
let countPromise: Promise<number> | null = null;

export async function getCachedReviewCount(): Promise<number> {
  if (cachedCount !== null) {
    return cachedCount;
  }

  if (countPromise !== null) {
    return countPromise;
  }

  countPromise = API.reviews()
    .getReviewCount()
    .then((resp) => {
      cachedCount = resp.data.count;
      return cachedCount;
    })
    .finally(() => {
      countPromise = null;
    });

  return countPromise;
}