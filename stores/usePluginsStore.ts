import {
    PluginDataSummary,
    PluginData,
    PluginDataBriefSummary,
    PluginDataBrief,
    PluginVotesSummary,
    PluginVotes,
} from "~/types/plugins";
import {useLeanCloud} from "~/composables/useLeanCloud";
import {RemovableRef, useLocalStorage} from "@vueuse/core";

interface PluginStoreState {
    pluginDataSummary: PluginDataSummary;
    pluginDataBriefSummary: PluginDataBriefSummary | undefined;
    pluginVotesSummary: PluginVotesSummary | undefined;
}

/**
 * Get plugins_voted from local storage.
 */
function getVoted(): RemovableRef<Record<string, boolean>> {
    return useLocalStorage<Record<string, boolean>>("plugins_voted", {});
}

export const usePluginsStore = defineStore("plugins", {
    state: (): PluginStoreState => ({
        pluginDataSummary: {},
        pluginDataBriefSummary: undefined,
        pluginVotesSummary: undefined,
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

        /**
         * Get plugin votes by id.
         */
        getPluginVotes(state): (id: string) => PluginVotes | undefined {
            return (id) => {
                if (state.pluginVotesSummary !== undefined && id in state.pluginVotesSummary) {
                    return state.pluginVotesSummary![id];
                } else {
                    return undefined;
                }
            };
        },

        /**
         * Check if the plugin is voted.
         */
        isVoted: (): (id: string) => boolean => {
            return (id) => {
                if (getVoted() !== undefined && id in getVoted().value) {
                    return getVoted().value[id];
                } else {
                    return false;
                }
            };
        },
    },
    actions: {
        async nuxtServerInit() {
            // check if already fetched
            if (this.pluginDataBriefSummary !== undefined && this.pluginVotesSummary !== undefined) {
                return;
            }

            // fetch data
            [
                this.pluginDataBriefSummary,
                this.pluginVotesSummary,
            ] = await Promise.all([
                $fetch("/api/pluginsBrief"),
                $fetch("/api/pluginsVotes"),
            ]);
        },

        /**
         * Update plugins votes from LeanCloud.
         */
        async updatePluginVotes() {
            this.pluginVotesSummary = await useLeanCloud().fetchVotes();

            for (const id in this.pluginDataBriefSummary) {
                this.pluginDataBriefSummary[id].votes = this.pluginVotesSummary[id]?.vote ?? 0;
            }
        },

        /**
         * Increase vote for a plugin.
         * This will auto save voted data to local storage.
         *
         * Do only call this function on client side.
         *
         * @param {string} id Plugin id.
         */
        async increaseVote(id: string): Promise<void> {
            // check if voted
            if (this.isVoted(id)) {
                throw new Error("You have already voted this plugin.");
            }

            // get votes
            let votes = this.getPluginVotes(id);
            if (votes === undefined) {
                // create votes
                votes = await useLeanCloud().createVotesRequest(id);
                this.pluginVotesSummary![id] = votes;
            }

            // increase votes
            await useLeanCloud().increaseVotesRequest(votes.objectId);
            this.pluginVotesSummary![id].vote += 1;
            this.pluginDataBriefSummary![id].votes += 1;
            getVoted().value[id] = true;
        },

        /**
         * Decrease vote for a plugin.
         * This will auto save voted data to local storage.
         *
         * Do only call this function on client side.
         *
         * @param {string} id Plugin id.
         */
        async decreaseVote(id: string): Promise<void> {
            // check if not voted
            if (!this.isVoted(id)) {
                throw new Error("You have not voted this plugin.");
            }

            // get votes
            const votes = this.getPluginVotes(id);
            if (votes === undefined) {
                throw new Error("Votes not found.");
            }

            // decrease votes
            await useLeanCloud().decreaseVotesRequest(votes.objectId);
            this.pluginVotesSummary![id].vote -= 1;
            this.pluginDataBriefSummary![id].votes -= 1;
            getVoted().value[id] = false;
        },
    },
});
