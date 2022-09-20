<template>
    <div class="icon-duplicate" :class="{on: isOn}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path class="fill-variable" d="M16,23H4c-1.7,0-3-1.3-3-3V8c0-1.7,1.3-3,3-3h12c1.7,0,3,1.3,3,3v12C19,21.7,17.7,23,16,23z M4,7
                C3.4,7,3,7.4,3,8v12c0,0.6,0.4,1,1,1h12c0.6,0,1-0.4,1-1V8c0-0.6-0.4-1-1-1H4z M8,3h12c0.6,0,1,0.4,1,1v12c0,0.6-0.4,1-1,1h-1v2h1
                c1.7,0,3-1.3,3-3V4c0-1.7-1.3-3-3-3H8C6.3,1,5,2.3,5,4v1h2V4C7,3.4,7.4,3,8,3z M11,15h3v-2h-3v-3H9v3H6v2h3v3h2V15z"/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn']
}
</script>