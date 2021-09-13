import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import Scene from '../Scene';
import Slider from '../Slider';
import './index.css';

// eslint-disable-next-line max-lines-per-function
function Control(props) {
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
  const [timeDiff, setTimeDiff] = useState(0); //layer每次刷新间隔时间

  const layer = useRef();

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
  const getSceneIndex = useCallback(
    (time) => {
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
    },
    [scenesDuration]
  );

  useEffect(() => {
    setNowSceneIndex(getSceneIndex(time));
  }, [time, scenesDuration, getSceneIndex]);

  // 用户指定播放时间事件
  const setProgress = (jumpTime) => {
    setJumpTime(jumpTime);
    setJump(true);
  };

  // 场景通过此函数改变场景的seeked状态
  const onSeeked = useCallback((val, index) => {
    setSeeked((seeked) => {
      const cloneSeeked = [...seeked];
      cloneSeeked[index] = val;
      return cloneSeeked;
    });
  }, []);

  // 所有场景的seeked都为true时再进行画面真实的跳转，并将跳转态设为false
  useEffect(() => {
    // true表示有场景在加载中，false表示所有场景加载完成
    const isSeeking = seeked.some((state) => {
      return state === false;
    });
    if (!isSeeking && jump) {
      setTime(jumpTime);
      setNowSceneIndex(getSceneIndex(jumpTime));
      setJump(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seeked]);

  // 根据time与场景index获得对应场景的时间进度，对应场景的时间进度要减去前置场景的时长
  const getSceneTime = (time, index) => {
    let sceneTime = time;
    for (let i = 0; i < index; i++) {
      sceneTime -= scenesDuration[i];
    }
    return sceneTime;
  };

  // 创建layer图层动画，动画开始时将每帧画面之间的时差赋值给timeDiff
  const anim = useMemo(() => {
    return new Konva.Animation((frame) => {
      setTimeDiff(frame.timeDiff);
    }, layer.current);
  }, []);

  // timeDiff变化时根据speed将进度统计赋值给time
  useEffect(() => {
    setTime((time) => {
      return time + timeDiff * speed;
    });
  }, [speed, timeDiff]);

  // time超过了节目的总时长，将time设成0，节目重新播放
  useEffect(() => {
    if (time > scenesDurationSum) {
      setTime(0);
    }
  }, [time, scenesDurationSum]);

  // 控制节目播放暂停，同时控制layer的动画的开始与停止
  const onPlayPause = useCallback(() => {
    setPlay((play) => {
      play ? anim.stop() : anim.start();
      return !play;
    });
  }, [anim]);

  return (
    <div className='container'>
      {cleanData && (
        <Stage width={data.width} height={data.height} ref={stage}>
          <Layer
            ref={(element) => {
              layer.current = element;
            }}
          >
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
                  timeSum={time}
                  play={play && index === nowSceneIndex}
                  onSeeked={(val) => onSeeked(val, index)}
                />
              );
            })}
          </Layer>
        </Stage>
      )}

      <Slider
        jump={jump}
        play={play}
        time={jump ? jumpTime : time}
        scenesDurationSum={scenesDurationSum}
        setProgress={setProgress}
        onPlayPause={onPlayPause}
        setSpeed={setSpeed}
      />
    </div>
  );
}

export default Control;
