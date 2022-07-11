import { readFile } from "node:fs/promises";
import { beforeEach, it } from "vitest";
import { $fetch } from "ohmyfetch";
import { getEndpointAttention } from "~/logic/endpoint";
import { dumpHoleEntries, getHoleEntries } from "~/logic/hole";

/* describe('Hi', async () => {
  const TOKEN = await readFile("token.local.key", { encoding: "utf-8" });

  it('test', async () => {
    let entries = await $fetch(getEndpointAttention(TOKEN).toString()).then((raw_page: hole.raw.RawHolePage) => getHoleEntries(raw_page));
    let x = dumpHoleEntries(entries);
    console.error(x);
  })
})
 */

beforeEach(async (context) => {
  context.token = await readFile("token.local.key", { encoding: "utf-8" });
});

it("should work", async ({ token }) => {
  const entries = await $fetch(getEndpointAttention(token).toString(), {
    headers: {
      Referer: "https://pkuhelper.pku.edu.cn/hole/",
    },
  }).then((raw_page: hole.raw.RawHolePage) => getHoleEntries(raw_page));
  const x = dumpHoleEntries(entries);
  // eslint-disable-next-line no-console
  console.log(x);
});

declare module "vitest" {
  export interface TestContext {
    token: string
  }
}
