import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Stage } from 'react-konva';
import Scene from '../Scene';
import Slider from '../Slider';
import './index.css';

const useInterval = (callback, play, delay) => {
  const saveCallback = useRef(callback);
  useEffect(() => {
    saveCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    let timer;
    if (play && delay) {
      timer = setInterval(() => saveCallback.current(), delay);
    }
    return () => {
      clearInterval(timer); // 取消定时器；
    };
  }, [play, delay]);
};

// eslint-disable-next-line max-lines-per-function
function Control(props) {
  const DELAY = 1000 / 60; //计时器毫秒数

  const [cleanData, setCleanData] = useState(null); //播放数据
  const [time, setTime] = useState(0); //播放进度以时间毫秒计数
  const [speed, setSpeed] = useState(1); //播放速度
  const [seeked, setSeeked] = useState([]); //场景的seeked状态数组
  const [jump, setJump] = useState(false); //跳转态，true为跳转中，false则是正常播放或者暂停
  const [jumpTime, setJumpTime] = useState(0); //跳转时间
  const [play, setPlay] = useState(false); //播放状态
  const [nowSceneIndex, setNowSceneIndex] = useState(0); //正在播放场景的index
  const [scenesDuration, setScenesDuration] = useState(null); //各个场景时长数组，毫秒为单位
  const [scenesDurationSum, setScenesDurationSum] = useState(null); //场景总时长

  const stage = useRef();

  const { data } = props;

  //清洗数据
  const getCleanData = (data) => {
    if (!data) return;
    const scenes = data.info.scenes.map((scene) => {
      return scene.items.map((item) => {
        const cloneItem = { ...item };
        if (cloneItem.type === 'datetime') {
          cloneItem.dateLabel = cloneItem.params.dateLabel;
          cloneItem.timeLabel = cloneItem.params.timeLabel;
          cloneItem.timeFormat = cloneItem.params.timeFormat;
          cloneItem.dateFormat = cloneItem.params.dateFormat;
        }
        if (cloneItem.params) {
          cloneItem.src = cloneItem.params.file;
          cloneItem.font = cloneItem.params.font;
          cloneItem.text = cloneItem.params.content;
          cloneItem.transition = cloneItem.params.transition;
          cloneItem.playMode = cloneItem.params.playMode;
          cloneItem.backColor = cloneItem.params.backColor;
          cloneItem.duration = cloneItem.params.duration;
        }
        delete cloneItem.params;
        return cloneItem;
      });
    });
    return { width: data.width, height: data.height, scenes };
  };

  //清洗数据
  useMemo(() => {
    const cleanData = getCleanData(data);
    setCleanData(cleanData);
    setSeeked(cleanData.scenes.map(() => true));
  }, [data]);

  //获取各个场景的duration数组
  useMemo(() => {
    const scenesStatistics = data.info.scenes.map((scene) => {
      const durationArray = scene.items.map((item) => item.params.duration);
      return Math.max(...durationArray);
    });
    setScenesDuration(scenesStatistics);
    setScenesDurationSum(scenesStatistics.reduce((pre, cur) => pre + cur));
  }, [data]);

  //根据各个场景的duration与目前的time得到当前场景的index
  const getSceneIndex = (time) => {
    let factDuration = 0;
    let index;
    for (let i = 0; i < scenesDuration.length; i++) {
      factDuration += scenesDuration[i];
      if (time - factDuration < 0) {
        index = i;
        break;
      }
    }
    return index;
  };

  useEffect(() => {
    setNowSceneIndex(getSceneIndex(time));
  }, [time, scenesDuration]);

  // 播放计时，使用setInterval实现
  useInterval(
    () => {
      if (time >= scenesDurationSum) {
        setPlay(false);
        setNowSceneIndex(0);
        setTime(0);
      } else {
        setTime((time) => {
          return time + DELAY * speed;
        });
      }
    },
    play,
    DELAY
  );

  // 用户指定播放时间事件
  const setProgress = (jumpTime) => {
    // const nextSceneIndex = getSceneIndex(jumpTime);
    setJumpTime(jumpTime);
    setJump(true);
    // if (nextSceneIndex === nowSceneIndex) {
    //   setTime(jumpTime);
    // }
  };

  // 场景通过此函数改变场景的seeked状态
  const onSeeked = (val, index) => {
    setSeeked((seeked) => {
      const cloneSeeked = [...seeked];
      cloneSeeked[index] = val;
      return cloneSeeked;
    });
  };

  // 所有场景的seeked都为true时再进行画面真实的跳转，并将跳转态设为false
  useEffect(() => {
    const isSeeking = seeked.some((state) => {
      return state === false;
    });
    if (!isSeeking && jump) {
      setNowSceneIndex(getSceneIndex(jumpTime));
      setTime(jumpTime);
      setJump(false);
    }
  }, [seeked]);

  // 根据time与场景index获得对应场景的时间进度，对应场景的时间进度要减去前置场景的时长
  const getSceneTime = (time, index) => {
    let sceneTime = time;
    for (let i = 0; i < index; i++) {
      sceneTime -= scenesDuration[i];
    }
    return sceneTime;
  };

  return (
    <div className='container'>
      {cleanData && (
        <Stage width={data.width} height={data.height} ref={stage}>
          {cleanData.scenes.map((item, index) => {
            return (
              <Scene
                key={index}
                visible={index === nowSceneIndex}
                jump={jump}
                jumpTime={getSceneTime(jumpTime, index)}
                speed={speed}
                scene={item}
                time={getSceneTime(time, index)}
                play={play && index === nowSceneIndex}
                onSeeked={(val) => onSeeked(val, index)}
              />
            );
          })}
        </Stage>
      )}

      <Slider
        jump={jump}
        play={play}
        time={jump ? jumpTime : time}
        scenesDurationSum={scenesDurationSum}
        setProgress={setProgress}
        setPlay={setPlay}
        setSpeed={setSpeed}
      />
    </div>
  );
}

export default Control;
