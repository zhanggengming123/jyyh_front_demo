
export default {
  data: {
    formTypeSettings: {}
  },
  watch: {
    formSettings () {
      const typeSetting = {}
      this.formSettings.forEach(setting => {
        typeSetting[setting.formId] = setting.formItem.type
      })
      this.formTypeSettings = typeSetting
    }
  },
  methods: {
    formatSensitiveValue (id, val) {
      if (this.formTypeSettings[id] == 'sensitive-input') {
        return val ? JSON.parse(val).sensitiveField : val
      }
      return val
    }
  }
}
