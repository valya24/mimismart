<template>
    <div class="icon-minus" :class="{on: isOn}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect class="fill-variable" x="4" y="11" width="16" height="2" fill="black"/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn']
}
</script>