import {MergedPluginDataSummary} from "~/types/plugins";

export default defineEventHandler(async (event) => {
    const mergedPluginDataSummary: MergedPluginDataSummary = await $fetch("/api/plugins");
    return mergedPluginDataSummary[event.context.params!.id];
});
