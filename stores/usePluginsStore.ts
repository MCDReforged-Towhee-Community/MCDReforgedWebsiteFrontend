import {PluginDataBrief, PluginDataBriefSummary} from "~/types/plugins";

interface PluginStoreState {
    plugins: PluginDataBriefSummary | undefined;
}

export const usePluginsStore = defineStore("plugins", {
    state: (): PluginStoreState => ({
        plugins: undefined,
    }),
    getters: {
        /**
         * Check if the plugin exists
         */
        exists: (state): (id: string) => boolean => {
            return (id) => id in state.plugins!.plugins;
        },
        /**
         * Get plugin meta by id.
         */
        getPluginDataBrief: (state): (id: string) => PluginDataBrief | undefined => {
            return (id) => {
                if (state.plugins !== undefined && id in state.plugins) {
                    return state.plugins[id];
                } else {
                    return undefined;
                }
            };
        },
    },
    actions: {
        async nuxtServerInit() {
            // check if already fetched
            if (this.plugins !== undefined) {
                return;
            }

            // fetch plugins
            this.plugins = await $fetch("/api/pluginsBrief");
        },
    },
});
