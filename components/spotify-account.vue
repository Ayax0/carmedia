<script>
export default {
    name: "SpotifyAccountComponent",
    props: {
        account: { type: Object, required: true },
    },
};
</script>

<template>
    <div v-ripple class="account">
        <img v-if="account.images[0]" :src="account.images[0]?.url" />
        <p v-else>{{ account.display_name.charAt(0) }}</p>
        <span>{{ account.display_name }}</span>
    </div>
</template>

<style lang="scss" scoped>
.account:first-child {
    margin-left: auto;
}

.account:last-child {
    margin-right: auto;
}

.account {
    position: relative;
    width: 10rem;
    min-width: 10rem;
    height: 10rem;
    border-radius: 5rem;
    box-shadow: $shadow;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    p {
        font-size: 100px;
        font-weight: 100;
    }

    span {
        position: absolute;
        top: calc(100% + 1rem);
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 20px;
        color: #ccc;
    }
}
</style>
