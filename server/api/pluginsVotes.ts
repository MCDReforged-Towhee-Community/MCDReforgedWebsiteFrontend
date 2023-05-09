import {PluginVotesSummary} from "~/types/plugins";
import {useLeanCloud} from "~/composables/useLeanCloud";

export default defineCachedEventHandler(
  async (): Promise<PluginVotesSummary> => await useLeanCloud().fetchVotes(),
  {
    name: "pluginsVotes",
    maxAge: 60 * 10,
  }
);
