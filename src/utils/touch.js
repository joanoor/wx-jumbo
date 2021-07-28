var touchStartX = 0                   //触摸时的原点 
var touchStartY = 0                   //触摸时的原点 
var time = 0                          // 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = ""                     // 记录/清理时间记录 
var touchMoveX = 0                    // x轴方向移动的距离
var touchMoveY = 0                    // y轴方向移动的距离

/**
 * 触摸开始，以call或apply的方式调用
 * @param { Object } e是触发事件得到的参数
 */
const touchStart = e => {
  console.log('开始触摸', e)
  touchStartX = e.touches[0].pageX                            // 获取触摸时的原点 
  touchStartY = e.touches[0].pageY                            // 获取触摸时的原点 
  interval = setInterval(function () {                        // 使用js计时器记录时间  
    time++;
  }, 100);
}

/**
 * 触摸移动，以call或apply的方式调用
 * @param { Object } e是触发事件得到的参数
 */
const touchMove = e => {
  console.log('触摸移动', e)
  touchMoveX = e.touches[0].pageX;
  touchMoveY = e.touches[0].pageY;
}

/**
 * 触摸结束，以call或apply的方式调用
 * @param { Object } e是触发事件得到的参数
 */
const touchEnd = e => {
  console.log('触摸结束', e)
  var moveX = touchMoveX - touchStartX
  var moveY = touchMoveY - touchStartY
  if (Math.sign(moveX) == -1) {
    moveX = moveX * -1
  }
  if (Math.sign(moveY) == -1) {
    moveY = moveY * -1
  }
  if (moveX <= moveY) {                                       // 判断上下滑动
    if (touchMoveY - touchStartY <= -120 && time < 10) {
      console.log("向上滑动")
      this._slidestatus = '向上滑动'
    }
    if (touchMoveY - touchStartY >= 120 && time < 10) {
      console.log('向下滑动 ');
      this._slidestatus = '向下滑动'
    }
  } else {                                                    // 判断左右滑动
    if (touchMoveX - touchStartX <= -120 && time < 10) {
      console.log("向左滑动")
      this._slidestatus = '向左滑动'
    }
    if (touchMoveX - touchStartX >= 120 && time < 10) {
      console.log('向右滑动');
      this._slidestatus = '向右滑动'
    }
  }
  touchMoveX = 0
  touchMoveY = 0
  clearInterval(interval); // 清除setInterval 
  time = 0;
}

module.exports = {
  touchStart,
  touchMove,
  touchEnd
}