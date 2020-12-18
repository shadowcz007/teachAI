//utils
// 判断是否为图片格式
export function isImage(str) {
    var reg = /\.(png|jpg|gif|jpeg|webp)$/;
    return reg.test(str);
}