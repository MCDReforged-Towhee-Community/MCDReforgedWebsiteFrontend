import {type MCDRLocale} from "~/types/plugins";

export function getMCDRLocale(locale: string): MCDRLocale {
  return locale.replace("-", "_").toLowerCase() as MCDRLocale;
}
