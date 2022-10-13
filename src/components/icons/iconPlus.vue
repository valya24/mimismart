<template>
    <div class="icon-plus" :class="{on: isOn}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polygon class="fill-variable" points="20,11 13,11 13,4 11,4 11,11 4,11 4,13 11,13 11,20 13,20 13,13 20,13 "/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn']
}
</script>