<template>
    <div class="icon-tuning" :class="{on: isOn}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path class="fill-const" d="M12,14.5c-1.8-1.5-4.3-1.6-6-0.7c-0.4,2.2,0.5,4.5,2.3,6c2.2,1.6,5.2,1.6,7.3,0c1.4-1,2.2-2.5,2.4-4.1
                C16,16.8,14.1,16.2,12,14.5z"/>
            <path class="fill-variable" d="M12,21c-1.3,0-2.6-0.4-3.7-1.2c-2.5-1.8-3.2-5.3-1.6-7.9L12,2.5l5.3,9.3
                c1.5,2.7,0.8,6.1-1.6,7.9C14.6,20.6,13.3,21,12,21z M12,6.5l-3.6,6.3c-1,1.8-0.6,4.1,1.1,5.3c1.5,1.1,3.5,1.1,4.9,0
                c1.7-1.2,2.1-3.5,1.1-5.3L12,6.5z"/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn']
}
</script>