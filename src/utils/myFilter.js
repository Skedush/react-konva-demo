import Konva from 'konva';
export const {
  Filters: {
    Blur,
    Brighten,
    Contrast,
    Emboss,
    Enhance,
    Grayscale,
    HSL,
    HSV,
    Invert,
    Kaleidoscope,
    Mask,
    Noise,
    Pixelate,
    Posterize,
    RGB,
    RGBA,
    Sepia,
    Solarize,
    Threshold,
  },
} = Konva;

export function BackInDown(imageData) {
  const animationPercent = this.getAttr('animationPercent') / 100;
  const width = this.getAttr('width');
  var nPixels = imageData.data.length;
  imageData.data.fill(
    0,
    Math.floor((nPixels * animationPercent) / 4 / width) * width * 4
  );
}

export function Shades(imageData) {
  var nPixels = imageData.data.length;
  const animationPercent = this.getAttr('animationPercent') / 100;
  const width = this.getAttr('width');
  const copiesCount = 8; // 百叶窗叶子数量
  const copies = Math.floor(nPixels / copiesCount / width / 4) * width * 4; //每个叶子所占imageData长度，向下取整一行像素点

  for (let i = 1; i <= copiesCount; i++) {
    // 根据动画进度算出每份百叶窗可视画面结束点的imageData位置（向下取整到一行像素点末尾）
    const copiesEnd =
      copies * (i - 1) +
      Math.floor((copies * animationPercent) / 4 / width) * width * 4;

    // 每扇百叶窗开始的像素点
    const yBegin = (copies * (i - 1)) / 4 / width;

    // 根据像素点循环每扇百叶窗可视部分
    for (let j = copies * (i - 1); j < copiesEnd; j = j + 4) {
      // 获得当前像素点的相对x坐标
      const x = Math.floor(j / 4) % width;
      // 获得当前像素点的相对y坐标
      const y = Math.floor(j / 4 / width);
      // 根据百叶窗动画进度获得缩放比例后的相对y坐标
      const yy = parseInt(yBegin + (y - yBegin) / animationPercent);
      // 循环操作每扇百叶窗可视像素点的rbga值
      for (let k = 0; k < 4; k++) {
        imageData.data[x * 4 + y * 4 * width + k] =
          imageData.data[x * 4 + yy * 4 * width + k];
      }
    }
    // 将每扇百叶窗不可见的iamgedata的rgba值设为0
    imageData.data.fill(
      0,
      copiesEnd,
      i === copiesCount ? undefined : copies * i
    );
  }
}
