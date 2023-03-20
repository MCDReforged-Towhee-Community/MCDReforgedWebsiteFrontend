import {
    PluginData,
    PluginDataSummary,
    PluginDataBrief,
    PluginDataBriefSummary,
} from "~/types/plugins";

interface PluginStoreState {
    pluginDataSummary: PluginDataSummary;
    pluginDataBriefSummary: PluginDataBriefSummary | undefined;
}

export const usePluginsStore = defineStore("plugins", {
    state: (): PluginStoreState => ({
        pluginDataSummary: {},
        pluginDataBriefSummary: undefined,
    }),
    getters: {
        /**
         * Check if the plugin exists
         */
        exists(state): (id: string) => boolean {
            return (id) => state.pluginDataBriefSummary !== undefined && id in state.pluginDataBriefSummary;
        },

        /**
         * Get plugin data by id.
         */
        getPluginData(state): (id: string) => Promise<PluginData | undefined> {
            return async (id) => {
                if (this.exists(id)) {
                    // fetch if not exists
                    if (!(id in state.pluginDataSummary)) {
                        state.pluginDataSummary[id] = await $fetch("/api/plugins/" + id);
                    }

                    // return
                    return state.pluginDataSummary[id];
                } else {
                    return undefined;
                }
            };
        },

        /**
         * Get plugin data brief by id.
         */
        getPluginDataBrief(state): (id: string) => PluginDataBrief | undefined {
            return (id) => {
                if (this.exists(id)) {
                    return state.pluginDataBriefSummary![id];
                } else {
                    return undefined;
                }
            };
        },
    },
    actions: {
        async nuxtServerInit() {
            // check if already fetched
            if (this.pluginDataBriefSummary !== undefined) {
                return;
            }

            // fetch plugins
            this.pluginDataBriefSummary = await $fetch("/api/pluginsBrief");
        },
    },
});
