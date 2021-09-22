import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Text as KText, Rect } from 'react-konva';
import { useAnimation } from '../../../utils/myhooks';
import * as filter from '../../../utils/myFilter';

// eslint-disable-next-line max-lines-per-function
function Text(props) {
  const [content, setContent] = useState();
  const rect = useRef();
  const ktext = useRef();
  const {
    backColor, // 背景颜色
    font,
    height,
    visible,
    width,
    x,
    y,
    text,
    jump,
    onSeeked,
    onLoaded,
    play,
    speed,
    time,
    animation,
  } = props;
  const { align, color, size: fontSize } = font; // align:对齐方式[3 x 3矩阵]   fspace:水平间距   lspace:竖直间距   name:字体
  const alignArr = {
    0: ['left', 'top'],
    1: ['left', 'middle'],
    2: ['left', 'bottom'],
    3: ['center', 'top'],
    4: ['center', 'middle'],
    5: ['center', 'bottom'],
    6: ['right', 'top'],
    7: ['right', 'middle'],
    8: ['right', 'bottom'],
  };

  const newAlign = alignArr[align];

  useEffect(() => {
    onLoaded(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    setContent(text);
  }, [visible, text]);

  // 跳转态时设置组件为加载中状态，由于text目前没有加载中状态，暂时无效果
  useEffect(() => {
    if (jump) {
      onSeeked(false);
      onSeeked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jump]);

  // 动画
  useAnimation({
    type: animation?.type,
    isChangeFrame: true,
    play,
    speed,
    time,
    node: ktext.current,
    jump,
    visible,
    duration: animation?.duration / speed,
  });

  // 动画
  useAnimation({
    type: animation?.type,
    isChangeFrame: false,
    play,
    speed,
    time,
    node: rect.current,
    jump,
    visible,
    duration: animation?.duration / speed,
  });

  return (
    <Fragment>
      <Rect
        visible={visible}
        ref={rect}
        fill={`rgb(${backColor.join(',')})`}
        x={x}
        filters={[filter[animation?.type]]}
        y={y}
        width={width}
        height={height}
      />
      <KText
        visible={visible}
        ref={ktext}
        text={content}
        x={x}
        filters={[filter[animation?.type]]}
        y={y}
        width={width}
        height={height}
        fontSize={fontSize}
        fill={`rgb(${color.join(',')})`}
        align={newAlign[0]}
        verticalAlign={newAlign[1]}
      />
    </Fragment>
  );
}

export default Text;
