import {MCDRLocale} from "~/types/plugins";

export function getMCDRLocale(): MCDRLocale {
    return useI18n().locale.value.replace("-", "_").toLowerCase() as MCDRLocale;
}
