import React, { useState, useEffect } from 'react';
import Text from '../Text';
import moment from 'moment';

function Datetime(props) {
  const [content, setContent] = useState();
  const {
    dateFormat, // 日期格式
    dateLabel, // 日期标签
    // duration,
    play,
    // playMode, //显示模式
    // time,
    timeFormat, // 时间格式
    timeLabel, // 时间标签
    visible,
    // jump,
    // onSeeked,
  } = props;

  const timeFormatClean = timeFormat.replace(/M/g, 'm').replace(/S/g, 's');

  const dateTranslate = () => {
    return (
      dateLabel +
      moment().format(dateFormat) +
      ' ' +
      timeLabel +
      moment().format(timeFormatClean)
    );
  };

  useEffect(() => {
    let itv;
    if (play && visible) {
      itv = setInterval(() => {
        if (play && visible) {
          let _content = dateTranslate();
          setContent(_content);
        }
      }, 1000);
    } else {
      clearInterval(itv);
      itv = null;
    }
    return () => {
      clearInterval(itv);
      itv = null;
    };
  }, [play]);

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
