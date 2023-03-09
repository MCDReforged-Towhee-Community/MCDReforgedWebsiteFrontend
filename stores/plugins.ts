interface PluginStoreState {
    pluginsMeta: PluginsMeta | undefined
}

export interface PluginsMeta {
    plugin_amount: number,
    plugins: { [key: string]: PluginMeta }
}

export interface PluginMeta {
    schema_version: 1,
    id: string,
    name: string,
    version: string,
    repository: string,
    branch: string,
    related_path: string,
    labels: string[],
    authors: string[],
    dependencies: { [key: string]: string },
    requirements: string[],
    description: PluginMetaDescription
}

export interface PluginMetaDescription {
    en_us?: string,
    zh_cn?: string
}

export const usePluginsStore = defineStore("plugins", {
    state: (): PluginStoreState => ({
        pluginsMeta: undefined,
    }),
    getters: {
        /**
         * Check if the plugin exists
         */
        exists: (state): (id: string) => boolean => {
            return (id) => id in state.pluginsMeta!.plugins;
        },
        /**
         * Get plugin meta by id.
         */
        getPluginMeta: (state): (id: string) => PluginMeta | undefined => {
            return (id) => {
                if (state.pluginsMeta !== undefined && id in state.pluginsMeta.plugins) {
                    return state.pluginsMeta.plugins[id];
                } else {
                    return undefined;
                }
            };
        },
    },
    async hydrate(storeState) {
        storeState.pluginsMeta = JSON.parse(await $fetch("https://raw.githubusercontent.com/MCDReforged/PluginCatalogue/meta/plugins.json"));
    },
});
