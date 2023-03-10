import {
    PluginMetaSummary,
    MetaInfo,
    AuthorSummary,
    Author,
    ReleaseSummary,
    FormattedPluginInfo,
} from "~/types/plugins";

interface PluginStoreState {
    pluginMetaSummary: PluginMetaSummary | undefined;
    authorSummary: AuthorSummary | undefined;
}

export const usePluginsStore = defineStore("plugins", {
    state: (): PluginStoreState => ({
        pluginMetaSummary: undefined,
        authorSummary: undefined,
    }),
    getters: {
        /**
         * Check if the plugin exists
         */
        exists: (state): (id: string) => boolean => {
            return (id) => id in state.pluginMetaSummary!.plugins;
        },
        /**
         * Get plugin meta by id.
         */
        getPluginMeta: (state): (id: string) => MetaInfo | undefined => {
            return (id) => {
                if (state.pluginMetaSummary !== undefined && id in state.pluginMetaSummary.plugins) {
                    return state.pluginMetaSummary.plugins[id];
                } else {
                    return undefined;
                }
            };
        },
        /**
         * Get author by name.
         */
        getAuthor: (state): (name: string) => Author | undefined => {
            return (name) => {
                if (state.authorSummary !== undefined && name in state.authorSummary.authors) {
                    return state.authorSummary.authors[name];
                } else {
                    return undefined;
                }
            };
        },
    },
    actions: {
        /**
         * Get plugin release by id.
         * @param id Plugin id.
         */
        async getPluginReleaseSummary(id: string): Promise<ReleaseSummary> {
            return JSON.parse(await $fetch(`https://raw.githubusercontent.com/MCDReforged/PluginCatalogue/meta/${id}/release.json`));
        },

        /**
         * Get formatted plugin info by id.
         * @param id Plugin id.
         */
        async getFormattedPluginInfo(id: string): Promise<FormattedPluginInfo> {
            return JSON.parse(await $fetch(`https://raw.githubusercontent.com/MCDReforged/PluginCatalogue/meta/${id}/plugin.json`));
        }
    },
    async hydrate(storeState) {
        storeState.pluginMetaSummary = JSON.parse(await $fetch("https://raw.githubusercontent.com/MCDReforged/PluginCatalogue/meta/plugins.json"));
        storeState.authorSummary = JSON.parse(await $fetch("https://raw.githubusercontent.com/MCDReforged/PluginCatalogue/meta/authors.json"));
    },
});
