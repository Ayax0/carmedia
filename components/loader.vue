<script>
export default {
    name: "LoaderComponent",
    props: {
        color: { type: String, default: "white" },
        size: { type: String, default: "40px" },
        weight: { type: String, default: "4px" },
    }
}
</script>

<template>
    <div class="lds-dual-ring" :style="{ '--loader-color': color, '--loader-size': size, '--loader-weight': weight }"></div>
</template>

<style lang="scss" scoped>
.lds-dual-ring {
  display: inline-block;
  width: var(--loader-size);
  height: var(--loader-size);
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: calc(var(--loader-size) - calc(2 * var(--loader-weight)));
  height: calc(var(--loader-size) - calc(2 * var(--loader-weight)));
  border-radius: 50%;
  border: var(--loader-weight) solid var(--loader-color);
  border-color: var(--loader-color) transparent var(--loader-color) transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>