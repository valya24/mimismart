<template>
    <div class="modal-dropdown-list">
        <div class="overlay" @click="$emit('hide')"></div>
        <div class="modal-control-contents-centered">
            <div class="modal-head hbox alic just-sb">
				<BtnIcon icon="icon-close" @click.native="$emit('hide')" />
				<div class="device-name">Режим</div>
                <div class="col-empty"></div>
			</div>
            <div class="modal-body">
                <slot />
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@transitionLength: 0.25s;

.modal-control-contents-centered {
    display: flex;
    flex-direction: column;
    height: auto;
    max-height: 404px;
}
.modal-body {
    overflow: auto;
    padding-top: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
}
.list-item {
    font-size: 20px;
    height: @btnHeight;
    display: flex;
    align-items: center;
    padding: 0 16px;
    flex-shrink: 0;
    &:active {background: @colorBtnActive;}
    .col-icon {margin-right: 16px;}
    .col-check {margin-left: auto;}
}
.col-empty {
    width: @btnHeight;
}
.modal-dropdown-list {
	user-select: none;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 101;
}
.overlay {
    cursor: pointer;
}
</style>