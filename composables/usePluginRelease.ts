import {PluginMeta} from "~/types/plugins";

export interface PluginRelease {
    schema_version: 5;
    id: string;
    latest_version: string;
    releases: ReleaseMetaGitHub[];
    release_meta: {
        [key: string]: PluginMeta;
    }
}

interface ReleaseMetaGitHub {
    url: string;
    name: string;
    tag_name: string;
    created_at: string;
    assets: ReleaseMetaGitHubAsset[];
    description: string;
    prerelease: boolean;
    parsed_version: string;
}

interface ReleaseMetaGitHubAsset {
    name: string;
    size: number;
    download_count: number;
    created_at: string;
    browser_download_url: string;
}

export const usePluginRelease = async (id: string): Promise<{ release: PluginRelease }> => {
    const release: PluginRelease = await $fetch(`https://raw.githubusercontent.com/MCDReforged/PluginCatalogue/meta/${id}/release.json`);
    return {release};
};
