import {useLocalStorage} from "@vueuse/core";

export const useLocalStoragePlugins = () => {
    const voted: Ref<{ [key: string]: boolean }> = useLocalStorage("plugins_voted", {});

    function isVoted(id: string): boolean {
        if (id in voted.value) {
            return voted.value[id];
        } else {
            return false;
        }
    }

    function setVoted(id: string, value: boolean) {
        voted.value[id] = value;
    }

    return {
        isVoted,
        setVoted,
    };
};
