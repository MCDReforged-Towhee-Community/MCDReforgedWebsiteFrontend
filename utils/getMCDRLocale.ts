import {PluginMetaDescription} from "~/stores/plugins";

export function getMCDRLocale(): keyof PluginMetaDescription{
    return useI18n().locale.value.replace("-", "_").toLowerCase();
}
