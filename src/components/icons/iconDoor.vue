<template>
    <div class="icon-duplicate" :class="{on: isOn}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path class="fill-variable" d="M21,20h-2V4c0-0.6-0.4-1-1-1H6C5.4,3,5,3.4,5,4v16H3c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1h3h12h3c0.6,0,1-0.4,1-1
                C22,20.4,21.6,20,21,20z M7,20V5h10v15H7z M15,11L15,11c0.6,0,1,0.4,1,1l0,0c0,0.6-0.4,1-1,1l0,0c-0.6,0-1-0.4-1-1l0,0
                C14,11.4,14.4,11,15,11z"/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn']
}
</script>