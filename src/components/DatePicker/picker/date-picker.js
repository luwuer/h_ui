import Picker from '../picker.vue';
import DatePickerPanel from '../panel/Date/date.vue';
import RangeDatePickerPanel from '../panel/Date/date-range.vue';
import { oneOf } from '../../../util/tools';

export default {
  mixins: [Picker],
  props: {
    type: {
      validator(value) {
        return oneOf(value, ['year', 'month', 'date', 'daterange', 'datetime', 'datetimerange']);
      },
      default: 'date'
    },
    value: {},
    splitPanels: {
      type: Boolean,
      default: false
    },
  },
  components: { DatePickerPanel, RangeDatePickerPanel },
  computed: {
    panel(){
        const isRange =  this.type === 'daterange' || this.type === 'datetimerange'||this.showTwoPanel;
        return isRange ? 'RangeDatePickerPanel' : 'DatePickerPanel';
    },
    ownPickerProps(){
        return this.options;
    },
    localePlaceholder () {
      if (this.placeholder === undefined) {
          return this.t('i.datepicker.selectDate');
      } else {
          return this.placeholder;
      }
    },
  },
};