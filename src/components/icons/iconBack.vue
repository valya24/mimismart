<template>
    <div class="icon-back" :class="{on: isOn}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polygon class="fill-variable" points="14.3,18.7 7.6,12 14.3,5.3 15.7,6.7 10.4,12 15.7,17.3 "/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn']
}
</script>