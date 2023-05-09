export default defineEventHandler(async (event) => {
  // read arguments
  const {method, url, data} = await readBody(event);

  // fetch to LeanCloud
  const leanCloudConfig = useRuntimeConfig().public.leanCloud;
  return await $fetch(`${leanCloudConfig.serverURL}/1.1${url}`, {
    method,
    headers: {
      "X-LC-Id": leanCloudConfig.appId,
      "X-LC-Key": leanCloudConfig.appKey,
      "Content-Type": "application/json"
    },
    body: method === "POST" || method === "PUT" ? data : undefined,
    query: method === "GET" ? data : {},
  });
});
