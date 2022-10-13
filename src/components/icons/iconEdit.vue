<template>
    <div class="icon-edit" :class="{on: isOn}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path class="fill-variable" d="M8,18l-2-2l-1.5,3.5L8,18z M15,7l-8,8l2,2l8-8L15,7z M18,8l-2-2l1-1l2,2L18,8z"/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn']
}
</script>