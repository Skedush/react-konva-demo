import React, { useRef, useEffect } from 'react';
import { Image as RImage } from 'react-konva';
import * as filter from '../../../utils/myFilter';

import { useAnimation } from '../../../utils/myhooks';
function Image(props) {
  const {
    x,
    y,
    width,
    height,
    src,
    speed,
    onSeeked,
    visible,
    jump,
    play,
    time,
    animation,
  } = props;
  const img = useRef();
  const image = useRef();

  useEffect(() => {
    const el = document.createElement('img');
    el.src = src;
    el.onload = () => {
      img.current = el;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 跳转态时设置组件为加载中状态，由于image目前没有加载中状态，暂时无效果
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
    isChangeFrame: false,
    play,
    speed,
    time,
    node: image.current,
    jump,
    visible,
    duration: animation?.duration / speed,
  });

  return (
    <RImage
      visible={visible}
      ref={image}
      filters={[filter[animation?.type]]}
      image={img.current}
      x={x}
      y={y}
      width={width}
      height={height}
    />
  );
}
export default Image;
