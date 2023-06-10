import {PluginVotesSummary} from "~/types/plugins";
import {useBackend} from "~/composables/useBackend";

export default defineCachedEventHandler(
  async (): Promise<PluginVotesSummary> => await useBackend().fetchVotes(),
  {
    name: "pluginsVotes",
    maxAge: 60 * 10,
  }
);
