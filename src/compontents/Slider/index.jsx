import React, { useRef, useState } from 'react';
import './index.css';
import { timeTranslate } from '../../utils';

const Slider = (props) => {
  const { time, scenesDurationSum, setProgress, onPlayPause, setSpeed, play } =
    props;
  const options = useRef();
  const [playSpeed, setPlaySpeed] = useState('倍速');
  const [sliderTime, setSliderTime] = useState(time);
  const [changeing, setChangeing] = useState(false);

  const durationTime = timeTranslate(scenesDurationSum);
  const progressTime = timeTranslate(changeing ? sliderTime : time);

  const onChange = (e) => {
    setSliderTime(parseFloat(e.target.value));
  };

  const onMouseUp = (e) => {
    setChangeing(false);
    setProgress(parseFloat(e.target.value));
  };

  const onMouseDown = () => {
    setChangeing(true);
    setSliderTime(time);
  };

  const onMouseEnter = () => {
    if (options.current.style.display === 'none')
      options.current.style.display = 'block';
  };
  const onMouseLeave = () => {
    options.current.style.display = 'none';
  };
  const onSpeedClick = (e) => {
    let speed = e.target.innerHTML.substring(0, e.target.innerHTML.length - 1);
    e.target.innerHTML === '1.0X'
      ? setPlaySpeed('倍速')
      : setPlaySpeed(e.target.innerHTML);
    options.current.style.display = 'none';
    setSpeed(speed);
  };

  return (
    <div id='video-slider' onMouseLeave={onMouseLeave}>
      {play && (
        <div id='video-btn-pause' onClick={() => onPlayPause()}>
          |&nbsp;&nbsp;|
        </div>
      )}
      {!play && <div id='video-btn-play' onClick={() => onPlayPause()}></div>}
      <div id='video-progress'>
        <input
          type='range'
          value={changeing ? sliderTime : time}
          // disabled={jump}
          max={scenesDurationSum}
          id='video-progress-control'
          step='any'
          onChange={onChange}
          onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
        />
        <span id='time-duration'>{durationTime}</span>
        <span id='time-propgress'>{progressTime}</span>
      </div>
      <div
        id='time-speed'
        onMouseOver={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {playSpeed}
        <div
          id='time-speed-select'
          ref={options}
          onClick={onSpeedClick}
          onMouseLeave={onMouseLeave}
        >
          <div>0.5X</div>
          <div>1.0X</div>
          <div>2.0X</div>
          <div>4.0X</div>
        </div>
      </div>
    </div>
  );
};
export default Slider;
