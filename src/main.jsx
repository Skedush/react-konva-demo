import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Control from './compontents/Control';

const data = {
  id: '61243f84f09ad60019bec804',
  name: '20210824',
  width: 800,
  height: 600,
  updateTime: '2021-08-24T00:43:35.587Z',
  createTime: '2021-08-24T00:38:28.945Z',
  publishTime: null,
  info: {
    scenes: [
      {
        items: [
          {
            type: 'video',
            width: 800,
            height: 600,
            x: 0,
            y: 0,
            params: {
              file: '/1.mkv',
              audit: false,
              duration: 37000,
            },
          },
        ],
      },
      {
        items: [
          {
            params: {
              file: '/1.mkv',
              audit: false,
              duration: 37000,
            },
            type: 'video',
            width: 800,
            height: 600,
            x: 0,
            y: 0,
          },
          {
            type: 'image',
            width: 371,
            height: 371,
            x: 429,
            y: 0,
            params: {
              duration: 30000,
              transition: {
                type: 24,
                speed: 'fast',
              },
              file: './3.gif',
              audit: false,
            },
          },
        ],
      },
      {
        items: [
          {
            type: 'video',
            width: 800,
            height: 600,
            x: 0,
            y: 0,
            params: {
              file: '2.mp4',
              audit: false,
              duration: 15000,
            },
          },
          {
            type: 'text',
            width: 218,
            height: 96,
            x: 0,
            y: 0,
            params: {
              duration: 30000,
              transition: {
                type: 24,
                speed: 'fast',
              },
              content: '哈哈啊哈',
              font: {
                name: 'simsun.ttc',
                size: 24,
                color: [255, 255, 255],
                lspace: 5,
                fspace: 0,
                align: 1,
              },
              backColor: [60, 101, 182, 255],
            },
          },
          {
            type: 'datetime',
            width: 245,
            height: 100,
            x: 555,
            y: 0,
            params: {
              timeFormat: 'HH:MM:SS',
              dateFormat: 'YYYY-M-D',
              dateLabel: '',
              timeLabel: '',
              font: {
                name: 'simsun.ttc',
                size: 24,
                color: [255, 255, 255],
                lspace: 5,
                fspace: 0,
                align: 0,
              },
              duration: 30000,
              transition: {
                type: 24,
                speed: 'middle',
              },
              playMode: 'single',
              backColor: [60, 101, 182, 255],
            },
          },
        ],
      },
    ],
  },
  version: 0,
  canPublish: true,
};
ReactDOM.render(
  <React.StrictMode>
    <Control data={data} />
  </React.StrictMode>,
  document.getElementById('root')
);
