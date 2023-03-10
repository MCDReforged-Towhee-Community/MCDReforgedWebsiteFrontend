type MCDRLocale = "en_us" | "zh_cn";

export function getMCDRLocale(): MCDRLocale {
    return useI18n().locale.value.replace("-", "_").toLowerCase() as MCDRLocale;
}
