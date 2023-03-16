import {PluginDataSummary} from "~/types/plugins";

export default defineEventHandler(async (event) => {
    const mergedPluginDataSummary: PluginDataSummary = await $fetch("/api/plugins");
    const id = event.context.params!.id;
    if (id in mergedPluginDataSummary) {
        return mergedPluginDataSummary[id];
    } else {
        return {};
    }
});
