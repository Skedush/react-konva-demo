import moment from 'moment';

// 毫秒格式化时长
export function timeTranslate(t) {
  const duration = moment.duration(t);
  const supplement = (nn) => {
    return (nn = nn < 10 ? '0' + nn : nn);
  };
  return `${supplement(duration.hours())}:${supplement(
    duration.minutes()
  )}:${supplement(duration.seconds())}`;
}
