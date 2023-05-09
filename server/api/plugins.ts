import {unzipSync} from "fflate";
import {
  PluginMetaSummary,
  AuthorSummary,
  MetaInfo,
  ReleaseSummary,
  FormattedPluginInfo,
  PluginDataSummary,
} from "~/types/plugins";

function parse(dataAsU8Array: Uint8Array): object {
  return JSON.parse(Buffer.from(dataAsU8Array).toString('utf8'));
}

async function getPluginDataSummary(): Promise<PluginDataSummary> {
  // fetch
  const pluginDataSummary: PluginDataSummary = {};
  const zipRaw: Blob = await $fetch("https://codeload.github.com/MCDReforged/PluginCatalogue/zip/refs/heads/meta") as Blob;
  const zip = unzipSync(new Uint8Array(await zipRaw.arrayBuffer()));

  // authors
  const {authors}: AuthorSummary = parse(zip["PluginCatalogue-meta/authors.json"]) as AuthorSummary;

  // merge data
  const pluginMetaSummary: PluginMetaSummary = parse(zip["PluginCatalogue-meta/plugins.json"]) as PluginMetaSummary;
  for (const pluginID in pluginMetaSummary.plugins) {
    const meta: MetaInfo = pluginMetaSummary.plugins[pluginID];
    const release: ReleaseSummary = parse(zip[`PluginCatalogue-meta/${pluginID}/release.json`]) as ReleaseSummary;
    const info: FormattedPluginInfo = parse(zip[`PluginCatalogue-meta/${pluginID}/plugin.json`]) as FormattedPluginInfo;
    pluginDataSummary[pluginID] = {
      meta: meta,
      release: release,
      info: info,
      authors: meta.authors.map((author) => ({
        name: author,
        link: authors[author].link
      })),
    };
  }

  return pluginDataSummary;
}

export default defineCachedEventHandler(
  async (): Promise<PluginDataSummary> => await getPluginDataSummary(),
  {
    name: "plugins",
    maxAge: 60 * 10,
  }
);
