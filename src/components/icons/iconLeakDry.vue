<template>
    <div class="icon-close" :class="{on: isOn}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path class="fill-const" d="M20.5,15h-17L4,17l2.5,1.5l3,2H13l3-1l3-2L20.5,15z"/>
            <path class="fill-variable" d="M12,22C6.5,22,2,17.5,2,12S6.5,2,12,2c5.5,0,10,4.5,10,10S17.5,22,12,22z M12,4c-4.4,0-8,3.6-8,8
                c0,4.4,3.6,8,8,8s8-3.6,8-8C20,7.6,16.4,4,12,4z M16.2,7.7l-1.5-1.3l-3.9,4.3L9.1,9.2l-1.2,1.6l3.2,2.6L16.2,7.7z"/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn']
}
</script>