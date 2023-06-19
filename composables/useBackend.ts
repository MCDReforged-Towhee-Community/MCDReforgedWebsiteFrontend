import {HTTPMethod} from "h3";
import {PluginVotesSummary} from "~/types/plugins";

export const useBackend = () => {
  /**
   * Request to Backend.
   * @param method HTTP method.
   * @param path Path.
   * @param data Data.
   */
  async function request(method: HTTPMethod, path: string, data: object = {}) {
    try {
      return await $fetch(useRuntimeConfig().public.backend.url + path, {
        method: method,
        headers: {
          "Authorization": useRuntimeConfig().public.backend.authorization,
        },
        body: method === "PUT" ? data : undefined,
      });
    } catch (e) {
      console.error(e);
      return {};
    }
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
