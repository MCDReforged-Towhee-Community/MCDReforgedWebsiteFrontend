import {
  type PluginDataSummary,
  type PluginData,
  type PluginDataBriefSummary,
  type PluginDataBrief,
  type PluginVotesSummary,
  type SearchSetting,
} from "~/types/plugins"
import {useBackend} from "~/composables/useBackend";
import {type RemovableRef, useLocalStorage} from "@vueuse/core";

interface PluginStoreState {
  pluginDataSummary: PluginDataSummary;
  pluginDataBriefSummary: PluginDataBriefSummary | undefined;
  pluginVotesSummary: PluginVotesSummary | undefined;
  searchSetting: SearchSetting;
  selectedPlugins: string[];
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
    searchSetting: {
      name: "",
      author: "",
      labels: [],
      sorting: "votes",
      reverse: false,
      selected: false,
    },
    selectedPlugins: [],
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
    getPluginVotes(state): (id: string) => number | undefined {
      return (id) => {
        if (state.pluginVotesSummary !== undefined && id in state.pluginVotesSummary) {
          return state.pluginVotesSummary[id];
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

      // update votes in brief
      for (const id in this.pluginDataBriefSummary) {
        this.pluginDataBriefSummary[id].votes = this.pluginVotesSummary[id] ?? 0;
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
      const votes = this.getPluginVotes(id);
      if (votes === undefined) {
        // create votes
        await useBackend().createVotesRequest(id);
        this.pluginVotesSummary![id] = 0;
      }

      // increase votes
      await useBackend().increaseVotesRequest(id);
      this.pluginVotesSummary![id] += 1;
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
      await useBackend().decreaseVotesRequest(id);
      this.pluginVotesSummary![id] -= 1;
      this.pluginDataBriefSummary![id].votes -= 1;
      getVoted().value[id] = false;
    },

    /**
     * Set search setting.
     * @param {SearchSetting} setting Search setting.
     */
    setSearchSetting(setting: SearchSetting): void {
      this.searchSetting = setting;
    },

    /**
     * Set selected plugins.
     * @param {string[]} plugins Selected plugins.
     */
    setSelectedPlugins(plugins: string[]): void {
      this.selectedPlugins = plugins;
    }
  },
});
