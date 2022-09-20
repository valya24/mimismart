<template>
  <WidgetItem :icon="icon"
    :sensor="true"
    :name="name" :addr="addr">
    <div class="text-long">
      {{ text.trim() }}
    </div>
  </WidgetItem>
</template>

<script>
import WidgetItem from "@/components/widgets/WidgetItem"

export default {
  props: {
    name: String,
    addr: String,
  },
  computed: {
    item() {
      return this.$store.state.itemMap[this.addr];
    },
    icon() {
      return this.item.__.icon;
    },
    status() {
      return this.item.__.status;
    },
    text() {
      let uintarr = new Uint8Array(this.status.length);
      for (let i = 0; i < this.status.length; i++) {
        uintarr[i] = this.status[i];
      }
      let utf8decoder = new TextDecoder();
      let outStr = utf8decoder.decode(uintarr);
      return outStr;
    },
  },
  components: {
    WidgetItem,
  }
}
</script>

<style scoped>
.text-long {
  white-space: pre;
}
</style>