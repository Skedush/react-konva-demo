import React, { useState, useRef, useEffect } from 'react';
import { Image as RImage } from 'react-konva';

function Image(props) {
  const { x, y, width, height, src, speed, onSeeked, visible, jump } = props;
  const video = useRef();
  const image = useRef();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    video.current.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    const el = document.createElement('img');
    el.src = src;
    el.onload = () => {
      setLoaded(true);
      video.current = el;
    };
  }, []);

  useEffect(() => {
    if (jump) {
      onSeeked(false);
      onSeeked(true);
    }
  }, [jump]);

  return (
    <RImage
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
export default Image;
