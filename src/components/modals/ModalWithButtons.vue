<template>
    <div class="modal-with-buttons">
        <div class="overlay" @click="$emit('hide')"></div>
        <div class="modal-contents">
            <div class="modal-head">
				<BtnIcon icon="icon-close" @click.native="$emit('hide')" />
				<div class="modal-title">{{ title }}</div>
			</div>
            <div class="modal-body">
                <slot name="body" />
            </div>
            <div class="modal-footer" :class="{single: $slots.footer.length < 2}">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: 'Title not provided'
        }
    }
}
</script>

<style lang="less" scoped>
.modal-with-buttons {
    width: 100vw;
    position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
    z-index: 101;
    transition: .25s;
}
.modal-contents {
    background: #fff;
    position: relative;
    z-index: 1;
    border-radius: @modalRadius;
    width: 300px;
    transition: .25s;
}
.modal-body {
    padding: 0 24px 16px;
    overflow: auto;
    max-height: 320px;
}
.modal-head {
    display: grid;
    grid-template-columns: @btnHeight 1fr @btnHeight;
    align-items: center;
    text-align: center;
}
.modal-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-top: 1px solid #E6E6E6;
    background: #E6E6E6;
    border-radius: 0 0 @modalRadius @modalRadius;
    &.single {
        grid-template-columns: 1fr;
        .button {border-radius: 0 0 @modalRadius @modalRadius !important;}
    }
    & > .button {
        text-align: center;
        margin-left: 1px;
        background: #fff;
        border: 0;
        border-radius: 0;
        box-shadow: none;
        &:first-child {
            border-radius: 0 0 0 @modalRadius;
            margin-left: 0;
        }
        &:last-child {border-radius: 0 0 @modalRadius 0;}
    }
}

@transitionLength: 0.25s;

.overlay {
    transition: @transitionLength;
}
.fade-in-enter-active,
.fade-in-leave-active {	
  transition: @transitionLength;
}
.fade-in-enter .modal-contents,
.fade-in-leave-to .modal-contents {
	transform: scale(0.8);
	opacity: 0;
}
.fade-in-enter .overlay,
.fade-in-leave-to .overlay {
  opacity: 0;
}
</style>