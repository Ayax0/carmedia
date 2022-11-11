<script>
export default {
	name: "SwipeComponent",
	emits: ["tab", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "swipe"],
	data() {
		return {
			touchstartX: -1,
			touchstartY: -1,
			touchendX: -1,
			touchendY: -1,
			changeX: 0,
			changeY: 0,
			changeXP: 0,
			changeYP: 0,
		};
	},
	mounted() {
		this.$refs.swipe_component.addEventListener(
			"touchstart",
			(event) => {
				this.touchstartX = event.changedTouches[0].screenX;
				this.touchstartY = event.changedTouches[0].screenY;
				this.changeX = 0;
				this.changeY = 0;
				this.changeXP = 0;
				this.changeYP = 0;
			},
			false
		);

		this.$refs.swipe_component.addEventListener("touchmove", (event) => {
			this.changeX = event.changedTouches[0].screenX - this.touchstartX;
			this.changeY = event.changedTouches[0].screenY - this.touchstartY;
			var changeXP = Math.round((100 / window.innerWidth) * Math.abs(this.changeX)) * Math.sign(this.changeX);
			var changeYP = Math.round((100 / window.innerHeight) * Math.abs(this.changeY)) * Math.sign(this.changeY);
			if (changeXP > 100) changeXP = 100;
			if (changeXP < -100) changeXP = -100;
			if (changeYP > 100) changeYP = 100;
			if (changeYP < -100) changeYP = -100;
			this.$emit("swipe", {
				x: this.changeX,
				y: this.changeY,
				xP: this.changeXP,
				yP: this.changeYP,
				xPLast: changeXP - this.changeXP,
				yPLast: changeYP - this.changeYP,
			});
			this.changeXP = changeXP;
			this.changeYP = changeYP;
		});

		this.$refs.swipe_component.addEventListener(
			"touchend",
			(event) => {
				this.touchendX = event.changedTouches[0].screenX;
				this.touchendY = event.changedTouches[0].screenY;

				const deviationX = this.touchendX - this.touchstartX;
				const deviationY = this.touchendY - this.touchstartY;

				if (deviationX < 25 && deviationX > -25 && deviationY < 25 && deviationY > -25) {
					// Tab
					this.$emit("tab");
				} else if (deviationX < -100 && Math.abs(deviationY) < Math.abs(deviationX)) {
					// Swipe Left
					this.$emit("swipeLeft");
				} else if (deviationX > 100 && Math.abs(deviationY) < Math.abs(deviationX)) {
					// Swipe Right
					this.$emit("swipeRight");
				} else if (deviationY < 50 && Math.abs(deviationY) > Math.abs(deviationX)) {
					// Swipe Up
					this.$emit("swipeUp");
				} else if (deviationY > -50 && Math.abs(deviationY) > Math.abs(deviationX)) {
					// Swipe Down
					this.$emit("swipeDown");
				}
			},
			false
		);
	},
};
</script>

<template>
  <div ref="swipe_component" class="swipe_component" />
</template>

<style lang="scss" scoped>
.swipe_component {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
}
</style>
