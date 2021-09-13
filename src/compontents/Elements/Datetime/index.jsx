import React, { useState, useEffect, useRef } from 'react';
import Text from '../Text';
import moment from 'moment';

function Datetime(props) {
  const [content, setContent] = useState();
  const {
    dateFormat, // 日期格式
    dateLabel, // 日期标签
    // duration,
    // play,
    // playMode, //显示模式
    // time,
    timeSum, //总时间
    timeFormat, // 时间格式
    timeLabel, // 时间标签
    visible,
    // jump,
    // onSeeked,
    initialValue = '1990-06-15 00:00:00',
  } = props;
  const timeData = useRef(moment(initialValue));

  const timeFormatClean = timeFormat.replace(/M/g, 'm').replace(/S/g, 's');

  const dateTranslate = () => {
    const date = timeData.current.format(dateFormat);
    const time = timeData.current.format(timeFormatClean);
    const datetimeValue = dateLabel + date + ' ' + timeLabel + time;
    return datetimeValue;
  };

  useEffect(() => {
    timeData.current = initialValue
      ? moment(`${timeData.current.format(dateFormat)}`)
      : moment();
    initialValue && timeData.current.add(timeSum, 'milliseconds');
    setContent(dateTranslate());
  }, [timeSum]);

  useEffect(() => {
    if (!visible) return;
    let _content = dateTranslate();
    setContent(_content);
  }, [visible]);

  // useEffect(() => {
  //   if (jump) {
  //     onSeeked(false);
  //     onSeeked(true);
  //   }
  // }, [jump]);

  return <Text {...props} text={content} />;
}

export default Datetime;
