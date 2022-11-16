<template>
	<div class="header" :class="isIos ? 'ios-style' : ''">
		<slot>{{ title }}</slot>
	</div>
</template>

<script>
import {isPlatform} from "@ionic/vue";

export default {
	props: ['title'],
  data: () => ({
    isIos: null
  }),
  created() {
    this.isIos = isPlatform('ios')
  }
}
</script>
<style lang="less" scoped>
.router-link-active,
.header__link.--active {
	color: @colorMain !important;
	font-weight: bold;
}
.room-settings {
	position: absolute;
	right: 0;
}
.overlay {
	background: red;
	width: 100px;
	position: absolute;
	right: 0;
	height: 100%;
	background: linear-gradient(270deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
}
.ios-style {
  height: 75px;
  //top: 28px!important;

  a {
    margin-top: 30px;
  }
}
.header {
	position: fixed;
	z-index: 100;
	left: 0;
	right: 0;
	top: 0;
	background: #fff;
	display: flex;
	align-items: center;
	min-height: @headerHeight;
	padding-left: 14px;
	// text-transform: uppercase;
	padding-right: 14px;
	font-size: 16px;
	font-weight: bold;
	color: @colorPaleBlue;
	box-shadow: 0px -1px 14px rgba(46, 101, 156, 0.11);
	a, &__link {
		text-decoration: none;
		margin-right: 16px;
		color: #C4C4C4;
		font-size: 1.15em;
	}
}
.theme-dark {
	.header__title::before, .header {
		background: @colorBgDark300;
	}
	.header {
		a {color: @headerText;}
	}
}

@media (min-width: @phones) {
	.header {
		left: @sidebarWidth;
		display: none;
		a,
		&__link {
			display: none;
			&.--active,
			&.router-link-active {
				display: block;
				margin-left: auto;
				margin-right: auto;
			}
		}
	}
}
</style>