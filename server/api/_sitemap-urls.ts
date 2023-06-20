import {PluginDataBriefSummary} from "~/types/plugins";

export default defineCachedEventHandler(
  async () => {
    // fetch data
    const [
      plugins,
    ] = await Promise.all([
      $fetch("/api/pluginsBrief")
    ]) as [
      PluginDataBriefSummary,
    ];

    // return sitemap urls
    return [
      {
        loc: "/plugins",
        lastmod: new Date(),
      },
      ...Object.values(plugins).map(plugin => ({
        loc: `/plugins/${plugin.id}`,
        lastmod: plugin.updated_at,
      })),
    ];
  },
  {
    name: "sitemap-dynamic-urls",
    maxAge: process.dev ? 1 : 60,
  }
);
