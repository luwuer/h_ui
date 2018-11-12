// es6 polyfill
import './style/main.scss'
// import Directives from './directives'

import Affix from './components/Affix';
import Alert from './components/Alert';
import AutoComplete from './components/AutoComplete';
import Backtop from './components/Backtop';
import Badge from './components/Badge';
import Breadcrumb from './components/Breadcrumb';
import Button from './components/Button';
import Card from './components/Card';
import Carousel from './components/Carousel';
import Cascader from './components/Cascader';
import Checkbox from './components/Checkbox';
import Circle from './components/Circle';
import Collapse from './components/Collapse';
import DatePicker from './components/DatePicker';
import Dropdown from './components/Dropdown';
import Form from './components/Form';
import Gobottom from './components/GoBottom';
import Icon from './components/Icon';
import Input from './components/Input';
import InputNumber from './components/InputNumber';
// import Scroll from './components/scroll';
import LoadingBar from './components/LoadingBar';
import Menu from './components/Menu';
import Message from './components/Message';
import MsgBox from './components/MsgBox';
import Notice from './components/Notice';
import Page from './components/Page';
import Poptip from './components/Poptip';
import Progress from './components/Progress';
import Radio from './components/Radio';
// import Rate from './components/rate';
import SelectTree from './components/SelectTree';
import Slider from './components/Slider';
import Spin from './components/Spin';
import Steps from './components/Steps';
import Switch from './components/Switch';
import Table from './components/Table';
import Tabs from './components/Tabs';
// import Tag from './components/tag';
import Timeline from './components/Timeline';
import TimePicker from './components/TimePicker';
import Tooltip from './components/Tooltip';
import Transfer from './components/Transfer';
import Tree from './components/Tree';
import Typefield from './components/Typefield';
import Upload from './components/Upload';
import Row from './components/Grid';
import Select from './components/Select';
import SimpleSelect from './components/SimpleSelect';
import EditGird from './components/EditGird';
import GroupTable from './components/GroupTable';
import TreeGird from './components/TreeGird';
import AsycTreeGird from './components/AsycTreeGird';
import SelectTable from './components/SelectTable';
import FastDate from './components/FastDate';
import SplicePanel from './components/SplicePanel';
import FieldPanel from './components/Panel';
import SimpleTable from './components/SimpleTable';
import TransferTable from './components/TransferTable';
import FormGird from './components/FormGird';
import Rate from './components/Rate';
import Textdiff from './components/Textdiff';
import TypefieldRange from './components/TypefieldRange';
import Split from './components/Split';
import Drawer from './components/Drawer';
import Log from './components/Log';
// import FileImport from './components/FileImport';
// import FileExport from './components/FileExport';
import locale from './locale';


const h_ui = {
    Affix,
    hAffix: Affix,
    Alert,
    hAlert: Alert,
    AutoComplete,
    hAutoComplete: AutoComplete,
    Backtop,
    hBacktop: Backtop,
    Gobottom,
    hGobottom: Gobottom,
    Badge,
    hBadge: Badge,
    Breadcrumb,
    hBreadcrumb: Breadcrumb,
    BreadcrumbItem: Breadcrumb.Item,
    hBreadcrumbItem:  Breadcrumb.Item,
    Button,
    hButton: Button,
    ButtonGroup: Button.Group,
    hButtonGroup: Button.Group,
    Card,
    hCard: Card,
    Carousel,
    hCarousel: Carousel,
    Carouselitem: Carousel.Item,
    hCarouselitem: Carousel.Item,
    Cascader,
    hCascader: Cascader,
    Checkbox,
    hCheckbox: Checkbox,
    CheckboxGroup: Checkbox.Group,
    hCheckboxGroup: Checkbox.Group,
    Checkbtn:Checkbox.Btn,
    hCheckbtn: Checkbox.Btn,
    // Circle,
    hCircle: Circle,
    Row,
    hRow: Row,
    Col: Row.Item,
    hCol: Row.Item,
    Collapse,
    hCollapse: Collapse,
    Panel: Collapse.Panel,
    hPanel: Collapse.Panel,
    DatePicker,
    hDatePicker: DatePicker,
    Dropdown,
    hDropdown: Dropdown,
    DropdownItem: Dropdown.Item,
    hDropdownItem: Dropdown.Item,
    DropdownMenu: Dropdown.Menu,
    hDropdownMenu: Dropdown.Menu,
    Form,
    hForm: Form,
    FormItem: Form.Item,
    hFormItem: Form.Item,
    Icon,
    hIcon: Icon,
    Input,
    hInput: Input,
    InputNumber,
    hInputNumber: InputNumber,
    LoadingBar,
    hLoadingBar: LoadingBar,
    Menu,
    hMenu: Menu,
    MenuGroup: Menu.Group,
    hMenuGroup: Menu.Group,
    MenuItem: Menu.Item,
    hMenuItem: Menu.Item,
    Submenu: Menu.Sub,
    hSubmenu: Menu.Sub,
    Message,
    hMessage: Message,
    MsgBox,
    hMsgBox: MsgBox,
    Notice,
    hNotice: Notice,
    Page,
    hPage: Page,
    Poptip,
    hPoptip: Poptip,
    Progress,
    hProgress: Progress,
    Radio,
    hRadio: Radio,
    RadioGroup: Radio.Group,
    hRadioGroup: Radio.Group,
    Select,
    hSelect: Select,
    Option: Select.Option,
    hOption: Select.Option,
    SimpleSelect:SimpleSelect,
    hSimpleSelect:SimpleSelect,
    hSelectBlock:SimpleSelect.Block,
    hSelectBlock:SimpleSelect.Block,
    OptionGroup: Select.OptionGroup,
    hOptionGroup: Select.OptionGroup,
    SelectTree,
    hSelectTree: SelectTree,
    Slider,
    hSlider: Slider,
    Spin,
    hSpin: Spin,
    Steps,
    hSteps: Steps,
    Step: Steps.Step,
    hStep: Steps.Step,
  // Switch,
    hSwitch: Switch,
    Table,
    hTable: Table,
    Tabs,
    hTabs: Tabs,
    TabPane: Tabs.Pane,
    hTabPane: Tabs.Pane,
    Timeline,
    hTimeline: Timeline,
    TimelineItem: Timeline.Item,
    hTimelineItem: Timeline.Item,
    TimePicker,
    hTimePicker: TimePicker,
    Tooltip,
    hTooltip: Tooltip,
    Transfer,
    hTransfer: Transfer,
    Tree,
    hTree:Tree,
    Typefield,
    hTypefield: Typefield,
    Upload,
    hUpload:Upload,
    EditGird,
    hEditGird:EditGird,
    GroupTable,
    hGroupTable:GroupTable,
    TreeGird,
    hTreeGird:TreeGird,
    AsycTreeGird,
    hAsycTreeGird:AsycTreeGird,
    SelectTable:SelectTable,
    hSelectTable:SelectTable,
    hTableOption:SelectTable.Option,
    TableOption:SelectTable.Option,
    FastDate:FastDate,
    hFastDate:FastDate, 
    SplicePanel:SplicePanel,   
    hSplicePanel:SplicePanel,
    FieldPanel:FieldPanel,
    hFieldPanel:FieldPanel,
    SimpleTable:SimpleTable,
    hSimpleTable:SimpleTable,
    TransferTable:TransferTable,
    hTransferTable:TransferTable,
    FormGird:FormGird,    
    hFormGird:FormGird,
    Rate:Rate,
    hRate:Rate,  
    Textdiff,
    hTextdiff: Textdiff,
    TypefieldRange,
    hTypefieldRange:TypefieldRange,
    Split:Split,  
    hSplit:Split,  
    Drawer:Drawer,
    hDrawer:Drawer,
    Log:Log,
    hLog:Log
    // FileImport:FileImport,
    // hFileImport:FileImport,
    // FileExport: FileExport,
    // hFileExport: FileExport
};
const install = function(Vue, opts = {}) {
    locale.use(opts.locale);
    locale.i18n(opts.i18n);

    Object.keys(h_ui).forEach(key => {
        Vue.component(key, h_ui[key]);
    });
    // Object.keys(Directives).forEach(key => {
    //   Vue.directive(key, Directives[key])
    // })s
    Vue.prototype.$hLoading = LoadingBar;
    Vue.prototype.$hMessage = Message;
    Vue.prototype.$hMsgBox = MsgBox;
    Vue.prototype.$hNotice = Notice;
    Vue.prototype.$hSpin = Spin;
};

if (typeof window !== 'undefined' && window.Vue) {
  // Venus(window.Vue)
  // window.Vue.use(Venus)
  install(window.Vue);
}
module.exports = Object.assign(h_ui, {install}); // eslint-disable-line no-undef
// module.exports = Venus

