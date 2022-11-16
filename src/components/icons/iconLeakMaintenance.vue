<template>
	<div class="icon-leak-maintenance" :class="{on: isOn, '--ignoring': ignoring}">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.5" d="M20.5 15H3.5L4 17L6.5 18.5L9.5 20.5H13L16 19.5L19 17.5L20.5 15Z" fill="white"/>
      <path d="M12 6.9551L14.3759 10.9466C15.1092 12.1786 14.7791 13.7668 13.6155 14.6046C12.6506 15.2994 11.3494 15.2994 10.3845 14.6046L9.80015 15.4161L10.3845 14.6046C9.22089 13.7668 8.89078 12.1786 9.62413 10.9466L12 6.9551Z" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="9" stroke="white" stroke-width="2"/>
    </svg>

	</div>
</template>

<script>
export default {
	props: ['isOn', 'ignoring']
}
</script>

<style lang="less" scoped>
.--ignoring {
	.fill-const {
		fill: #F2B27C;
	}
	.fill-variable {
		fill: #ED7A5C;
	}
}
</style>