import React, { useState, useRef, useEffect } from 'react';
import { Image } from 'react-konva';

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
    jumpTime,
  } = props;
  const video = useRef();
  const image = useRef();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    video.current.playbackRate = speed;
  }, [speed]);

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
  }, []);

  // TODO
  // 当jump变为true时才触发，导致在跳转态持续中的跳转无效
  useEffect(() => {
    if (jump) {
      onSeeked(false);
      if (jumpTime >= 0 && jumpTime < duration) {
        video.current.currentTime = jumpTime / 1000;
      } else {
        onSeeked(true);
      }
    }
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

  return (
    <Image
      visible={visible}
      ref={image}
      image={video.current}
      x={x}
      y={y}
      width={width}
      height={height}
    />
  );
}
export default Video;
