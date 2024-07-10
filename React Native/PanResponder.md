# PanResponder

手势响应系统。

回调函数参数:evt, gestureState。

- nativeEvent 原生事件
- gestureState 手势状态

## 捕获/冒泡

手势系统是基于捕获冒泡机制的。

## gestureState

```jsx
{
	stateID, //
    moveX,   // 最近一次移动时的屏幕横坐标
    moveY,// 最近一次移动时的屏幕纵坐标
    x0, //      当响应器产生时的屏幕横坐标
    y0,//   当响应器产生时的屏幕纵坐标
    dx, // 触摸操作开始时的累计横向路程
    dy,  // 触摸操作开始时的累计纵向路程
    vx, // 当前的横向移动速度
    vy, // 当前的纵向移动速度
    numberActiveTouches, 当前屏幕上的有效触摸点的数量
}
```

## 1.申请成为响应者

### onStartShouldSetPanResponder

()=>boolean

- 用户开始触摸屏幕(手指刚接触屏幕)时，系统询问当前组件是否愿意成为响应者
- 返回true，表示当前组件愿意成为响应者，将开始响应触摸事件
- 返回false，则不会成为响应者，其他组件有机会成为响应者
- 通常用于判断用户是否点击了某个组件

### onStartShouldSetPanResponderCapture

捕获阶段的 onStartShouldSetPanResponder

### onMoveShouldSetPanResponder

()=>boolean

- 如果当前组件不是响应者，那么在每一个触摸点开始移动(没有停下也没有离开屏幕)时，系统会再次询问当前组件是否愿意响应触摸交互
- 返回true，表示当前组件愿意响应触摸事件
- 返回false，不会成为响应者，其他组件有机会成为响应者
- 通常用于判断用户是否滑动了某个组件。

### onMoveShouldSetPanResponderCapture

捕获阶段的onMoveShouldSetPanResponder

## 2.告知申请结果

### onPanResponderGrant

- 当用户开始触摸屏幕并成为当前组件的响应者时,系统会调用这个回调
- 可以执行一些初始化操作，例如设置状态，更新UI或者执行其他逻辑

### onPanResponderReject

- 申请失败，意味着其他组件正在进行事件处理，并且不想放弃事件处理，后续输入事件不会传递给本组件

## 3.组件成为了响应者

### onPanResponderStart

- 手指按下时，成功申请成为事件响应者的回调

### onPanResponderMove

- 触摸手指移动的回调

### onPanResponderEnd

- 事件结束

### onPanResponderRelease

- 触摸完成(touchUP)时的回调，表示用户完成了本次触摸交互。
- 这里应该完成手势识别的处理
- 之后组件不是事件响应者，组件取消激活

## 4.响应权限的争夺

### onPanResponderTerminationRequest

- 是否将放弃响应权限的争夺

### onPanResponderTerminate

- 释放响应权限后的回调。
- 通知组件响应事件被终止