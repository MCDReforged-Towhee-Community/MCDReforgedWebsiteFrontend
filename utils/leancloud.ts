import {HTTPMethod} from "h3";

export function fetchData(method: HTTPMethod, url: string, data: object = {}) {
    return $fetch(`${useRuntimeConfig().public.leanCloud.serverURL}/1.1${url}`, {
        method,
        headers: {
            "X-LC-Id": useRuntimeConfig().public.leanCloud.appId,
            "X-LC-Key": useRuntimeConfig().public.leanCloud.appKey,
            "Content-Type": "application/json"
        },
    });
}

/**
 * Vote data.
 * @interface VotesData
 * @property {number} [key] Plugin id with vote number.
 */
export interface VotesData {
    [key: string]: number
}

/**
 * Fetch votes from LeanCloud.
 * @returns {Promise<VotesData>} Votes data.
 */
export async function fetchVotes(): Promise<VotesData> {
    interface VotesFetched {
        results: {
            id: string,
            vote: number
        }[]
    }

    const votes: VotesFetched = await fetchData("GET", "/classes/Plugins_Votes") as VotesFetched;
    let result: VotesData = {}

    for (let vote of votes.results) {
        result[vote.id] = vote.vote;
    }

    return result;
}
