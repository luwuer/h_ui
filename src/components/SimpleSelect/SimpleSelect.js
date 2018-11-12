import SimpleSelect from '../SelectTable/SelectTable.vue'
export default {
  name: 'SimpleSelect',
  mixins: [SimpleSelect],
  props: {
    block:{
      default: true,
    },
  },
  data () {
    return {
    };
  },
  methods: {},
  mounted () {
  },
  beforeDestroy () {
  }
};