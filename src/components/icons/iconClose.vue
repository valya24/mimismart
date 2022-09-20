<template>
    <div class="icon-close" :class="{on: isOn}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polygon points="17.3,18.7 12,13.4 6.7,18.7 5.3,17.3 10.6,12 5.3,6.7 6.7,5.3 12,10.6 17.3,5.3 18.7,6.7 13.4,12 18.7,17.3 "/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn']
}
</script>