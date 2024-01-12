import {type PluginVotesSummary} from "~/types/plugins";
import {useBackend} from "~/composables/useBackend";

export default defineEventHandler(
  async (): Promise<PluginVotesSummary> => await useBackend().fetchVotes()
);
