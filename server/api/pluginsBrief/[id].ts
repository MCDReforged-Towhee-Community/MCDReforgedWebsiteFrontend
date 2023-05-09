import {PluginDataBriefSummary} from "~/types/plugins";

export default defineEventHandler(async (event) => {
  const pluginDataBriefSummary: PluginDataBriefSummary = await $fetch("/api/pluginsBrief");
  const id = event.context.params!.id;
  if (id in pluginDataBriefSummary) {
    return pluginDataBriefSummary[id];
  } else {
    return {};
  }
});
