import React, { useEffect, useState, Fragment } from 'react';
import * as Elements from '../Elements';

const Scene = ({
  scene,
  time,
  play,
  speed,
  onSeeked: onSceneSeeked,
  onLoaded: onSceneLoaded,
  visible,
  jump,
  jumpTime,
  timeSum,
}) => {
  const [seeked, setSeeked] = useState(scene.map(() => true)); //子组件的seeked状态
  const [loaded, setLoaded] = useState(scene.map(() => false)); //子组件的seeked状态

  // 根据type值渲染不同组件
  const getContainer = (type) => {
    let key = type.trim().toLowerCase().replace(type[0], type[0].toUpperCase());
    return Elements[key];
  };

  // 子组件通过此函数改变子组件的seeked状态
  const onSeeked = (val, index) => {
    setSeeked((seeked) => {
      const cloneSeeked = [...seeked];
      cloneSeeked[index] = val;
      return cloneSeeked;
    });
  };

  // 子组件通过此函数改变子组件的seeked状态
  const onLoaded = (val, index) => {
    setLoaded((loaded) => {
      const cloneLoaded = [...loaded];
      cloneLoaded[index] = val;
      return cloneLoaded;
    });
  };

  // 当jump变为true时，将自身场景的seeked设成false
  useEffect(() => {
    if (jump) {
      onSceneSeeked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seeked]);

  // 当自身场景下的所有组件loaded都为true时，将自身场景loaded设成true
  useEffect(() => {
    const isLoading = loaded.some((state) => {
      return state === false;
    });
    if (!isLoading) {
      onSceneLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  return (
    <Fragment>
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
              onLoaded={(val) => onLoaded(val, index)}
              play={play}
              timeSum={timeSum}
              time={time}
              speed={speed}
            />
          );
        })}
    </Fragment>
  );
};

export default Scene;
