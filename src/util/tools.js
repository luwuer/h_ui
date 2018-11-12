import Vue from 'vue';
const isServer = Vue.prototype.$isServer;
//判断变量类型
// 注：typeof及instanceof仅针对简单变量
function is(type, val) {
  if (val && val != '') {
    return Object.prototype.toString.call(val) === ("[object " + type + "]");
  }
}
export { is };
// 查找组件的父组件
function findComponentParent(content, componentName, componentNames) {
  if (is("String", componentName)) {
    componentNames = [componentName]
  } else {
      componentNames = componentName
  }
  let parent = content.$parent;
  let name = parent.$options.name;
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent;
    if (parent) {
        name = parent.$options.name;
    }
  }
  return parent
}
export { findComponentParent };
// 查找子组件
function findComponentChildren(content, componentName) {
  let childrens = content.$children;
  let children = null;
  if (childrens.length) {
    for (let i = 0; i < childrens.length; i++) {
      const child = childrens[i];
      const name = child.$options.name
      if (name === componentName) {
        children = child
          break
      } else {
        children = findComponentChildren(child, componentName);
        if (children) break;
      }
    }
  }
  return children;
}
export { findComponentChildren }
// 查找所有子组件
function findComponentsChildren(content, componentName) {
  let childrens = content.$children;
  let childrenComponents = [];
  if (childrens.length) {
    childrens.forEach(child => {
      let name = child.$options.name
      if (name === componentName) {
          childrenComponents.push(child)
      }
      let childCh = child.$children
      if (childCh.length) {
        let findChildCh = findComponentsChildren(child, componentName)
        if (findChildCh) {
            childrenComponents.concat(findChildCh)
        }
      }
    })
  }
    return childrenComponents
}
export { findComponentsChildren }

export function createSimpleFunctional (c, el = 'div') {
  return {
    functional: true,

    render: (h, { data, children }) => {
      data.staticClass = data.staticClass ? `${c} ${data.staticClass}` : c
      return h(el, data, children)
    }
  }
}

export function directiveConfig (binding, defaults = {}) {
  return Object.assign(
    defaults,
    binding.modifiers,
    { value: binding.arg },
    binding.value || {}
  )
}

export function closest (className) {
  let parent = this.$parent

  while(parent) {
    if (!parent.$el) {
      return null
    }
    
    if (parent.$el.classList.contains(className)) {
      return parent
    }

    parent = parent.$parent
  }

  return null
}

export function addOnceEventListener (el, event, cb) {
  var once = () => {
    cb()
    el.removeEventListener(event, once, false)
  }
  
  el.addEventListener(event, once, false)
}

//浏览器兼容
export function addHandler(ele,eType,handler) {
  if (ele.addEventListener) {
    ele.addEventListener(eType,handler,false);
  }else{
    ele.attachEvent("on" + eType,handler);
  }
}
export function removeHandler(ele,eType,handler) {
  if (ele.removeEventListener) {
    ele.removeEventListener(eType,handler,false);
  }else{
    ele.detachEvent("on" + eType,handler);
  }
}
export function removeDom(obj) {
  try{
    obj.remove();
  }catch(e){
    obj.removeNode(true);
  }
}
// 判断参数是否是其中之一
export function oneOf (value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true;
        }
    }
    return false;
}
//判断是否是数字
function isValueNumber (value) {
  return (/(^-?[0-9]+\.{1}\d+$)|(^-?[1-9][0-9]*$)|(^-?0{1}$)/).test(value + '');
}
export function arrContains(arr, obj) {  
  var i = arr.length;  
    while (i--) {  
      if (arr[i] === obj) {  
          return true;  
      }  
    }  
  return false;  
} 

// firstUpperCase
function firstUpperCase(str) {
  return str.toString()[0].toUpperCase() + str.toString().slice(1);
}
// scrollTop animation
export function scrollTop(el, from = 0, to, duration = 500) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000/60);
        }
    );
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil(difference / duration * 50);

  function scroll(start, end, step) {
    if (start === end) return;

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
        d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
        window.scrollTo(d, d);
    } else {
        el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  }
  scroll(from, to, step);
}
export {firstUpperCase};

// watch DOM change
export const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || false;

const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;

function camelCase(name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
}
//for slide
// getStyle
export function getStyle (element, styleName) {
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
      styleName = 'cssFloat';
  }
  try {
    const computed = document.defaultView.getComputedStyle(element, '');
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch(e) {
    return element.style[styleName];
  }
}

// For notice 
export function camelcaseToHyphen (str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
// For MsgBox scrollBar hidden
let cached;
export function getScrollBarSize (fresh) {
  if (isServer) return 0;
  if (fresh || cached === undefined) {
    const inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '200px';

    const outer = document.createElement('div');
    const outerStyle = outer.style;

    outerStyle.position = 'absolute';
    outerStyle.top = 0;
    outerStyle.left = 0;
    outerStyle.pointerEvents = 'none';
    outerStyle.visibility = 'hidden';
    outerStyle.width = '200px';
    outerStyle.height = '150px';
    outerStyle.overflow = 'hidden';

    outer.appendChild(inner);

    document.body.appendChild(outer);
    //clientWidth是对象看到的宽度（不含边线,即border）
    // scrollWidth是对象实际内容的宽度（不含边线和padding）。
    // offsetWidth是指对象自身的宽度，整型，单位像素（含边线，如滚动条等）。
    const widthContained = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    let widthcroll = inner.offsetWidth;

    if (widthContained === widthcroll) {
        widthcroll = outer.clientWidth;
    }

    document.body.removeChild(outer);

    cached = widthContained - widthcroll;
  }
  return cached;
}
function typeOf(obj) {
  const toString = Object.prototype.toString;
  const map = {
    '[object Boolean]'  : 'boolean',
    '[object Number]'   : 'number',
    '[object String]'   : 'string',
    '[object Function]' : 'function',
    '[object Array]'    : 'array',
    '[object Date]'     : 'date',
    '[object RegExp]'   : 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]'     : 'null',
    '[object Object]'   : 'object'
  };
  return map[toString.call(obj)];
}
export {typeOf};
// deepCopyEx
function deepCopyEx (data, exAttr) {
  const t = typeOf(data);
  let o;
  if (t === 'array') {
    o = [];
  } else if ( t === 'object') {
    o = {};
  } else {
    return data;
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]));
    }
  } else if ( t === 'object') {
    for (let i in data) {
      if (exAttr.indexOf(i) < 0) o[i] = deepCopyEx(data[i], exAttr);
    }
  }
  return o;
}
export {deepCopyEx};
// deepCopy
function deepCopy(data) {
  const t = typeOf(data);
  let o;

  if (t === 'array') {
    o = [];
  } else if ( t === 'object') {
    o = {};
  } else {
    return data;
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]));
    }
  } else if ( t === 'object') {
    for (let i in data) {
      o[i] = deepCopy(data[i]);
    }
  }
  return o;
}

export {deepCopy};
// Find components upward
function findComponentsUpward (context, componentName, componentNames) {
  if (typeof componentName === 'string') {
    componentNames = [componentName];
  } else {
    componentNames = componentName;
  }

  let parent = context.$parent;
  let name = parent.$options.name;
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent;
    if (parent) name = parent.$options.name;
  }
  return parent;
}
export {findComponentsUpward};
// Find components downward
// Find component downward
export function findComponentDownward (context, componentName) {
    const childrens = context.$children;
    let children = null;

    if (childrens.length) {
        for (const child of childrens) {
            const name = child.$options.name;
            if (name === componentName) {
                children = child;
                break;
            } else {
                children = findComponentDownward(child, componentName);
                if (children) break;
            }
        }
    }
    return children;
}

// Find components downward
export function findComponentsDownward (context, componentName) {
    return context.$children.reduce((components, child) => {
        if (child.$options.name === componentName) components.push(child);
        const foundChilds = findComponentsDownward(child, componentName);
        return components.concat(foundChilds);
    }, []);
}


/* istanbul ignore next */
export function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
};
/* istanbul ignore next */
export function addClass(el, cls) {
    if (!el) return;
    let curClass = el.className;
    const classes = (cls || '').split(' ');

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.add(clsName);
        } else {
            if (!hasClass(el, clsName)) {
                curClass += ' ' + clsName;
            }
        }
    }
    if (!el.classList) {
        el.className = curClass;
    }
}

/* istanbul ignore next */
export function removeClass(el, cls) {
    if (!el || !cls) return;
    const classes = cls.split(' ');
    let curClass = ' ' + el.className + ' ';

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.remove(clsName);
        } else {
            if (hasClass(el, clsName)) {
                curClass = curClass.replace(' ' + clsName + ' ', ' ');
            }
        }
    }
    if (!el.classList) {
        el.className = trim(curClass);
    }
}
export function findInx(arr,fun) {
  if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
      value: function(predicate) {
       // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return k.
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) {
            return k;
          }
          // e. Increase k by 1.
          k++;
        }

        // 7. Return -1.
        return -1;
      }
    });
  }
  return arr.findIndex(fun);
}
export function toFix(d){
  // number.prototype.toFixed = function(d){
    var s=this+"";
    if(!d)d=0;
    if(s.indexof(".")==-1)s+=".";
    s+=new array(d+1).join("0");
    if (new regexp("^(-|\\+)?(\\d+(\\.\\d{0,"+ (d+1) +"})?)\\d*$").test(s))
    {
      var s="0"+ regexp.$2, pm=regexp.$1, a=regexp.$3.length, b=true;
      if (a==d+2){
        a=s.match(/\d/g); 
        if (parseint(a[a.length-1])>4){
          for(var i=a.length-2; i>=0; i--) {
            a[i] = parseint(a[i])+1;
            if(a[i]==10){
              a[i]=0; b=i!=1;
            }
            else break;
          }
        }
        s=a.join("").replace(new regexp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");
      }
      if(b)s=s.substr(1);
      return (pm+s).replace(/\.$/, "");
    } 
    return this+"";
  // };  
}
function vliData(num) {
  return num>=10?num:'0'+num;
}
export function getYMD(data,str,num){
  data.setDate(data.getDate() + num);
  let Y = data.getFullYear();
  let M = vliData(data.getMonth()+1);
  let D = vliData(data.getDate());
  return Y+str+M+str+D;
}
export function getHMS(data){
  let H = vliData(data.getHours());
  let M = vliData(data.getMinutes());
  let S = vliData(data.getSeconds());
  return H+':'+M+":"+S;
}
export function getCurrentYear(){
  let date = new Date()
  return date.getFullYear();
}
export function getCurrentMonth(){
  let date = new Date()
  return vliData(date.getMonth()+1);
}
export function getCurrentDay(){
  let date = new Date()
  return vliData(date.getDate());
}

export function getBarBottom(obj,barWidth) {
  let width = obj.getBoundingClientRect().width;
  let conentWidth = obj.scrollWidth;
  let height = obj.getBoundingClientRect().height;
  let top = obj.scrollTop;
  let sheight =conentWidth+barWidth>width?height-barWidth:height;
  let conentHeight = obj.scrollHeight;
  return conentHeight-top-sheight;
}

export function formatnumber(fnumber,fdivide,fpoint,fround){
  var fnum = fnumber + '';
  var revalue="";
  if(fnum==null){
    for(var i=0;i<fpoint;i++)revalue+="0";
    return "0."+revalue;
  }
  fnum = fnum.replace(/^sall|sall$/g,'');
  if(fnum==""){
    for(var i=0;i<fpoint;i++)revalue+="0";
    return "0."+revalue;
  }
  fnum=fnum.replace(/,/g,"");
  if(fround){
    var temp = "0.";
    for(var i=0;i<fpoint;i++)temp+="0";
    temp += "5";
    fnum = Number(fnum) + Number(temp);
    fnum += '';
  }
  var arrayf=fnum.split(".");
  if(fdivide){
    if(arrayf[0].length>3){
      while(arrayf[0].length>3){
        revalue=","+arrayf[0].substring(arrayf[0].length-3,arrayf[0].length)+revalue;
        arrayf[0]=arrayf[0].substring(0,arrayf[0].length-3);
      }
    }
  }
  revalue=arrayf[0]+revalue;
  if(arrayf.length==2&&fpoint!=0){
    arrayf[1]=arrayf[1].substring(0,(arrayf[1].length<=fpoint)?arrayf[1].length:fpoint);
    if(arrayf[1].length<fpoint)
    for(var i=0;i<fpoint-arrayf[1].length;i++)arrayf[1]+="0";
    revalue+="."+arrayf[1];
  }else if(arrayf.length==1&&fpoint!=0){
    revalue+=".";
  for(var i=0;i<fpoint;i++)revalue+="0";
  }
  return revalue;
}

export function isdate(intYear,intMonth,intDay){ 
 if(isNaN(intYear)||isNaN(intMonth)||isNaN(intDay)) return false;   
 if(intMonth>12||intMonth<1) return false; 
 if ( intDay<1||intDay>31)return false; 
 if((intMonth==4||intMonth==6||intMonth==9||intMonth==11)&&(intDay>30)) return false; 
 if(intMonth==2){ 
   if(intDay>29) return false;  
   if((((intYear%100==0)&&(intYear%400!=0))||(intYear%4!=0))&&(intDay>28))return false; 
  }
 return true; 
}
let timer 
// 滚动公用方法
export function scrollAnimate(obj,curTop,newTop){
  let status=curTop<newTop?true:false;
  let offset = Math.abs(Number(curTop-newTop))
  let ins = 500/offset>1?1:500/offset;
  clearInterval(timer);
  timer = setInterval(()=>{
    curTop = status?curTop+1:curTop-1;
    obj.scrollTop = curTop;
    if (curTop==newTop) {
      clearInterval(timer);
    }
  },ins);
}