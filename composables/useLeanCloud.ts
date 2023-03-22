import {HTTPMethod} from "h3";
import {PluginVotesSummary, PluginVotes} from "~/types/plugins";

export const useLeanCloud = () => {
    /**
     * Request to LeanCloud.
     * @param method HTTP method.
     * @param url URL.
     * @param data Data.
     */
    function request(method: HTTPMethod, url: string, data: object = {}) {
        const leanCloudConfig = useRuntimeConfig().public.leanCloud;
        return $fetch(`${leanCloudConfig.serverURL}/1.1${url}`, {
            method,
            headers: {
                "X-LC-Id": leanCloudConfig.appId,
                "X-LC-Key": leanCloudConfig.appKey,
                "Content-Type": "application/json"
            },
            body: method === "POST" || method === "PUT" ? data : undefined,
            query: method === "GET" ? data : {},
        });
    }

    /**
     * Fetch votes from LeanCloud.
     * @returns {Promise<PluginVotesSummary>} PluginsVotes.
     */
    async function fetchVotes(): Promise<PluginVotesSummary> {
        const votesResponse = await useLeanCloud().request("GET", "/classes/Plugins_Votes") as { results: PluginVotes[] };
        return Object.fromEntries(votesResponse.results.map(vote => [vote.id, vote]));
    }

    /**
     * Create vote for a plugin in LeanCloud.
     * @param {string} id Plugin id.
     * @returns {Promise<PluginVotes>} PluginVotes.
     */
    async function createVotesRequest(id: string): Promise<PluginVotes> {
        // create votes
        const {objectId} = await request(
            "POST",
            "/classes/Plugins_Votes",
            {id}
        ) as { objectId: string };

        // return votes
        return {
            id: id,
            vote: 0,
            objectId
        };
    }

    /**
     * Increase vote for a plugin in LeanCloud.
     * @param {string} objectId Object id.
     * @returns {Promise<void>}
     */
    async function increaseVotesRequest(objectId: string): Promise<void> {
        await request(
            "PUT",
            `/classes/Plugins_Votes/${objectId}`,
            {vote: {"__op": "Increment", "amount": 1}}
        );
    }

    /**
     * Decrease vote for a plugin in LeanCloud.
     * @param {string} objectId Object id.
     * @returns {Promise<void>}
     */
    async function decreaseVotesRequest(objectId: string): Promise<void> {
        await request(
            "PUT",
            `/classes/Plugins_Votes/${objectId}`,
            {vote: {"__op": "Decrement", "amount": 1}}
        );
    }

    // return
    return {
        request,
        fetchVotes,
        createVotesRequest,
        increaseVotesRequest,
        decreaseVotesRequest,
    };
};
