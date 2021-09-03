import React, { useState, useEffect, Fragment } from 'react';
import { Text as RText, Rect } from 'react-konva';

function Text(props) {
  const [content, setContent] = useState();
  const {
    backColor, // 背景颜色
    font,
    height,
    visible,
    width,
    x,
    y,
    text,
    jump,
    onSeeked,
  } = props;
  const { align, color, size: fontSize } = font; // align:对齐方式[3 x 3矩阵]   fspace:水平间距   lspace:竖直间距   name:字体
  const alignArr = {
    0: ['left', 'top'],
    1: ['left', 'middle'],
    2: ['left', 'bottom'],
    3: ['center', 'top'],
    4: ['center', 'middle'],
    5: ['center', 'bottom'],
    6: ['right', 'top'],
    7: ['right', 'middle'],
    8: ['right', 'bottom'],
  };

  const newAlign = alignArr[align];

  useEffect(() => {
    if (!visible) return;
    setContent(text);
  }, [visible, text]);

  useEffect(() => {
    if (jump) {
      onSeeked(false);
      onSeeked(true);
    }
  }, [jump]);

  return (
    <Fragment>
      <Rect
        visible={visible}
        fill={`rgb(${backColor.join(',')})`}
        x={x}
        y={y}
        width={width}
        height={height}
      />
      <RText
        visible={visible}
        text={content}
        x={x}
        y={y}
        width={width}
        height={height}
        fontSize={fontSize}
        fill={`rgb(${color.join(',')})`}
        align={newAlign[0]}
        verticalAlign={newAlign[1]}
      />
    </Fragment>
  );
}

export default Text;
