import JSZip from "jszip";
import {
    PluginMetaSummary,
    AuthorSummary,
    MetaInfo,
    ReleaseSummary,
    FormattedPluginInfo,
    MergedPluginDataSummary,
} from "~/types/plugins";


function updatePluginCatalogueSummary() {
    $fetch("https://codeload.github.com/MCDReforged/PluginCatalogue/zip/refs/heads/meta")
        .then((res) => (res as Blob).arrayBuffer())
        .then((res) => new JSZip().loadAsync(res))
        .then(async (zip) => {
            // summary
            const mergedPluginDataSummary: MergedPluginDataSummary = {};

            // authors
            const {authors}: AuthorSummary = JSON.parse(await zip.file("PluginCatalogue-meta/authors.json")!.async("string"));

            // merge data
            const pluginMetaSummary: PluginMetaSummary = JSON.parse(await zip.file("PluginCatalogue-meta/plugins.json")!.async("string"));
            for (const pluginID in pluginMetaSummary.plugins) {
                const meta: MetaInfo = pluginMetaSummary.plugins[pluginID];
                const release: ReleaseSummary = JSON.parse(await zip.file(`PluginCatalogue-meta/${pluginID}/release.json`)!.async("string")) as ReleaseSummary;
                const info: FormattedPluginInfo = JSON.parse(await zip.file(`PluginCatalogue-meta/${pluginID}/plugin.json`)!.async("string")) as FormattedPluginInfo;
                mergedPluginDataSummary[pluginID] = {
                    meta: meta,
                    release: release,
                    info: info,
                    authors: meta.authors.map((author) => ({
                        name: author,
                        link: authors[author].link
                    })),
                };
            }

            // save to storage
            await useStorage().setItem("mergedPluginCatalogueSummary", mergedPluginDataSummary);

            // log
            const authorCount = authors.length;
            const pluginCount = Object.keys(mergedPluginDataSummary).length;
            console.log(`Plugin catalogue updated with ${authorCount} authors and ${pluginCount} plugins`);

            // next update
            setTimeout(updatePluginCatalogueSummary, 1000 * 60 * 10);
        });
}

updatePluginCatalogueSummary();

export default defineEventHandler((): MergedPluginDataSummary => {
    return useStorage().getItem("mergedPluginCatalogueSummary");
});
