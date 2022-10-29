<script>
import store from "store-js";
import SpotifyAPI from "@/api/spotify";

export default {
    name: "SpotifySettingsPage",
    data() {
        return {
            client_id: null,
            client_secret: null,
            accounts: [],
        };
    },
    computed: {
        scope() {
            return [
                "user-modify-playback-state",
                "user-read-playback-position",
                "user-read-playback-state",
                "user-read-currently-playing",
                "playlist-read-private",
                "playlist-read-collaborative",
                "streaming",
                "user-read-email",
                "user-read-private",
                "user-library-read",
            ];
        },
        redirect_uri() {
            return window.location.origin + window.location.pathname;
        },
    },
    watch: {
        client_id(value) {
            store.set("spotify.client_id", value);
        },
        client_secret(value) {
            store.set("spotify.client_secret", value);
        },
    },
    methods: {
        login() {
            if (!this.client_id || !this.client_secret) return;

            window.location.href =
                "https://accounts.spotify.com/authorize?" +
                new URLSearchParams({
                    response_type: "code",
                    client_id: this.client_id,
                    scope: this.scope.join(" "),
                    redirect_uri: this.redirect_uri,
                    show_dialog: true,
                }).toString();
        },
        async exchange(code) {
            const spotify_api = new SpotifyAPI(this.client_id, this.client_secret);
            try {
                const exchange = await spotify_api.exchange(code, this.redirect_uri);
                const account = await spotify_api.instance.get("/me");

                this.accounts = this.accounts.filter((_account) => _account.id != account.data.id);

                this.accounts.push({
                    ...account.data,
                    refresh_token: exchange.refresh_token,
                });

                store.set("spotify.accounts", this.accounts);
                navigateTo(window.location.pathname);
            } catch (error) {
                console.error(error);
            }
        },
    },
    mounted() {
        this.client_id = store.get("spotify.client_id");
        this.client_secret = store.get("spotify.client_secret");
        this.accounts = store.get("spotify.accounts") || [];

        if (this.$route.query.code) this.exchange(this.$route.query.code);
    },
};
</script>

<template>
    <div class="main">
        <vtextfield v-model="client_id" title="Client ID" />
        <vtextfield v-model="client_secret" title="Client Secret" />
        <div class="title">Verbundene Accounts</div>
        <div class="account" v-for="account in accounts">
            <img v-if="account.images[0]" :src="account.images[0]?.url" />
            <div v-else class="avatar">{{ account.display_name.charAt(0) }}</div>
            <div class="info">
                <div class="name">{{ account.display_name }}</div>
                <div class="follower">{{ account.followers.total || 0 }} Follower</div>
            </div>
        </div>
        <div class="add-account" @click="login">Account hinzufügen</div>
    </div>
</template>

<style lang="scss" scoped>
.main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: hidden;
    overflow-y: auto;
    padding: 2rem 2rem 5rem 2rem;

    .title {
        margin-top: 2rem;
    }

    .account {
        display: flex;
        gap: 1rem;
        align-items: center;
        box-shadow: $shadow;
        padding: 0.5rem;

        img,
        .avatar {
            width: 4rem;
            height: 4rem;
            border-radius: 2rem;
            box-shadow: $shadow;
        }

        .avatar {
            background: rgb(40, 40, 40);
            color: rgb(100, 100, 100);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 42px;
            text-transform: uppercase;
        }

        .info {
            .name {
                font-size: 20px;
            }

            .follower {
                font-weight: 100;
                font-size: 12px;
            }
        }
    }

    .add-account {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        padding: 1rem;
        box-shadow: $shadow;
        font-weight: 300;
        font-size: 14px;
    }
}
</style>
