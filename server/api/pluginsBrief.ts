import {
    PluginDataBriefSummary,
    PluginDataSummary
} from "~/types/plugins";

async function getPluginDataBriefSummary(): Promise<PluginDataBriefSummary> {
    const pluginDataSummary: PluginDataSummary = await $fetch("/api/plugins");
    const pluginDataBriefSummary: PluginDataBriefSummary = {};

    for (const id in pluginDataSummary) {
        const {meta, release, info, authors} = pluginDataSummary[id];

        // updated_at
        let updated_at: string | null = null;
        if (release.releases.length !== 0) {
            updated_at = release.releases[0].created_at;
        }

        // downloads
        let downloads: number = 0;
        for (const {assets} of release.releases) {
            for (const {download_count} of assets) {
                downloads += download_count;
            }
        }

        // add to pluginDataBriefSummary
        pluginDataBriefSummary[id] = {
            id: meta.id,
            name: meta.name,
            version: meta.version,
            authors: authors,
            description: meta.description,
            labels: info.labels,
            updated_at: updated_at,
            downloads: downloads
        };
    }

    return pluginDataBriefSummary;
}

export default defineEventHandler(async (event): Promise<PluginDataBriefSummary> => {
    return await getPluginDataBriefSummary();
});