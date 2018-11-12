<template>
    <div>
        <h1>异步测试</h1>
        <h-form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
            <h-form-item label="密码" prop="passwd">
                <h-input type="password" v-model="formCustom.passwd"></h-input>
            </h-form-item>
            <h-form-item label="年龄" prop="age">
                <h-input type="text" v-model="formCustom.age" number></h-input>
            </h-form-item>
            <h-form-item label="确认密码" prop="passwdCheck">
                <h-input type="password" disabled v-model="formCustom.passwdCheck"></h-input>
            </h-form-item>
            <h-form-item>
                <h-button type="primary" @click="handleSubmit('formCustom')">提交</h-button>
                <h-button type="ghost" @click="handleReset('formCustom')" style="margin-left: 8px">重置</h-button>
            </h-form-item>
        </h-form>
        <h1>测试</h1>
        <h-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="250" label-position='left' :showMessage="true" placement="top-start">
            <h-form-item label="姓名" prop="name" :label-width="50" :showMessage="true">
              <h-typefield v-model="formValidate.name" type="money" ></h-typefield>
            </h-form-item>   
            <h-form-item label="姓名" prop="name" :label-width="50" :showMessage='true'>
              <h-select-tree  v-model="formValidate.name" ></h-select-tree>
            </h-form-item>    
            <h-form-item :showMessage='true'>
               <h-button type="primary" @click="handleSubmit('formValidate')">提交</h-button>
               <h-button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</h-button>
            </h-form-item>
       </h-form>
        <h1>设置inline,表单元素可以水平排列</h1>
        <br>
        <h-form ref="formInline" :model="formInline" inline>
            <h-form-item prop="user">
                <h-input type="text" v-model="formInline.user" placeholder="Username">
                    <h-icon name="people" slot="prepend"></h-icon>
                </h-input>
            </h-form-item>
            <h-form-item prop="password">
                <h-input type="password" v-model="formInline.password" placeholder="Password">
                    <h-icon name="lock" slot="prepend"></h-icon>
                </h-input>
            </h-form-item>
            <h-form-item>
                <h-button type="primary" @on-click="handleSubmit('formInline')">登录</h-button>
            </h-form-item>
        </h-form>
        <h1>一般表单</h1>
        <br>
        <p>
            在 Form 内，每个表单域由 FormItem 组成，可包含的控件有：Input、Radio、Checkbox、Switch、Select、Slider、DatePicker、TimePicker、Cascader、Transfer、InputNumber、Upload
        </p>
        <p>
            给 FormItem 设置属性 label 可以显示表单域的标签，需要给 Form 设置 label-width。
        </p>
        <br>
        <p>
            给 FormItem 设置属性 label-for 可以指定原生的 label 标签的 for 属性，配合设置控件的 element-id 属性，可以点击 label 时聚焦控件。
        </p>
        <br>
        <h-row>
            <h-col span="12">
                <h-form :model="formItem" :label-width="80">
                    <h-form-item label="输入框">
                        <h-input v-model="formItem.input" placeholder="请输入"></h-input>
                    </h-form-item>
                    <h-form-item label="选择器">
                        <h-select v-model="formItem.select" placeholder="请选择" :readonly="true">
                            <h-option value="beijing">北京市</h-option>
                            <h-option value="shanghai">上海市</h-option>
                            <h-option value="shenzhen">深圳市</h-option>
                        </h-select>
                    </h-form-item>
                    <h-form-item label="日期控件">
                        <h-row>
                            <h-col span="11">
                                <h-datePicker type="date" placeholder="选择日期" v-model="formItem.date"></h-datePicker>
                            </h-col>
                            <h-col span="2" style="text-align: center">-</h-col>
                            <h-col span="11">
                                <h-timePicker type="time" placeholder="选择时间" v-model="formItem.time"></h-timePicker>
                            </h-col>
                        </h-row>
                    </h-form-item>
                    <h-form-item label="单选框">
                        <h-radio-group v-model="formItem.radio">
                            <h-radio label="male">男</h-radio>
                            <h-radio label="female">女</h-radio>
                        </h-radio-group>
                    </h-form-item>
                    <h-form-item label="多选框">
                        <h-checkbox-group v-model="formItem.checkbox">
                            <h-checkbox label="吃饭"></h-checkbox>
                            <h-checkbox label="睡觉"></h-checkbox>
                            <h-checkbox label="跑步"></h-checkbox>
                            <h-checkbox label="看电影"></h-checkbox>
                        </h-checkbox-group>
                    </h-form-item>
                    <h-form-item label="开关">
                        <h-switch v-model="formItem.switch" size="large">
                            <span slot="open">开启</span>
                            <span slot="close">关闭</span>
                        </h-switch>
                    </h-form-item>
                    <h-form-item label="滑块">
                        <h-slider v-model="formItem.slider" range></h-slider>
                    </h-form-item>
                    <h-form-item label="文本域">
                        <h-input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></h-input>
                    </h-form-item>
                    <h-form-item>
                        <h-button type="primary">提交</h-button>
                        <h-button type="ghost" style="margin-left: 8px">取消</h-button>
                    </h-form-item>
                </h-form>
            </h-col>
        </h-row>
        <br>
        <h1>表单对齐方式:label-position,设置值为left即左对齐,right:右对齐,top为表单顶部</h1>
        <br>
        <p style="color:red;">左对齐:</p>
        <h-row>
            <h-col span="12">
                <h-form :model="formLeft" label-position="left" :label-width="100">
                    <h-form-item label="标题标题名称对齐标题名称对齐标题名称对齐标题名称对齐标题名称对齐" required>
                        <h-input v-model="formLeft.input1"></h-input>
                    </h-form-item>
                    <h-form-item label="标题名称">
                        <h-input v-model="formLeft.input2"></h-input>
                    </h-form-item>
                    <h-form-item label="标题名称对齐">
                        <h-input v-model="formLeft.input3"></h-input>
                    </h-form-item>
                </h-form>
            </h-col>
        </h-row>
        <p style="color:red;">右对齐:</p>
        <h-row>
            <h-col span="12">
                <h-form :model="formRight" label-position="right" :label-width="100">
                    <h-form-item label="标题">
                        <h-input v-model="formRight.input1"></h-input>
                    </h-form-item>
                    <h-form-item label="标题名称">
                        <h-input v-model="formRight.input2"></h-input>
                    </h-form-item>
                    <h-form-item label="标题名称对齐">
                        <h-input v-model="formRight.input3"></h-input>
                    </h-form-item>
                </h-form>
            </h-col>
        </h-row>
        <p style="color:red;">顶部:</p>
        <h-row>
            <h-col span="12">
                <h-form ref="formTop" :model="formTop" label-position="top" :label-width="100">
                    <h-form-item label="标题" required prop="input1">
                        <h-input v-model="formTop.input1"></h-input>
                    </h-form-item>
                    <h-form-item label="标题名称" prop="input2">
                        <h-input v-model="formTop.input2"></h-input>
                    </h-form-item>
                    <h-form-item label="标题名称对齐111" prop="input3">
                        <h-input v-model="formTop.input3"></h-input>
                    </h-form-item>
                </h-form>
            </h-col>
        </h-row>
        <h1>form表单上的验证</h1>
        <br>
        <p>表单验证有form表单定义rules属性、formitem定义rules属性、formItem定义validRules属性[自定义验证]</p>
        <p>优先级:validRules > formItem.rules > form.rules,同时,优先级高的会覆盖优先级低的;注意：验证时formItem上需要有prop属性</p>
        <br>
        <h1>推荐:validRules属性-自定义表单验证;</h1>
        <br>
        <p>书写方式:数组,例如:['isPhone',{test:/^[a-zA-Z]+$/, message:'不全是字母',trigger:'blur'},{test:func,trigger:'blur'}]</p>
        <br>
        <p>默认支持验证的，有isPhone,isNumber,isEmail,同时是blur触发</p>
        <p>同时支持自定义正则验证及函数验证；
            <br>编写格式:
            <br>         *{
            <br>         *	 test:FuncOrRegExp,//正则表达式规则或者函数
            <br>         *	  message:'',//错误提示
            <br>         *    trigger:'' //可选值:blur/change,不配置时默认blur及change时均触发
            <br>         *}
        </p>
        <br>
        <p>formItem上配置默认必填，则配置required属性即可</p>
        <h-row>
            <h-col span="12">
                <h-form ref="formValid" :model="formValid">
                    <h-form-item prop="user" required>
                        <h-input type="text" v-model="formValid.user" placeholder="仅required验证">
                            <h-icon name="people" slot="prepend"></h-icon>
                        </h-input>
                    </h-form-item>
                    <h-form-item prop="stringInput" :validRules="stringRule">
                        <h-input type="text" v-model="formValid.stringInput" placeholder="stringInput验证">
                            <h-icon name="people" slot="prepend"></h-icon>
                        </h-input>
                    </h-form-item>
                    <h-form-item prop="password" :validRules="regRule">
                        <h-input type="text" v-model="formValid.password" placeholder="仅正则[全是字母]验证">
                            <h-icon name="lock" slot="prepend"></h-icon>
                        </h-input>
                    </h-form-item>
                    <h-form-item prop="test1" :validRules="test1Rule">
                        <h-input type="text" v-model="formValid.test1" placeholder="仅Func[值为test]验证">
                            <h-icon name="people" slot="prepend"></h-icon>
                        </h-input>
                    </h-form-item>
                    <h-form-item prop="test2" :validRules="test2Rule">
                        <h-input type="text" v-model="formValid.test2" placeholder="混合验证">
                            <h-icon name="people" slot="prepend"></h-icon>
                        </h-input>
                    </h-form-item>
                    <h-form-item>
                        <h-button type="primary" @click="handleSubmit('formValid')">登录</h-button>
                    </h-form-item>
                </h-form>
            </h-col>
        </h-row>
        <br>
        <h1>formItem.rules属性</h1>
        <br>
        <p>formItem.rules属性及form.rules属性均基于async-validator库实现的数据验证，</p>
        <h-row>
            <h-col span="12">
                <h-form ref="formItemRules" :model="formItemRules">
                    <h-form-item prop="user" :rules="userValid">
                        <h-input type="text" v-model="formItemRules.user" placeholder="用户名">
                            <h-icon name="people" slot="prepend"></h-icon>
                        </h-input>
                    </h-form-item>
                    <h-form-item prop="password">
                        <h-input type="password" v-model="formItemRules.password" placeholder="密码">
                            <h-icon name="lock" slot="prepend"></h-icon>
                        </h-input>
                    </h-form-item>
                    <h-form-item>
                        <h-button type="primary" @click="handleSubmit('formItemRules')">登录</h-button>
                    </h-form-item>
                </h-form>
            </h-col>
        </h-row>
        <br>
        <h1>form.rules属性</h1>
        <br>
        <h-row>
            <h-col span="12">
                <h-form ref="formRules" :model="formRules" :rules="ruleInline" inline>
                    <h-form-item prop="user">
                        <h-input type="text" v-model="formRules.user" placeholder="Username">
                            <h-icon name="people" slot="prepend"></h-icon>
                        </h-input>
                    </h-form-item>
                    <h-form-item prop="password">
                        <h-input type="password" v-model="formRules.password" placeholder="Password">
                            <h-icon name="lock" slot="prepend"></h-icon>
                        </h-input>
                    </h-form-item>
                    <h-form-item>
                        <h-button type="primary" @click="handleSubmit('formRules')">登录</h-button>
                    </h-form-item>
                </h-form>    
            </h-col>
        </h-row>
        <h1>动态增减表单项</h1>
        <br>
        <p>当需要动态维护 FormItem 时，也可以直接给 FormItem 设置属性 rules 来单独为该域做验证。动态设置 FormItem 的 prop 属性时，会依据上层的 Form 组件的 model 来获取，
        </p>
        <h-row>
            <h-col span="12">
                <h-form ref="formDynamic" :model="formDynamic" :label-width="80">
                    <h-form-item
                        v-for="(item, index) in formDynamic.items"
                        :key="index"
                        :label="'项目' + (index + 1)"
                        :prop="'items.' + index + '.value'"
                        :rules="{required: true, message: '项目' + (index + 1) +'不能为空', trigger: 'blur'}">
                        <h-row>
                            <h-col span="18">
                                <h-input type="text" v-model="item.value" placeholder="请输入..."></h-input>
                            </h-col>
                            <h-col span="4" offset="1">
                                <h-button type="ghost" @click="handleRemove(index)">删除</h-button>
                            </h-col>
                        </h-row>
                    </h-form-item>
                    <h-form-item>
                        <h-row>
                            <h-col span="12">
                                <h-button type="dashed" long @click="handleAdd" icon="plus-round">新增</h-button>
                            </h-col>
                        </h-row>
                    </h-form-item>
                    <h-form-item>
                        <h-button type="primary" @click="handleSubmit('formDynamic')">提交</h-button>
                        <h-button type="ghost" @click="handleReset('formDynamic')" style="margin-left: 8px">重置</h-button>
                    </h-form-item>
                </h-form>
            </h-col>
        </h-row>
        <br>
        <h1>设置cols可以设置form几列显示</h1>
        <h-row>
            <h-form ref="formInline" :model="formInline" cols="3">
                <h-form-item prop="user">
                    <h-input type="text" v-model="formInline.user" placeholder="Username">
                        <h-icon name="people" slot="prepend"></h-icon>
                    </h-input>
                </h-form-item>
                <h-form-item prop="password">
                    <h-input type="password" v-model="formInline.password" placeholder="Password">
                        <h-icon name="lock" slot="prepend"></h-icon>
                    </h-input>
                </h-form-item>
                <h-form-item prop="user" required>
                    <h-input type="text" v-model="formInline.user" placeholder="Username" disabled>
                        <h-icon name="people" slot="prepend"></h-icon>
                    </h-input>
                </h-form-item>
                <h-form-item prop="password" required>
                    <h-input type="password" v-model="formInline.password" placeholder="Password">
                        <h-icon name="lock" slot="prepend"></h-icon>
                    </h-input>
                </h-form-item>
                <h-form-item>
                    <h-button type="primary" @click="handleSubmit('formInline')">登录</h-button>
                </h-form-item>
            </h-form>        
        </h-row>
        <h-row>
            <h-form ref="formValid" :model="formValid" cols="3">
                <h-form-item prop="user" required>
                    <h-input type="text" v-model="formValid.user" placeholder="仅required验证" disabled>
                        <h-icon name="people" slot="prepend"></h-icon>
                    </h-input>
                </h-form-item>
                <h-form-item prop="stringInput" :validRules="stringRule" required>
                    <h-input type="text" v-model="formValid.stringInput" placeholder="stringInput验证" disabled>
                        <h-icon name="people" slot="prepend"></h-icon>
                    </h-input>
                </h-form-item>
                <h-form-item prop="password" :validRules="regRule">
                    <h-input type="text" v-model="formValid.password" placeholder="仅正则[全是字母]验证" disabled>
                        <h-icon name="lock" slot="prepend"></h-icon>
                    </h-input>
                </h-form-item>
                <h-form-item prop="test1" :validRules="test1Rule">
                    <h-input type="text" v-model="formValid.test1" placeholder="仅Func[值为test]验证">
                        <h-icon name="people" slot="prepend"></h-icon>
                    </h-input>
                </h-form-item>
                <h-form-item prop="test2" :validRules="test2Rule">
                    <h-input type="text" v-model="formValid.test2" placeholder="混合验证">
                        <h-icon name="people" slot="prepend"></h-icon>
                    </h-input>
                </h-form-item>
                <h-form-item>
                    <h-button type="primary" @click="handleSubmit('formValid')">登录</h-button>
                </h-form-item>
            </h-form>
        </h-row>
        <h-row>
            <h-form :model="formLeft" label-position="left" :label-width="100" cols="3">
                    <h-form-item label="标题标题名称对齐标题名称对齐标题名称对齐标题名称对齐标题名称对齐" required>
                        <h-input v-model="formLeft.input1"></h-input>
                    </h-form-item>
                    <h-form-item label="标题名称">
                        <h-input v-model="formLeft.input2"></h-input>
                    </h-form-item>
                    <h-form-item label="标题名称对齐" required>
                        <h-input v-model="formLeft.input3"></h-input>
                    </h-form-item>
                </h-form>
        </h-row> 
        <h-row>
            <h-form ref="formValidate" :model="formValidate" :label-width="150" :showMessage=true  label-position="right"  cols="3"> 
                 <h-form-item label="姓名" prop="name">
                    <h-input v-model="formValidate.name" placeholder="请输入姓名"></h-input>
                </h-form-item>

                <h-form-item label="邮箱" prop="mail">
                    <h-input v-model="formValidate.mail" placeholder="请输入邮箱"></h-input>
                </h-form-item>
                <h-form-item label="城市" prop="city">
                    <h-select v-model="formValidate.city" placeholder="请选择所在地">
                        <h-option value="beijing">北京市</h-option>
                        <h-option value="shanghai">上海市</h-option>
                        <h-option value="shenzhen">深圳市</h-option>
                    </h-select>
                </h-form-item>
                <h-form-item label="下拉树" prop="tree" required >
                    <h-select-tree  v-model="formValidate.tree" :data="baseData2" ></h-select-tree>
                </h-form-item>

                <h-form-item label="金额" prop="ty" >
                    <h-typefield   v-model="formValidate.ty" type="money" placeholder="integerNum" ></h-typefield>
                </h-form-item>

                <h-form-item label="数字" prop="num1" >
                    <h-input-number   v-model="formValidate.num1"  ></h-input-number>
                </h-form-item> 

                <h-form-item label="选择日期哈哈哈">
                    <h-row>
                        <h-col span="11">
                            <h-form-item prop="date">
                                <h-date-picker type="date" placeholder="选择日期" v-model="formValidate.date"></h-date-picker>
                            </h-form-item>
                        </h-col>
                        <h-col span="2" style="text-align: center">-</h-col>
                        <h-col span="11">
                            <h-form-item prop="time">
                                <h-time-picker type="time" placeholder="选择时间" v-model="formValidate.time"></h-time-picker>
                            </h-form-item>
                        </h-col>
                    </h-row>
                </h-form-item>
                 <h-form-item label="性别1111" prop="gender">
                    <h-radio-group v-model="formValidate.gender">
                        <h-radio label="male">男</h-radio>
                        <h-radio label="female">女</h-radio>
                    </h-radio-group>
                </h-form-item>
                <h-form-item label="爱好" prop="interest">
                    <h-checkbox-group v-model="formValidate.interest">
                        <h-checkbox label="吃饭"></h-checkbox>
                        <h-checkbox label="睡觉"></h-checkbox>
                        <h-checkbox label="跑步"></h-checkbox>
                        <h-checkbox label="看电影"></h-checkbox>
                    </h-checkbox-group>
                </h-form-item>
                <h-form-item label="介绍" prop="desc">
                    <h-input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></h-input>
                </h-form-item> 
                <h-form-item>
                    <h-button type="primary" @click="handleSubmit('formValidate')">提交</h-button>
                    <h-button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</h-button>
                </h-form-item>
            </h-form>
        </h-row>
        <h2>表单提交校验时忽略disabled元素</h2>
        <h-row>
            <h-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" :showMessage=true  label-position="right">
                <h-row>
                    <h-col span="8">
                        <h-form-item label="姓名" prop="name">
                            <div>
                                <h-input v-model="formValidate.name" placeholder="请输入姓名" disabled></h-input>
                            </div>
                        </h-form-item>
                    </h-col>
                    <h-col span="8">
                        <h-form-item label="邮箱" prop="mail">
                            <h-input v-model="formValidate.mail" placeholder="请输入邮箱"></h-input>
                        </h-form-item>
                    </h-col>
                    <h-col span="8">     
                        <h-form-item label="城市" prop="city">
                            <h-select v-model="formValidate.city" placeholder="请选择所在地" disabled>
                                <h-option value="beijing">北京市</h-option>
                                <h-option value="shanghai">上海市</h-option>
                                <h-option value="shenzhen">深圳市</h-option>
                            </h-select>
                        </h-form-item>
                    </h-col>
                </h-row>
                <h-row>
                    <h-col span="8">
                        <h-form-item label="下拉树" prop="tree" >
                            <h-select-tree  v-model="formValidate.tree" :data="baseData2"  disabled></h-select-tree>
                        </h-form-item>
                    </h-col>
                    <h-col span="8">
                        <h-form-item label="金额" prop="ty" >
                            <h-typefield   v-model="formValidate.ty" type="money" placeholder="integerNum" disabled></h-typefield>
                        </h-form-item>
                    </h-col>
                    <h-col span="8">
                        <h-form-item label="数字" prop="num1" >
                            <h-input-number   v-model="formValidate.num1" disabled ></h-input-number>
                        </h-form-item>
                    </h-col>
                </h-row>
                <h-row>
                    <h-col span="8">
                        <h-form-item label="选择日期21323" required>
                            <h-row>
                                <h-col span="11">
                                     <h-form-item prop="date"> 
                                        <h-date-picker type="date" placeholder="选择日期" v-model="formValidate.date" disabled></h-date-picker>
                                     </h-form-item> 
                                </h-col>
                                <h-col span="2" style="text-align: center">-</h-col>
                                <h-col span="11">
                                     <h-form-item prop="time"> 
                                        <h-time-picker type="time" placeholder="选择时间" v-model="formValidate.time" disabled></h-time-picker>
                                     </h-form-item> 
                                </h-col>
                            </h-row>
                        </h-form-item>
                    </h-col>
                    <h-col span="8">
                        <h-form-item label="性别" prop="gender">
                            <h-radio-group v-model="formValidate.gender" disabled>
                                <h-radio label="male">男</h-radio>
                                <h-radio label="female">女</h-radio>
                            </h-radio-group>
                        </h-form-item>
                    </h-col>
                    <h-col span="8">
                        <h-form-item label="爱好1232" prop="interest">
                            <h-checkbox-group v-model="formValidate.interest" disabled>
                                <h-checkbox label="吃饭"></h-checkbox>
                                <h-checkbox label="睡觉"></h-checkbox>
                                <h-checkbox label="跑步"></h-checkbox>
                                <h-checkbox label="看电影"></h-checkbox>
                            </h-checkbox-group>
                        </h-form-item>
                    </h-col>
                </h-row>
                <h-row>
                    <h-col span="8">
                        <h-form-item label="介绍" prop="desc">
                            <h-input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></h-input>
                        </h-form-item>
                    </h-col>
                    <h-col span="8">
                        <h-form-item>
                            <h-button type="primary" @click="handleSubmit('formValidate')">提交</h-button>
                            <h-button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</h-button>
                        </h-form-item>
                    </h-col>
                </h-row>
            </h-form>
        </h-row>
        <h2>设置label-width(不设置label-width时会乱掉)</h2>
        <h-row>
             <h-form :model="formItem" :label-width="100" cols="3">
                <h-form-item label="输入框" required>
                    <h-input v-model="formItem.input" placeholder="请输入"></h-input>
                </h-form-item>
                <h-form-item label="选择器" required>
                    <h-select v-model="formItem.select" placeholder="请选择">
                        <h-option value="beijing">北京市</h-option>
                        <h-option value="shanghai">上海市</h-option>
                        <h-option value="shenzhen">深圳市</h-option>
                    </h-select>
                </h-form-item>
                <h-form-item label="日期控件sadsad">
                    <h-row>
                        <h-col span="11">
                            <!-- <h-date-picker type="date" placeholder="选择日期" v-model="formItem.date"></h-date-picker> -->
                            <h-date-picker type="datetime" placeholder="选择日期" v-model="formItem.date" format="yyyy-MM-dd HH:mm:ss"></h-date-picker>
                        </h-col>
                        <h-col span="2" style="text-align: center">-</h-col>
                        <h-col span="11">
                            <h-time-picker type="time" placeholder="选择时间" v-model="formItem.time"></h-time-picker>
                        </h-col>
                    </h-row>
                </h-form-item>
                <h-form-item label="单选框" required>
                    <h-radio-group v-model="formItem.radio">
                        <h-radio label="male">男</h-radio>
                        <h-radio label="female">女</h-radio>
                    </h-radio-group>
                </h-form-item>
                <h-form-item label="多选框" required>
                    <h-checkbox-group v-model="formItem.checkbox">
                        <h-checkbox label="吃饭"></h-checkbox>
                        <h-checkbox label="睡觉"></h-checkbox>
                        <h-checkbox label="跑步"></h-checkbox>
                        <h-checkbox label="看电影"></h-checkbox>
                    </h-checkbox-group>
                </h-form-item>
                <h-form-item label="开关" required>
                    <h-switch v-model="formItem.switch" size="large">
                        <span slot="open">开启</span>
                        <span slot="close">关闭</span>
                    </h-switch>
                </h-form-item>
                <h-form-item label="滑块" required>
                    <h-slider v-model="formItem.slider" range></h-slider>
                </h-form-item>
                <h-form-item label="文本域" required>
                    <h-input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></h-input>
                </h-form-item>
            <h-form-item label="下拉树" required>
                <h-select-tree   :data="baseData2" ></h-select-tree>
                </h-form-item>

            <h-form-item label="金额" required>
                <h-typefield   type="money" placeholder="integerNum" ></h-typefield>
                </h-form-item>

            <h-form-item label="数字" required>
                <h-input-number ></h-input-number>
                </h-form-item>
                <h-form-item>
                    <h-button type="primary" @click="handleSubmit('formItem')">提交</h-button>
                    <h-button type="ghost" style="margin-left: 8px">取消</h-button>
                </h-form-item>
            </h-form>
        </h-row>
        <h2>无label(测试所有表单)</h2>
        <h-row>
             <h-form :model="formItem" cols="3">
                <h-form-item required prop="input">
                    <h-input v-model="formItem.input" placeholder="请输入"></h-input>
                </h-form-item>
                <h-form-item  required prop="select">
                    <h-select v-model="formItem.select" placeholder="请选择">
                        <h-option value="beijing">北京市</h-option>
                        <h-option value="shanghai">上海市</h-option>
                        <h-option value="shenzhen">深圳市</h-option>
                    </h-select>
                </h-form-item>
                <h-form-item required>
                    <h-row>
                        <h-col span="11">
                            <h-date-picker type="date" placeholder="选择日期" v-model="formItem.date"></h-date-picker>
                        </h-col>
                        <h-col span="2" style="text-align: center">-</h-col>
                        <h-col span="11">
                            <h-time-picker type="time" placeholder="选择时间" v-model="formItem.time"></h-time-picker>
                        </h-col>
                    </h-row>
                </h-form-item>
                <h-form-item required  prop="radio">
                    <h-radio-group v-model="formItem.radio">
                        <h-radio label="male">男</h-radio>
                        <h-radio label="female">女</h-radio>
                    </h-radio-group>
                </h-form-item>
                <h-form-item required prop="checkbox">
                    <h-checkbox-group v-model="formItem.checkbox">
                        <h-checkbox label="吃饭"></h-checkbox>
                        <h-checkbox label="睡觉"></h-checkbox>
                        <h-checkbox label="跑步"></h-checkbox>
                        <h-checkbox label="看电影"></h-checkbox>
                    </h-checkbox-group>
                </h-form-item>
                 <h-form-item required prop="textarea">
                    <h-input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></h-input>
                </h-form-item>
                <h-form-item required  prop="switch">
                    <h-switch v-model="formItem.switch" size="large">
                        <span slot="open">开启</span>
                        <span slot="close">关闭</span>
                    </h-switch>
                </h-form-item>
                <h-form-item required prop="slider">
                    <h-slider v-model="formItem.slider" range></h-slider>
                </h-form-item>
                
                <h-form-item required>
                    <h-select-tree  :data="baseData2" ></h-select-tree>
                </h-form-item>

                <h-form-item required>
                    <h-typefield   type="money" placeholder="integerNum" ></h-typefield>
                </h-form-item>

                <h-form-item required>
                    <h-input-number ></h-input-number>
                </h-form-item>
                <h-form-item>
                    <h-button type="primary" @click="handleSubmit('formItem')">提交</h-button>
                    <h-button type="ghost" style="margin-left: 8px">取消</h-button>
                </h-form-item>
            </h-form>
        </h-row> 
        <h2>测试cols中表单排列</h2>
            <h-form :model="formItem" :label-width="100" cols="3">
                <h-form-item label="输入框" required>
                    <h-input v-model="formItem.input" placeholder="请输入"></h-input>
                </h-form-item>
                <h-form-item label="文本域" required>
                    <h-input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></h-input>
                </h-form-item>
                <h-form-item label="选择器" required>
                    <h-select v-model="formItem.select" placeholder="请选择">
                        <h-option value="beijing">北京市</h-option>
                        <h-option value="shanghai">上海市</h-option>
                        <h-option value="shenzhen">深圳市</h-option>
                    </h-select>
                </h-form-item>
                <h-form-item label="日期控件sadsad">
                    <h-row>
                        <h-col span="11">
                            <h-date-picker type="datetime" placeholder="选择日期" v-model="formItem.date" format="yyyy-MM-dd HH:mm:ss"></h-date-picker>
                        </h-col>
                        <h-col span="2" style="text-align: center">-</h-col>
                        <h-col span="11">
                            <h-time-picker type="time" placeholder="选择时间" v-model="formItem.time"></h-time-picker>
                        </h-col>
                    </h-row>
                </h-form-item>
                <h-form-item label="单选框" required>
                    <h-radio-group v-model="formItem.radio">
                        <h-radio label="male">男</h-radio>
                        <h-radio label="female">女</h-radio>
                    </h-radio-group>
                </h-form-item>
                <h-form-item label="多选框" required>
                    <h-checkbox-group v-model="formItem.checkbox">
                        <h-checkbox label="吃饭"></h-checkbox>
                        <h-checkbox label="睡觉"></h-checkbox>
                        <h-checkbox label="跑步"></h-checkbox>
                        <h-checkbox label="看电影"></h-checkbox>
                    </h-checkbox-group>
                </h-form-item>
                <h-form-item label="开关" required>
                    <h-switch v-model="formItem.switch" size="large">
                        <span slot="open">开启</span>
                        <span slot="close">关闭</span>
                    </h-switch>
                </h-form-item>
                <h-form-item label="滑块" required>
                    <h-slider v-model="formItem.slider" range></h-slider>
                </h-form-item>
                <h-form-item label="文本域" required>
                    <h-input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></h-input>
                </h-form-item>
                <h-form-item label="单选框" required>
                    <h-radio-group v-model="formItem.radio">
                        <h-radio label="male">男</h-radio>
                        <h-radio label="female">女</h-radio>
                    </h-radio-group>
                </h-form-item>
                <h-form-item label="文本域" required>
                    <h-input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></h-input>
                </h-form-item>
                <h-form-item label="文本域" required>
                    <h-input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></h-input>
                </h-form-item>
                <h-form-item label="下拉树" required>
                    <h-select-tree   :data="baseData2" ></h-select-tree>
                    </h-form-item>

                <h-form-item label="金额" required>
                    <h-typefield   type="money" placeholder="integerNum" ></h-typefield>
                    </h-form-item>

                <h-form-item label="数字" required>
                    <h-input-number ></h-input-number>
                </h-form-item>
            </h-form>
    </div>
</template>
<script>
    export default {
        data () {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.formCustom.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formCustom.validateField('passwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formCustom.passwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            const validateAge = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('年龄不能为空'));
                }
                // 模拟异步验证效果
                setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        callback(new Error('请输入数字值'));
                    } else {
                        if (value < 18) {
                            callback(new Error('必须年满18岁'));
                        } else {
                            callback();
                        }
                    }
                }, 1000);
            };
            return {
                formValidate: {
                    name: ''
                },
                // ruleValidate: {
                //     name: [
                //         { required: true, message: '姓名不能为空', trigger: 'blur' }
                //     ]
                // },
                formInline: {
                    user: '',
                    password: ''
                },
                formItem: {
                    input: '12',
                    select: 'beijing',
                    radio: '',
                    checkbox: [],
                    switch: true,
                    date: '2018-08-30',
                    time: '01:00:00',
                    slider: [20, 50],
                    textarea: '123'
                },
                 formLeft: {
                    input1: '',
                    input2: '',
                    input3: ''
                },
                formRight: {
                    input1: '',
                    input2: '',
                    input3: ''
                },
                formTop: {
                    input1: '',
                    input2: '',
                    input3: ''
                },
                formValid: {
                    user: '',
                    stringInput:'',
                    password: '',
                    test1: '',
                    test2: ''
                },
                formItemRules: {
                    user: '',
                    password: ''
                },
                formRules: {
                    user: '',
                    password: ''
                },
                formCustom: {
                    passwd: '',
                    passwdCheck: '',
                    age: ''
                },
                formDynamic: {
                    items: [
                        {
                            value: ''
                        }
                    ]
                },
                // stringRule: ['intege1','mobile'],
                stringRule:['email'],
                regRule: [{test:/^[a-zA-Z]+$/, message:'不全是字母',trigger:'blur'}],
                test1Rule: [{test: validFunc, trigger:'blur'}],
                test2Rule: [
                    'required', 
                    {test:/^[a-zA-Z]+$/, message:'不全是字母',trigger:'blur'},
                    {test: validFunc, trigger:'blur'}
                ],
                ruleInline: {
                    user: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ]
                },
                userValid: [
                    {
                      validator(rule, value, callback) {
                        setTimeout(() => {
                          callback([new Error(rule.message)]);
                        }, 100);
                      },
                      message: 'async fails',
                    },
                     // { required: true, message: '请输入用户名', trigger: 'blur' },
                     // { type: 'string', min: 20, message: '介绍不能少于20字', trigger: 'change' }
                ],
                
                ruleCustom: {
                    passwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    age: [
                        { validator: validateAge, trigger: 'blur' }
                    ]
                },
                baseData2: [{
                expand: true,
                title: 'parent 1',
                children: [{
                  title: 'parent 1-0',
                  expand: true,
                  children: [{
                    title: 'leaf'
                  }, {
                    title: 'leaf',
                  }]
                }, {
                  title: 'parent 1-1',
                  expand: true,
                  checked: true,
                  children: [{
                    title: 'leaf',
                  }]
                }]
            }],
                formValidate: {
                    name: '',
tree:'',
                    mail: '',
                    city: '',
                    gender: '',
                    interest: [],
                    date: '',
                    time: '',
                    desc: '',
                    ty: '',
                    num1: 1
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
tree: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
num1: [
                        { required: true, message: '数字不能为空不能为空', trigger: 'blur' }
                    ],
ty: [
                        { required: true, message: '金额不能为空', trigger: 'blur' }
                    ],
                    mail: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    city: [
                        { required: true, message: '请选择城市', trigger: 'change' }
                    ],
                    gender: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    interest: [
                        { required: true, type: 'array', min: 1, message: '至少选择一个爱好', trigger: 'change' },
                        { type: 'array', max: 2, message: '最多选择两个爱好', trigger: 'change' }
                    ],
                    date: [
                        { required: true, type: 'date', message: '请选择日期', trigger: 'blur' }
                    ],
                    time: [
                        { required: true, type: 'date', message: '请选择时间', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: '请输入个人介绍', trigger: 'blur' },
                        { type: 'string', min: 20, message: '介绍不能少于20字', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {            
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$hMessage.success('提交成功!');
                    } else {
                        this.$hMessage.error('表单验证失败!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            handleAdd () {
                this.formDynamic.items.push({
                    value: ''
                });
            },
            handleRemove (index) {
                this.formDynamic.items.splice(index, 1);
            }
        }
    }
function validFunc(rule, val, callback) {
  if(val == 'test'){
    callback()
  }else{
    callback(new Error("不是test"))
  }
}
</script>