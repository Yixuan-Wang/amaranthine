export const API = (token: string) => new URL(`https://pkuhelper.pku.edu.cn/services/pkuhole/api.php?PKUHelperAPI=3.0&jsapiver=201027113050-459074&user_token=${token}`);

export const IMAGE_CDN = () => new URL("https://pkuhelper.pku.edu.cn/services/pkuhole/images/");

export const AUDIO_CDN = () => new URL("https://pkuhelper.pku.edu.cn/services/pkuhole/audios/");

export const ENDPOINT_TIMEZONE_OFFSET = 8;

export function getEndpointReply(token: string, hole: number): URL {
  const url = API(token);
  url.searchParams.set("action", "getcomment");
  url.searchParams.set("pid", `${hole}`);
  return url;
}

export function getEndpointFeed(token: string, page: number): URL {
  const url = API(token);
  url.searchParams.set("action", "getlist");
  url.searchParams.set("p", `${page}`);
  return url;
}

export function getEndpointAttention(token: string): URL {
  const url = API(token);
  url.searchParams.set("action", "getattention");
  return url;
}

export function getEndpointSingle(token: string, hole: number): URL {
  const url = API(token);
  url.searchParams.set("action", "getone");
  url.searchParams.set("pid", `${hole}`);
  return url;
}

export function getEndpointSearch(token: string, keyword: string, page: number): URL {
  const url = API(token);
  url.searchParams.set("action", "search");
  url.searchParams.set("pagesize", "50");
  url.searchParams.set("page", `${page}`);
  url.searchParams.set("keywords", keyword);
  return url;
}

export function getEndpointImage(image: string): URL {
  const url = IMAGE_CDN();
  return new URL(image, url);
}

export function getEndpointAudio(image: string): URL {
  const url = AUDIO_CDN();
  return new URL(image, url);
}
