<template>
    <div class="icon-duplicate" :class="{on: isOn}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polygon class="fill-const" points="13,3 13,5 17,5 17,19 13,19 13,21 19,21 19,3 "/>
            <path class="fill-variable" d="M21,19h-7V2L5,3v16H3c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1h2v0l9,1v-1h7c0.6,0,1-0.4,1-1C22,19.4,21.6,19,21,19z
                M7,4.8l5-0.6v15.5l-5-0.6V4.8z M11,11L11,11c0.6,0,1,0.4,1,1l0,0c0,0.6-0.4,1-1,1l0,0c-0.6,0-1-0.4-1-1l0,0C10,11.4,10.4,11,11,11z
                "/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn']
}
</script>