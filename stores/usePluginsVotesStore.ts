import {HTTPMethod} from "h3";
import {RemovableRef, useLocalStorage} from "@vueuse/core";

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
 * Get plugins_voted from localStorage.
 */
function getVoted(): RemovableRef<Record<string, boolean>> {
    return useLocalStorage<Record<string, boolean>>("plugins_voted", {});
}

interface PluginsVotesStoreState {
    votes: Record<string, Votes> | undefined;
}

/**
 * Vote data.
 * @interface Votes
 * @property {string} objectId Object id.
 * @property {string} id Plugin id.
 * @property {number} vote Vote number.
 */
export interface Votes {
    objectId: string;
    id: string;
    vote: number;
}

export const usePluginsVotesStore = defineStore("pluginsVotes", {
    state: (): PluginsVotesStoreState => ({
        votes: undefined,
    }),
    getters: {
        /**
         * Get votes by plugin id.
         */
        getVotes: (state): (id: string) => Votes | undefined => {
            return (id) => {
                if (state.votes !== undefined && id in state.votes) {
                    return state.votes[id];
                } else {
                    return undefined;
                }
            };
        },

        /**
         * Get vote number by id. Return 0 if not exists.
         */
        getVotesNumber(): (id: string) => number {
            return (id) => {
                const votes = this.getVotes(id);
                if (votes !== undefined) {
                    return votes.vote;
                } else {
                    return 0;
                }
            };
        },

        /**
         * Check if the plugin is voted.
         */
        isVoted: (): (id: string) => boolean => {
            return (id) => {
                if (getVoted() !== undefined && id in getVoted().value) {
                    return getVoted().value[id];
                } else {
                    return false;
                }
            };
        },
    },
    actions: {
        async nuxtServerInit() {
            // check if already fetched
            if (this.votes !== undefined) {
                return;
            }

            // fetch votes
            const votesResponse = await request("GET", "/classes/Plugins_Votes") as { results: Votes[] };
            this.votes = Object.fromEntries(votesResponse.results.map(vote => [vote.id, vote]));
        },

        /**
         * Create vote for a plugin in LeanCloud.
         * @param {string} id Plugin id.
         */
        async createVotesRequest(id: string): Promise<Votes> {
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
        },

        /**
         * Increase vote for a plugin in LeanCloud.
         * @param {string} objectId Object id.
         */
        async increaseVotesRequest(objectId: string): Promise<void> {
            await request(
                "PUT",
                `/classes/Plugins_Votes/${objectId}`,
                {vote: {"__op": "Increment", "amount": 1}}
            );
        },

        /**
         * Decrease vote for a plugin in LeanCloud.
         * @param {string} objectId Object id.
         */
        async decreaseVotesRequest(objectId: string): Promise<void> {
            await request(
                "PUT",
                `/classes/Plugins_Votes/${objectId}`,
                {vote: {"__op": "Decrement", "amount": 1}}
            );
        },

        /**
         * Increase vote for a plugin.
         * This will auto save voted data to localStorage.
         *
         * Do only call this function on client side.
         *
         * @param {string} id Plugin id.
         */
        async increaseVote(id: string): Promise<void> {
            // check if voted
            if (this.isVoted(id)) {
                throw new Error("You have already voted this plugin.");
            }

            // get votes
            let votes = this.getVotes(id);
            if (votes === undefined) {
                // create votes
                votes = await this.createVotesRequest(id);
                this.votes![id] = votes;
            }

            // increase votes
            await this.increaseVotesRequest(votes.objectId);
            this.votes![id].vote += 1;
            getVoted().value[id] = true;
        },

        /**
         * Decrease vote for a plugin.
         * This will auto save voted data to localStorage.
         *
         * Do only call this function on client side.
         *
         * @param {string} id Plugin id.
         */
        async decreaseVote(id: string): Promise<void> {
            // check if not voted
            if (!this.isVoted(id)) {
                throw new Error("You have not voted this plugin.");
            }

            // get votes
            const votes = this.getVotes(id);
            if (votes === undefined) {
                throw new Error("Votes not found.");
            }

            // decrease votes
            await this.decreaseVotesRequest(votes.objectId);
            this.votes![id].vote -= 1;
            getVoted().value[id] = false;
        },
    },
});
