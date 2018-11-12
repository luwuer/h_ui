import Vue from 'vue'
import Router from 'vue-router'
// import Home from '../views/Home.vue'
// import Hello from '../views/hello.vue'
// import Switchs from '../views/Switchs.vue'
// import Typefield from '../views/Typefield.vue'
// import Input from '../views/Input.vue'
// import Checkbox from '../views/Checkbox.vue'
// import Radio from '../views/Radio.vue'
// import Icon from '../views/Icon.vue'
// import Buttons from '../views/Buttons.vue'
// import Messages from '../views/Messages.vue'
// import Notices from '../views/Notices.vue'
// import MsgBox from '../views/MsgBox.vue'
// import Alerts from '../views/Alerts.vue'
// import Progress from '../views/Progress.vue'
// import Badge from '../views/Badge.vue'
// import InputNum from '../views/InputNumber.vue'
// import Tooltip from '../views/Tooltip.vue'
// import Poptip from '../views/Poptip.vue'
// import Slider from '../views/Slider.vue'
// import Carousel from '../views/Carousel.vue'
// import Grid from '../views/Grid.vue'
// import Select from '../views/Select.vue'
// import Menu from '../views/Menu.vue'
// import Breadcrumb from '../views/Breadcrumb.vue'
// import Layout from '../views/Layout.vue'
// import Upload from '../views/Upload.vue'
// import Table from '../views/Table.vue'
// import Page from '../views/Page.vue'
// import DatePicker from '../views/DatePicker.vue'
// import TimePicker from '../views/TimePicker.vue'
// import Tree from '../views/Tree.vue'
// import Tabs from '../views/Tabs.vue'
// import Dropdown from '../views/Dropdown.vue'
// import Timeline from '../views/Timeline.vue'
// import Collapse from '../views/Collapse.vue'
// import Cascader from '../views/Cascader.vue'
// import Transfer from '../views/Transfer.vue'
// import Loadingbar from '../views/Loadingbar.vue'
// import Backtop from '../views/Backtop.vue'
// import Spin from '../views/Spin.vue'
// import Form from '../views/Form.vue'
// import SelectTree from '../views/SelectTree.vue'
// import Steps from '../views/Steps.vue'
// import Circle from '../views/Circle.vue'
// import Affix from '../views/Affix.vue'
// import Card from '../views/Card.vue'
// import EditGird from '../views/EditGird.vue'
// import GroupTable from '../views/GroupTable.vue'
// import TreeGird from '../views/TreeGird.vue'
// import AsycTreeGird from '../views/AsycTreeGird.vue'
// import SelectTable from '../views/SelectTable.vue'
// import FastDate from '../views/FastDate.vue'
// import SplicePanel from '../views/SplicePanel.vue'
// import Panel from '../views/Panel.vue'
// import SimpleTable from '../views/SimpleTable.vue'
// import TransferTable from '../views/TransferTable.vue'
// import FormGird from '../views/FormGird.vue'
// import Rate from '../views/Rate.vue'
// import Textdiff from '../views/Textdiff.vue'
// import TypefieldRange from '../views/TypefieldRange.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    { name: 'home', path: '/home', component: require('../views/Home.vue') },
    { name: 'switchs', path: '/switchs', component: require('../views/Switchs.vue') },
    { name: 'typefield', path: '/typefield', component: require('../views/Typefield.vue') },
    {
        name: 'Input',
        path: '/Input',
        component: require('../views/Input.vue')
    },
    {
        name: 'inputNum',
        path: '/inputNum',
        component: require('../views/InputNumber.vue')
    },
    {
        name: 'checkbox',
        path: '/checkbox',
        component: require('../views/Checkbox.vue')
    },
    {
        name: 'radio',
        path: '/radio',
        component: require('../views/Radio.vue')
    },
    {
        name: 'icon',
        path: '/icon',
        component: require('../views/Icon.vue')
    },
    {
        name: 'buttons',
        path: '/buttons',
        component: require('../views/Buttons.vue')
    },
    {
        name: 'messages',
        path: '/messages',
        component: require('../views/Messages.vue')
    },
    {
        name: 'notices',
        path: '/notices',
        component: require('../views/Notices.vue')
    },
    {
        name: 'alert',
        path: '/alerts',
        component: require('../views/Alerts.vue')
    },
    {
        name: 'msgBox',
        path: '/msgBox',
        component: require('../views/MsgBox.vue')
    },
    {
        name: 'tooltip',
        path: '/tooltip',
        component: require('../views/Tooltip.vue')
    },
    {
        name: 'poptip',
        path: '/poptip',
        component: require('../views/Poptip.vue')
    },
    {
        name: 'progress',
        path: '/progress',
        component: require('../views/Progress.vue')
    },
    {
        name: 'slider',
        path: '/slider',
        component: require('../views/Slider.vue')
    },
    {
        name: 'badge',
        path: '/badge',
        component: require('../views/Badge.vue')
    },
    {
        name: 'carousel',
        path: '/carousel',
        component: require('../views/Carousel.vue')
    },
    {
        name: 'grid',
        path: '/grid',
        component: require('../views/Grid.vue')
    },
    {
        name: 'select',
        path: '/select',
        component: require('../views/Select.vue')
    },
    {
        name: 'simpleSelect',
        path: '/simpleSelect',
        component: require('../views/SimpleSelect.vue')
    },
    {
        name: 'menu',
        path: '/menu',
        component: require('../views/Menu.vue')
    },
    {
        name: 'breadcrumb',
        path: '/breadcrumb',
        component: require('../views/Breadcrumb.vue')
    },
    {
        name: 'layout',
        path: '/layout',
        component: require('../views/Layout.vue')
    },
    {
        name: 'upload',
        path: '/upload',
        component: require('../views/Upload.vue')
    },
    {
        name: 'table',
        path: '/table',
        component: require('../views/Table.vue'),
        meta: {
            isKeepAlive: true
        }
    },
    {
        name: 'page',
        path: '/page',
        component: require('../views/Page.vue')
    },
    {
        name: 'DatePicker',
        path: '/datePicker',
        component: require('../views/DatePicker.vue')
    }, 
    {
        name: 'TimePicker',
        path: '/timePicker',
        component: require('../views/TimePicker.vue')
    },       
    {
        name: 'Tree',
        path: '/tree',
        component: require('../views/Tree.vue')
    },       
    {
        name: 'Tabs',
        path: '/tabs',
        component: require('../views/Tabs.vue')
    },       
    {
        name: 'Dropdown',
        path: '/dropdown',
        component: require('../views/Dropdown.vue')
    },
    {
        name: 'Timeline',
        path: '/timeline',
        component: require('../views/Timeline.vue')
    },
    {
        name: 'Collapse',
        path: '/collapse',
        component: require('../views/Collapse.vue')
    },
    {
        name: 'Cascader',
        path: '/cascader',
        component: require('../views/Cascader.vue')
    },
    {
        name: 'Transfer',
        path: '/transfer',
        component: require('../views/Transfer.vue')
    },
    {
        name: 'Loadingbar',
        path: '/loadingbar',
        component: require('../views/Loadingbar.vue')
    },
    {
        name: 'Spin',
        path: '/spin',
        component: require('../views/Spin.vue')
    },
    {
        name: 'Backtop',
        path: '/backtop',
        component: require('../views/Backtop.vue')
    },
    {
        name: 'Form',
        path: '/form',
        component: require('../views/Form.vue')
    },
    {
        name: 'SelectTree',
        path: '/selectTree',
        component: require('../views/SelectTree.vue')
    },
    {
        name: 'Steps',
        path: '/steps',
        component: require('../views/Steps.vue')
    },
    {
        name: 'Circle',
        path: '/circle',
        component: require('../views/Circle.vue')
    },
    {
        name: 'Affix',
        path: '/affix',
        component: require('../views/Affix.vue')
    },
    {
        name: 'Card',
        path: '/card',
        component: require('../views/Card.vue')
    },
    {
        name: 'EditGird',
        path: '/editgird',
        component: require('../views/EditGird.vue')
    },
    {
        name: 'GroupTable',
        path: '/groupTable',
        component: require('../views/GroupTable.vue')
    },
    {
        name: 'TreeGird',
        path: '/treeGird',
        component: require('../views/TreeGird.vue')
    },
    {
        name: 'AsycTreeGird',
        path: '/asyctreeGird',
        component: require('../views/AsycTreeGird.vue')
    },
    {
        name: 'SelectTable',
        path: '/selectTable',
        component: require('../views/SelectTable.vue')
    },
    {
        name: 'FastDate',
        path: '/fastDate',
        component: require('../views/FastDate.vue')
    },
    {
        name: 'SplicePanel',
        path: '/splicePanel',
        component: require('../views/SplicePanel.vue')
    },
    {
        name: 'Panel',
        path: '/panel',
        component: require('../views/Panel.vue')
    },
    {
        name: 'Hello',
        path: '/hello',
        component: require('../views/Hello.vue')
    },
    {
        name: 'SimpleTable',
        path: '/simpleTable',
        component: require('../views/SimpleTable.vue')
    },
    {
        name: 'TransferTable',
        path: '/transferTable',
        component: require('../views/TransferTable.vue')
    },
    {
        name:'FormGird',
        path:'/formGird',
        component: require('../views/FormGird.vue')
    },
    {
        name:'Rate',
        path:'/rate',
        component: require('../views/Rate.vue')
    },
    {
        name: 'Textdiff',
        path: '/textdiff',
        component: require('../views/Textdiff.vue')
    },
    {
        name: 'TypefieldRange',
        path: '/typefieldRange',
        component: require('../views/TypefieldRange.vue')
    },
    {
        name: 'FileImport',
        path: '/fileimport',
        component: require('../views/FileImport.vue')
    },
    {
        name: 'FileExport',
        path: '/fileexport',
        component: require('../views/FileExport.vue')
    },
    
    // {
    //     name: 'Split',
    //     path: '/split',
    //     component: require('../views/Split.vue')
    // },
    {
        name: 'Drawer',
        path: '/drawer',
        component: require('../views/Drawer.vue')
    },
    {
        name: 'DownLoad',
        path: '/downLoad',
        component: require('../views/DownLoad.vue')
    },
    {
        name: 'Log',
        path: '/log',
        component: require('../views/Log.vue')
    }
 ]
})

router.beforeEach((to, from, next) => {
    let top = document.body.scrollTop
    if (top > 0) {
        const timer = setInterval(() => {
            scrollTo(0, top)
            top -= 100
            if (top <= 0) {
                scrollTo(0, 0)
                clearInterval(timer)
            }
        }, 20)
    }
    next()
})

export default router