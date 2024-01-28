<script lang="ts" setup>
import Setting from "@/framework/Setting";
import SpotifyAPI from "@/api/spotify";

const route = useRoute();

const client_id = new Setting("spotify.client_id");
const client_secret = new Setting("spotify.client_secret");
const accounts = new Setting<Array<any>>("spotify.accounts", []);

const scope = [
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
var redirect_uri;

function login() {
    if (!client_id.value || !client_secret.value) return;

    navigateTo(
        "https://accounts.spotify.com/authorize?" +
            new URLSearchParams({
                response_type: "code",
                client_id: client_id.value,
                scope: scope.join(" "),
                redirect_uri: redirect_uri,
                show_dialog: "true",
            }).toString(),
        { external: true }
    );
}
function logout(account) {
    accounts.value = accounts.value.filter((a) => a.id != account.id);
    navigateTo(route.path);
}
async function exchange(code) {
    const spotify_api = new SpotifyAPI(client_id.value, client_secret.value);
    try {
        const exchange = await spotify_api.exchange(code, redirect_uri);
        const account = await spotify_api.instance.get("/me");

        const local_accounts = accounts.value.filter((a) => a.id != account.data.id);
        local_accounts.push({ ...account.data, refresh_token: exchange.refresh_token });
        accounts.value = local_accounts;

        navigateTo(route.path);
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    redirect_uri = window.location.origin + window.location.pathname;
    if (route.query.code) exchange(route.query.code);
});
</script>

<template>
    <div class="main">
        <vtextfield v-model="client_id.value" title="Client ID" />
        <vtextfield v-model="client_secret.value" title="Client Secret" />
        <div class="title">Verbundene Accounts</div>
        <div class="account" v-for="account in accounts.value">
            <img v-if="account.images[0]" :src="account.images[0]?.url" />
            <div v-else class="avatar">{{ account.display_name.charAt(0) }}</div>
            <div class="info">
                <div class="name">{{ account.display_name }}</div>
                <div class="follower">{{ account.followers.total || 0 }} Follower</div>
            </div>
            <div class="action">
                <vbutton @click="logout(account)" icon="mdi:logout" iconSize="1.5rem" width="4rem" height="4rem" />
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
            flex: 1;
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
