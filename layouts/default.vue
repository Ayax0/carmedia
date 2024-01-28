<script>
export default {
    name: "DefaultLayout",
    watch: {
        $route() {
            this.$socket.removeAllListeners();
        },
    },
};
</script>

<template>
    <div><slot /></div>
</template>

<style lang="scss">
body {
    margin: 0;
}
</style>
