import * as tf from '@tensorflow/tfjs';
import * as Base from './components/Base';

const h = require('hasard');
const ia = require('image-augment')(tf);

// Random example images
const sometimes = (aug => h.value([aug, ia.identity()]));

window.run = run;
window.tf = tf;
// Create an augmentation pipeline
const basicAugmentation = ia.sequential({
    steps: [
        ia.fliplr(0.5),
        ia.flipud(0.5),
        ia.pad({
            percent: h.array({ size: 2, value: h.number(0, 0.1) }),
            borderType: ia.RD_BORDER_TYPE,
            borderValue: h.integer(0, 255)
        }),
        sometimes(ia.crop({
            percent: h.array({ size: 2, value: h.number(0, 0.1) })
        })),
        sometimes(ia.affine({
            // Scale images to 80-120% of their size, individually per axis
            scale: h.array([h.number(0.6, 1.2), h.number(0.6, 1.2)]),
            // Translate by -20 to +20 percent (per axis)
            translatePercent: h.array([h.number(-0.2, 0.2), h.number(-0.2, 0.2)]),
            // Rotate by -45 to +45 degrees
            rotate: h.number(-45, 45),
            // Shear by -16 to +16 degrees
            shear: h.number(-16, 16),
            // If borderType is constant, use a random rgba value between 0 and 255
            borderValue: h.array({ value: 255, size: 4 }),
            borderType: ia.RD_BORDER_TYPE
        }))
    ],
    randomOrder: true
});

export async function run(img) {
    img = tf.browser.fromPixels(img, 4);
    let cs = [];
    for (let index = 0; index < new Array(2).length; index++) {
        let images = tf.tensor4d(img.dataSync(), [1, img.shape[0], img.shape[1], 4]);
        let res = await basicAugmentation.read({ images });
        images = res.images;
        // console.log(images)
        images = tf.tensor3d(images.dataSync(), [images.shape[1], images.shape[2], 4], 'int32');
        // images = images.reshape([images.shape[1], images.shape[2], 4]);

        let canvas =Base.createCanvas(200, parseInt(images.shape[0] * 200 / images.shape[1]));
        tf.browser.toPixels(images, canvas);
        cs.push(canvas);

        images.dispose();
        //document.body.appendChild(canvas);
        // cs.push(images);
    };
    return cs;
}