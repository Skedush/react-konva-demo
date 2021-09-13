import { useEffect, useRef } from 'react';
import Konva from 'konva';

const useAnimation = ({
  isChangeFrame,
  type,
  // tween,
  play,
  time,
  visible,
  jump,
  node,
  duration,
  onFinish,
  onUpdate,
  onReset,
}) => {
  const tween = useRef();

  // 创建动画
  useEffect(() => {
    if (!type || !node) return;
    // 设置动画开始filter比例
    node.setAttr('animationPercent', 0);
    node.cache();
    tween.current = new Konva.Tween({
      node: node,
      duration: duration,
      // 设置动画结束时filter比例
      animationPercent: 100,
      onUpdate: () => {
        // 若是动态画面，则每次update需要cache
        if (isChangeFrame) {
          node.cache();
        }
        onUpdate && onUpdate();
      },
      onFinish: () => {
        // 动画结束时清除cache
        node.clearCache();
        onFinish && onFinish();
      },
      onReset: () => {
        onReset && onReset();
      },
    });
  }, [duration, node, onFinish, onReset, onUpdate, type]);

  // 播放动画
  useEffect(() => {
    if (!type || !node || !tween.current) return;
    if (visible) {
      if (time / 1000 > duration) {
        // 点击跳转的位置动画已结束
        tween.current.seek(duration);
        node.clearCache();
      } else {
        // 点击跳转的位置动画未结束
        node.cache();
        tween.current.seek(time / 1000);
      }
    } else {
      // 当前动画的元素不可见时reset动画
      tween.current.reset();
    }
    if (play) {
      tween.current.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jump, visible, play, duration, tween]);
};
export { useAnimation };
