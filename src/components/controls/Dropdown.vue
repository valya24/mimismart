<template>
	<div class="dropdown">
		<img class="caret" src="@/assets/caret.svg" alt />
		<select ref="select"
			:value="value"
			@change="e => $emit('change', e.target.value)"
		>
			<slot />
		</select>
	</div>
</template>

<script>
export default {
	props: ['value'],
	model: {
		prop: 'value',
		event: 'change'
	},
	methods: {
		updateSelected() {
			Array.from(this.$refs.select.childNodes)
				.forEach( item => {
					if (this.value == item.value) item.selected = true;
				})
		}
	},
	mounted() {
		this.$nextTick(function() {
			this.updateSelected();
		})
	},
	updated() {
		this.$nextTick(function() {
			this.updateSelected();
		})
	}
};
</script>

<style lang="less" scoped>

.theme-dark {
    .dropdown {
        background: @colorBgDark200;
        select {color: @headerText;}
        &.big {
            border-color: @colorMainDark;
            select {
                color: @headerText;
            }
        }
    }
}

.dropdown {
    display: flex;
    border: 1px solid rgba(0, 0, 0, 0.07);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.04);
    border-radius: 100px;
    height: @btnSmallHeight;
    position: relative;
    z-index: 1;
    padding-left: 2px;
    background: #fff;
    select {
        font-family: @fontMain;
        font-size: 12px;
        background: none;
        border: 0;
        -webkit-appearance: none;
        -moz-appearance: none;
        padding: 0 8px;
        padding-right: 28px;
        width: 100%;
        outline: none;
        margin-top: -1px;
    }
    .caret {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
    }
    &.big {
        border-color: @colorMain;
        height: @btnHeight;
        display: flex;
        align-items: center;
        border-radius: 4px;
        select {
            font-size: 16px;
            color: #666;
            display: block;
            width: 100%;
            height: 40px;
            padding-right: 28px;
        }
    }
    &.flat {
        border: 0;
        box-shadow: none;
        background: none;
        border-radius: 0;
        .caret {margin-top: 1px;}
        select {
            font-size: inherit;
            padding-left: 0;
        }

    }
}
</style>