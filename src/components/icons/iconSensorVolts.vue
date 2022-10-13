<template>
    <div class="icon-volts" :class="{on: isOn}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polygon class="fill-const" points="9.1,7.6 10.8,6.4 12.8,9.4 11.1,10.6 "/>
            <path class="fill-variable" d="M12,20.8l-4.8-7.2l1.7-1.1l3.2,4.8l3.2-4.8l1.7,1.1L12,20.8z M24,20V4c0-2.2-1.8-4-4-4H4C1.8,0,0,1.8,0,4v16
                c0,2.2,1.8,4,4,4h16C22.2,24,24,22.2,24,20z M20,2c1.1,0,2,0.9,2,2v16c0,1.1-0.9,2-2,2H4c-1.1,0-2-0.9-2-2V4c0-1.1,0.9-2,2-2H20z
                M12,6C9.1,6,7,7.6,7,9h10C17,7.6,14.9,6,12,6 M12,4c3.9,0,7,2.2,7,5c0,0.7-0.2,1.4-0.6,2H5.6C5.2,10.4,5,9.7,5,9C5,6.2,8.1,4,12,4
                L12,4z"/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn']
}
</script>