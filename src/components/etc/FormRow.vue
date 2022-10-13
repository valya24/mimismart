<template>
    <div class="form-row">
        <div class="col-label"><slot name="label" />{{ label }}</div>
        <div class="col-control">
            <slot />
        </div>
        <div class="hint">
            <slot name="hint" />
        </div>
    </div>
</template>

<script>
export default {
    props: ['label'],
}
</script>

<style lang="less" scoped>
.theme-dark {
    .form-row .col-label {
        color: rgba(255,255,255,0.7);
    }
}

.form-row {
    display: grid;
    grid-template-columns: 90px 1fr;
    align-items: center;
    margin-top: 16px;
    column-gap: 16px;
    &.gap8 {column-gap: 8px;}
    .col-label {
        font-size: 14px;
        color: #555;
    }
}
.hint {grid-column-start:2;}
.controls-right .col-control {
    display: flex;
    justify-content: flex-end;
}
</style>