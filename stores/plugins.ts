import {PluginMeta} from "~/types/plugins";

interface PluginStoreState {
    pluginsMeta: PluginsMeta | undefined;
}

interface PluginsMeta {
    plugin_amount: number;
    plugins: { [key: string]: PluginMeta };
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
