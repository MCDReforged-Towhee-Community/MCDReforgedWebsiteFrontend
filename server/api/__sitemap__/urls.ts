import {type PluginDataBriefSummary} from "~/types/plugins";

export default defineSitemapEventHandler(async () => {
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
      lastmod: plugin.updated_at ?? new Date(),
    })),
  ];
});
