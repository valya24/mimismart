<template>
  <ModalDeviceControl
    :deviceName="name"
    @hide="$store.commit('modules/popups/hidePopup')"
    :tabs="tabs"
  >
    <template :slot="tabs[0]">
      <div class="import-script-control-app-container">
        <label class="checklabel hbox alic" slot="label">
          {{ $t('Disable script') }}
        </label>
        <app-switch
          :checked="configData.__ && configData.__.commented"
          @change="handleCommentedChange"
        />
      </div>
    </template>
  </ModalDeviceControl>
</template>

<script>
import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
// import ModalDeviceControlStats from "@/components/modals/ModalDeviceControlStats";
// import FormRow from "@/components/etc/FormRow";

let convert = require('xml-js')

export default {
  props: {
    active: {
      default: false,
      type: Boolean,
    },
    name: String,
    addr: String,
    status: Array,
    configData: Object
  },
  computed: {
    tabs() {
      return [
        this.$t("Control"),
      ];
    },
  },
  methods: {
    handleCommentedChange(e) {
      this.$set(this.configData.__, 'commented', e);
      
      let obj = {
        attributes: this.configData.attributes,
        type: this.configData.type,
        name: this.configData.name,
      };

      let newItem = {
        declaration: {
          attributes: {
            version: "1.0",
            encoding: "UTF-8"
          }
        },
        elements: [obj]
      };

      let newItemXml = convert.js2xml(newItem, {
        spaces: '\t',
        ignoreDeclaration: true
      });

      let commentText = (newItemXml.substring(2, newItemXml.length - 1));

      if (e === false) {
        let idx = this.configData.parent.elements.findIndex( item => item.comment && item.comment == commentText );
        this.configData.parent.elements[idx] = { ...obj, parent: this.configData.parent };
      } else {
        let idx = this.configData.parent.elements
          .findIndex( item => item.attributes &&
            item.name == obj.name &&
            item.type == obj.type &&
            item.attributes == obj.attributes );

        this.configData.parent.elements[idx] = {
          parent: this.configData.parent,
          type: 'comment',
          comment: commentText
        };
      }

      this.$store.dispatch('changeGlobalXml');
    }
  },
  components: {
    ModalDeviceControl,
    // FormRow
  }
}
</script>

<style lang="less" scoped>
.import-script-control-app {
  &-container {
    margin-top: 24px;
    margin-left: 16px;
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .checklabel {
      margin-right: 20px;
    }
  }
}
</style>