import {HTTPMethod} from "h3";

export function fetchData(method: HTTPMethod, url: string, data: object = {}) {
    return $fetch(`${useRuntimeConfig().public.leanCloud.serverURL}/1.1${url}`, {
        method,
        headers: {
            "X-LC-Id": useRuntimeConfig().public.leanCloud.appId,
            "X-LC-Key": useRuntimeConfig().public.leanCloud.appKey,
            "Content-Type": "application/json"
        },
        body: method === "POST" || method === "PUT" ? JSON.stringify(data) : undefined,
        query: method === "GET" ? data : {},
    });
}

/**
 * Vote data.
 * @interface Vote
 * @property {string} objectId Object id.
 * @property {string} id Plugin id.
 * @property {number} vote Vote number.
 */
export interface Vote {
    objectId: string,
    id: string
    vote: number,
}

/**
 * Vote data in object which key is plugin id.
 * @interface VotesData
 * @property {number} [key] Plugin id with vote number.
 */
export interface VotesData {
    [key: string]: Vote
}

/**
 * Fetch votes from LeanCloud.
 * @returns {Promise<VotesData>} Votes data.
 */
export async function fetchVotes(id?: string): Promise<VotesData> {
    interface fetchVotesResponse {
        results: Vote[]
    }

    // query
    let query = {};
    if (id !== undefined) {
        query = {where: {id: id}};
    }

    // fetch
    const votes: fetchVotesResponse = await fetchData(
        "GET",
        "/classes/Plugins_Votes",
        query
    ) as fetchVotesResponse;

    // parse and return
    return Object.fromEntries(votes.results.map(vote => [vote.id, vote]));
}

/**
 * Create vote for a plugin in LeanCloud.
 * @param {string} id Plugin id.
 */
export async function createVote(id: string): Promise<Vote> {
    interface CreateVoteResponse {
        objectId: string
    }

    const response: CreateVoteResponse = await fetchData(
        "POST",
        "/classes/Plugins_Votes",
        {id}
    ) as CreateVoteResponse;
    return {
        id: id,
        vote: 0,
        ...response
    }
}

/**
 * Increase vote for a plugin in LeanCloud.
 * @param {string} objectId Object id.
 */
export async function increaseVote(objectId: string): Promise<void> {
    await fetchData(
        "PUT",
        `/classes/Plugins_Votes/${objectId}`,
        {vote: {"__op": "Increment", "amount": 1}}
    );
}
