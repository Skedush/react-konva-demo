import React, { useRef, useEffect, useState } from 'react';
import { Layer } from 'react-konva';
import * as Elements from '../Elements';
import Konva from 'konva';

const Scene = ({
  scene,
  time,
  play,
  speed,
  onSeeked: onSceneSeeked,
  visible,
  jump,
  jumpTime,
}) => {
  const layer = useRef();
  const [seeked, setSeeked] = useState(scene.map(() => true)); //子组件的seeked状态
  useEffect(() => {
    const anim = new Konva.Animation(() => {}, layer.current);
    anim.start();
  }, []);

  // 根据type值渲染不同组件
  const getContainer = (type) => {
    let key = type.trim().toLowerCase().replace(type[0], type[0].toUpperCase());
    return Elements[key];
  };

  // 子组件通过这函数改变子组件的seeked状态
  const onSeeked = (val, index) => {
    setSeeked((seeked) => {
      const cloneSeeked = [...seeked];
      cloneSeeked[index] = val;
      return cloneSeeked;
    });
  };

  // 当jump变为true时，将自身场景的seeked设成false
  useEffect(() => {
    if (jump) {
      onSceneSeeked(false);
    }
  }, [jump]);

  // 当自身场景下的所有组件seeked都为true时，将自身场景seeked设成true
  useEffect(() => {
    const isSeeking = seeked.some((state) => {
      return state === false;
    });
    if (!isSeeking) {
      onSceneSeeked(true);
    } else {
      onSceneSeeked(false);
    }
  }, [seeked]);

  return (
    <Layer
      visible={visible}
      ref={(element) => {
        layer.current = element;
      }}
    >
      {scene &&
        scene.map((item, index) => {
          const Container = getContainer(item.type);
          return (
            <Container
              visible={time >= 0 && time < item.duration && visible}
              key={index}
              jump={jump}
              jumpTime={jumpTime}
              {...item}
              onSeeked={(val) => onSeeked(val, index)}
              play={play}
              speed={speed}
            />
          );
        })}
    </Layer>
  );
};

export default Scene;
