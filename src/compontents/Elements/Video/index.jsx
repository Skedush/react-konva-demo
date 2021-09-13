import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Image } from 'react-konva';
import { useAnimation } from '../../../utils/myhooks';
import * as filter from '../../../utils/myFilter';
function Video(props) {
  const {
    x,
    y,
    width,
    height,
    play,
    src,
    speed,
    onSeeked,
    visible,
    duration,
    jump,
    time,
    jumpTime,
    animation,
  } = props;
  const video = useRef();
  const image = useRef();
  const [loaded, setLoaded] = useState(false);

  useMemo(() => {
    if (!loaded) return;
    video.current.playbackRate = speed;
  }, [loaded, speed]);

  useEffect(() => {
    const el = document.createElement('video');
    el.src = src;
    el.preload = 'auto';
    el.playbackRate = speed;
    el.addEventListener('loadedmetadata', function () {
      setLoaded(true);
    });
    el.addEventListener('seeking', function () {
      onSeeked(false);
    });
    el.addEventListener('seeked', function () {
      onSeeked(true);
    });
    video.current = el;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 跳转态时设置组件为加载中状态并设置video的进度
  useEffect(() => {
    if (jump) {
      onSeeked(false);
      if (jumpTime >= 0 && jumpTime < duration) {
        video.current.currentTime = jumpTime / 1000;
      } else {
        onSeeked(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jump, jumpTime]);

  useEffect(() => {
    if (!loaded) return;
    if (play && visible) {
      video.current.play();
    } else if (!play && visible) {
      video.current.pause();
    } else {
      video.current.currentTime = 0;
      video.current.pause();
    }
  }, [play, loaded, visible]);

  // 动画
  useAnimation({
    type: animation?.type,
    isChangeFrame: true,
    play,
    speed,
    time,
    node: image.current,
    jump,
    visible,
    duration: animation?.duration / speed,
  });

  return (
    <Image
      visible={visible}
      ref={image}
      image={video.current}
      filters={[filter[animation?.type]]}
      x={x}
      y={y}
      width={width}
      height={height}
    />
  );
}
export default Video;
