export default defineEventHandler(async (event) => {
    return (await $fetch("/api/plugins"))[event.context.params!.id];
});
