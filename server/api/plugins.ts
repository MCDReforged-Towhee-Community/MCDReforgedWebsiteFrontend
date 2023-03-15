import JSZip from "jszip";
import {
    PluginMetaSummary,
    AuthorSummary,
    MetaInfo,
    ReleaseSummary,
    FormattedPluginInfo,
    PluginCatalogueSummary,
} from "~/types/plugins";

const pluginCatalogueSummary: PluginCatalogueSummary = {};

function updatePluginCatalogueSummary() {
    $fetch("https://codeload.github.com/MCDReforged/PluginCatalogue/zip/refs/heads/meta")
        .then((res) => (res as Blob).arrayBuffer())
        .then((res) => new JSZip().loadAsync(res))
        .then(async (zip) => {
            // authors
            const {authors}: AuthorSummary = JSON.parse(await zip.file("PluginCatalogue-meta/authors.json")!.async("string"));

            // plugins
            const pluginMetaSummary: PluginMetaSummary = JSON.parse(await zip.file("PluginCatalogue-meta/plugins.json")!.async("string"));
            for (const pluginID in pluginMetaSummary.plugins) {
                const meta: MetaInfo = pluginMetaSummary.plugins[pluginID];
                const release: ReleaseSummary = JSON.parse(await zip.file(`PluginCatalogue-meta/${pluginID}/release.json`)!.async("string")) as ReleaseSummary;
                const info: FormattedPluginInfo = JSON.parse(await zip.file(`PluginCatalogue-meta/${pluginID}/plugin.json`)!.async("string")) as FormattedPluginInfo;
                pluginCatalogueSummary[pluginID] = {
                    meta: meta,
                    release: release,
                    info: info,
                    authors: meta.authors.map((author) => ({
                        name: author,
                        link: authors[author].link
                    })),
                };
            }

            // log
            const authorCount = authors.length;
            const pluginCount = Object.keys(pluginCatalogueSummary).length;
            console.log(`Plugin catalogue updated with ${authorCount} authors and ${pluginCount} plugins`);

            // next update
            setTimeout(updatePluginCatalogueSummary, 1000 * 60 * 10);
        });
}

updatePluginCatalogueSummary();

export default defineEventHandler((): PluginCatalogueSummary => {
    return pluginCatalogueSummary;
});
