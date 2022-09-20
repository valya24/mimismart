<template>
  <component
    :is="$options.components[computedType] ? computedType : ''"
    :addr="addr" :name="name" :editPermission="editPermission" />
</template>

<script>
import DimmerWidget from "@/components/widgets/DimmerWidget"
import ConditionerWidget from "@/components/widgets/ConditionerWidget"
import RGBLampWidget from "@/components/widgets/RGBLampWidget"
import JalousieWidget from "@/components/widgets/JalousieWidget"

import TextSensorWidget from "@/components/widgets/TextSensorWidget"
import ValveHeatingWidget from "@/components/widgets/ValveHeatingWidget"

export default {
  props: {
    type: String,
    addr: String,
    name: String,
    editPermission: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    item() {
      return this.$store.state.itemMap[this.addr];
    },
    computedType() {
      let type = this.type == 'virtual' ? this.item.attributes['sub-type'] : this.type;
      return `${type}-widget`;
    }
  },
  components: {
    'dimer-lamp-widget': DimmerWidget,
    'conditioner-widget': ConditionerWidget,
    'rgb-lamp-widget': RGBLampWidget,
    'jalousie-widget': JalousieWidget,
    'jalousie120-widget': JalousieWidget,
    'gate-widget': JalousieWidget,
    'gate120-widget': JalousieWidget,

    'long-text-widget': TextSensorWidget,
    'valve-heating-widget': ValveHeatingWidget,
  }
}
</script>

<style>

</style>