## Vue构造函数的生成

版本：@2.6.10

环境：web ;

思维图：https://www.processon.com/view/link/5efc60aa6376891e81f3d350

------

```typescript
将公用方法注册到Vue.prototype上，这样可以在每个实例上调用公用方法;
```

### ①在src/core/instance/index.js中的增强：

将公用方法注册到prototype上，在实例中通用，

------

```javascript
`混入初始化的操作`
initMixin(Vue)
	//增加 Vue.prototype._init()函数
```

```javascript
`混入数据操作`将数据挂到prototype上
stateMixin(Vue)
	//Vue.prototype.$data
	//Vue.prototype.$props
	//Vue.prototype.$set
	//Vue.prototype.$delete
	//Vue.prototype.$watch
```

```javascript
`混入事件操作`
eventsMixin(Vue)
	//Vue.prototype.$on
	//Vue.prototype.$once
	//Vue.prototype.$off
	//Vue.prototype.$emit
```

```javascript
`混入生命周期操作`
lifecycleMixin(Vue)
	//Vue.prototype._update
	//Vue.prototype.$forceUpdate
	//Vue.prototype.$destroy
```

```javascript
`混入渲染操作`
renderMixin(Vue)
	//Vue.prototype.$nextTick
	//Vue.prototype._render

	// Vue.prototype._o = markOnce
  	// Vue.prototype._n = toNumber
  	// Vue.prototype._s = toString
 	// Vue.prototype._l = renderList
    // Vue.prototype._t = renderSlot
    // Vue.prototype._q = looseEqual
    // Vue.prototype._i = looseIndexOf
    // Vue.prototype._m = renderStatic
    // Vue.prototype._f = resolveFilter
    // Vue.prototype._k = checkKeyCodes
    // Vue.prototype._b = bindObjectProps
    // Vue.prototype._v = createTextVNode
    // Vue.prototype._e = createEmptyVNode
    // Vue.prototype._u = resolveScopedSlots
    // Vue.prototype._g = bindObjectListeners
    // Vue.prototype._d = bindDynamicKeys
    // Vue.prototype._p = prependModifier
```
