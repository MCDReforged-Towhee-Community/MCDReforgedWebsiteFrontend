import {HTTPMethod} from "h3";
import {PluginVotesSummary} from "~/types/plugins";

export const useBackend = () => {
  /**
   * Request to Backend.
   * @param method HTTP method.
   * @param url URL.
   * @param data Data.
   */
  async function request(method: HTTPMethod, url: string, data: object = {}) {
    return await $fetch(useRuntimeConfig().public.api.url + url, {
      method: method,
      headers: {
        "Authorization": useRuntimeConfig().public.api.authorization,
      },
      body: method === "PUT" ? data : undefined,
    });
  }

  /**
   * Fetch votes.
   * @returns {Promise<PluginVotesSummary>} PluginVotesSummary.
   */
  async function fetchVotes(): Promise<PluginVotesSummary> {
    return await request("GET", "") as PluginVotesSummary;
  }

  /**
   * Create vote for a plugin.
   * @param {string} id Plugin id.
   */
  async function createVotesRequest(id: string): Promise<void> {
    await request("POST", `/${id}`);
  }

  /**
   * Increase vote for a plugin.
   * @param {string} id Plugin id.
   */
  async function increaseVotesRequest(id: string): Promise<void> {
    await request("PUT", `/${id}`, {operation: "increase"});
  }

  /**
   * Decrease vote for a plugin.
   * @param {string} id Plugin id.
   */
  async function decreaseVotesRequest(id: string): Promise<void> {
    await request("PUT", `/${id}`, {operation: "decrease"});
  }

  // return
  return {
    fetchVotes,
    createVotesRequest,
    increaseVotesRequest,
    decreaseVotesRequest,
  };
};
