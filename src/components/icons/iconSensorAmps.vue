<template>
    <div class="icon-amps" :class="{on: isOn}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polygon class="fill-const" points="9.1,7.6 10.8,6.4 12.8,9.4 11.1,10.6 "/>
            <path class="fill-variable" d="M20,24H4c-2.2,0-4-1.8-4-4V4c0-2.2,1.8-4,4-4h16c2.2,0,4,1.8,4,4v16C24,22.2,22.2,24,20,24z M4,2
                C2.9,2,2,2.9,2,4v16c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V4c0-1.1-0.9-2-2-2H4z M15.2,20.6l-0.8-1.2H9.6l-0.8,1.2l-1.7-1.1l4.8-7.2
                l4.8,7.2L15.2,20.6z M11,17.3h2l-1-1.5L11,17.3z M12,6c2.9,0,5,1.6,5,3H7C7,7.6,9.1,6,12,6 M12,4C8.1,4,5,6.2,5,9
                c0,0.7,0.2,1.4,0.6,2h12.8c0.4-0.6,0.6-1.3,0.6-2C19,6.2,15.9,4,12,4L12,4z"/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn']
}
</script>