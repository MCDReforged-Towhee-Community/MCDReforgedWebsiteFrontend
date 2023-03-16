import {PluginDataSummary} from "~/types/plugins";

export default defineEventHandler(async (event) => {
    const mergedPluginDataSummary: PluginDataSummary = await $fetch("/api/plugins");
    return mergedPluginDataSummary[event.context.params!.id];
});
