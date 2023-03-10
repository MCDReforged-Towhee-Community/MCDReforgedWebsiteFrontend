import {PluginMetaDescription} from "~/types/plugins";

export function getMCDRLocale(): keyof PluginMetaDescription{
    return useI18n().locale.value.replace("-", "_").toLowerCase() as keyof PluginMetaDescription;
}
