import JSZip from "jszip";
import {
    PluginMetaSummary,
    AuthorSummary,
    MetaInfo,
    ReleaseSummary,
    FormattedPluginInfo,
    PluginDataSummary,
} from "~/types/plugins";

async function getPluginDataSummary(): Promise<PluginDataSummary> {
    // fetch
    const pluginDataSummary: PluginDataSummary = {};
    const zipRaw: Blob = await $fetch("https://codeload.github.com/MCDReforged/PluginCatalogue/zip/refs/heads/meta") as Blob;
    const zip: JSZip = await new JSZip().loadAsync(await zipRaw.arrayBuffer());

    // authors
    const {authors}: AuthorSummary = JSON.parse(await zip.file("PluginCatalogue-meta/authors.json")!.async("string"));

    // merge data
    const pluginMetaSummary: PluginMetaSummary = JSON.parse(await zip.file("PluginCatalogue-meta/plugins.json")!.async("string"));
    for (const pluginID in pluginMetaSummary.plugins) {
        const meta: MetaInfo = pluginMetaSummary.plugins[pluginID];
        const release: ReleaseSummary = JSON.parse(await zip.file(`PluginCatalogue-meta/${pluginID}/release.json`)!.async("string")) as ReleaseSummary;
        const info: FormattedPluginInfo = JSON.parse(await zip.file(`PluginCatalogue-meta/${pluginID}/plugin.json`)!.async("string")) as FormattedPluginInfo;
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

export default defineEventHandler(async (): Promise<PluginDataSummary> => {
    return await getPluginDataSummary();
});
