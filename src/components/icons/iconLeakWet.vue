<template>
	<div class="icon-close" :class="{on: isOn}">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.7" d="M20.5 15H3.5L4 17L6.5 18.5L9.5 20.5H13L16 19.5L19 17.5L20.5 15Z" fill="#FF8C4D"/>
      <circle cx="12" cy="12" r="9" stroke="#FF7253" stroke-width="2"/>
      <rect x="11" y="5" width="2" height="6" fill="#FF7253"/>
      <rect x="11" y="12" width="2" height="2" fill="#FF7253"/>
    </svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>

<style lang="less" scoped>
.leak-sign {
	.fill-variable {fill: #F56363}
	.fill-const {fill: #F6ADAD}
}
</style>