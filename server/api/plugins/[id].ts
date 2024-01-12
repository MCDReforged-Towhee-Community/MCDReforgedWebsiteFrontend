import {type PluginDataSummary} from "~/types/plugins";

export default defineEventHandler(async (event) => {
  const pluginDataSummary: PluginDataSummary = await $fetch("/api/plugins");
  const id = event.context.params!.id;
  if (id in pluginDataSummary) {
    return pluginDataSummary[id];
  } else {
    return {};
  }
});
