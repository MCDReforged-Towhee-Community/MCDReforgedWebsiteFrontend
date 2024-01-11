import {
  gunzipSync,
} from "fflate";
import {
  Everything,
  AuthorSummary,
  Author,
  MetaInfo,
  ReleaseSummary,
  PluginInfo,
  PluginDataSummary,
} from "~/types/plugins";

function parse(dataAsU8Array: Uint8Array): object {
  return JSON.parse(Buffer.from(dataAsU8Array).toString('utf8'));
}

async function getPluginDataSummary(): Promise<PluginDataSummary> {
  // fetch
  const pluginDataSummary: PluginDataSummary = {};
  const everythingGzRaw: Blob = await $fetch("https://github.com/MCDReforged/PluginCatalogue/raw/meta/everything.json.gz") as Blob;
  const everything: Everything = parse(gunzipSync(new Uint8Array(await everythingGzRaw.arrayBuffer()))) as Everything;

  // authors
  const {authors}: AuthorSummary = everything.authors;

  // merge data
  const plugins = everything.plugins;
  for (const pluginID in plugins) {
    const allOfAPlugin = plugins[pluginID];
    pluginDataSummary[pluginID] = {
      meta: allOfAPlugin.meta,
      release: allOfAPlugin.release,
      info: allOfAPlugin.plugin,
      authors: allOfAPlugin.meta.authors.map((author: string): Author => ({
        name: author,
        link: authors[author]?.link ?? author,
      })),
    };
  }

  return pluginDataSummary;
}

export default defineCachedEventHandler(
  async (): Promise<PluginDataSummary> => await getPluginDataSummary(),
  {
    name: "plugins",
    maxAge: 60,
  }
);
