import {
  PluginData,
  PluginDataBrief,
} from "~/types/plugins";

export class MCDRPlugin {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  get pluginBrief(): PluginDataBrief {
    return usePluginsStore().getPluginDataBrief(this.id) as PluginDataBrief;
  }

  async pluginData(): Promise<PluginData> {
    return await usePluginsStore().getPluginData(this.id) as PluginData;
  }

  async downloadLatest(newTab: boolean = false) {
    const pluginData = await this.pluginData();
    if (pluginData.release.releases.length === 0 || pluginData.release.releases[0].assets.length === 0) {
      throw new Error("No release found");
    } else {
      const downloadUrl = pluginData.release.releases[0].assets[0].browser_download_url;
      if (newTab) {
        window.open(downloadUrl, "_blank");
      } else {
        const downloadElement = document.createElement("a");
        downloadElement.style.display = "none";
        downloadElement.href = downloadUrl;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        downloadElement.remove();
      }
    }
  }
}
