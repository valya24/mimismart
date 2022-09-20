<template>
    <div class="icon-illumination" :class="{on: isOn}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle class="fill-orange" cx="12" cy="12" r="5"/>
            <path class="fill-red" d="M7.8,17.6c-0.5-0.4-1-0.9-1.4-1.4l-2.1,2.1l1.4,1.4L7.8,17.6z M11,18.9c0.3,0,0.7,0.1,1,0.1s0.7,0,1-0.1V22h-2
                V18.9z M16.2,17.6l2.1,2.1l1.4-1.4l-2.1-2.1C17.2,16.7,16.7,17.2,16.2,17.6z M18.9,13H22v-2h-3.1c0,0.3,0.1,0.7,0.1,1
                S19,12.7,18.9,13z M17.6,7.8l2.1-2.1l-1.4-1.4l-2.1,2.1C16.7,6.8,17.2,7.3,17.6,7.8z M13,5.1V2h-2v3.1C11.3,5,11.7,5,12,5
                S12.7,5,13,5.1z M7.8,6.4L5.7,4.3L4.3,5.7l2.1,2.1C6.8,7.3,7.3,6.8,7.8,6.4z M5.1,11H2v2h3.1C5,12.7,5,12.3,5,12S5,11.3,5.1,11z"/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn']
}
</script>