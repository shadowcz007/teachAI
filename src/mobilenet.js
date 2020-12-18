import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
tf.setBackend('webgl');

export let model;

export async function init(){
    let localPath='indexeddb://mobilenet';
    try {
        model = await mobilenet.load({
            modelUrl: localPath,
            version: 1,
            alpha: 1
        });
    } catch (error) {
        console.log(error)
        try {
            model = await mobilenet.load({
                version: 1,
                alpha: 1
            });
            await model.model.save(localPath);
        } catch (error) {
            model = await mobilenet.load();
            await model.model.save(localPath);
        };
    };

    if(!model){
        //预热
        var zeroTensor = tf.zeros([ 1, 1, 3 ]);
        await run(zeroTensor);
        //console.log("initCocoSsd--ok")
        return true
    };

};
export async function run(imgTensor=null){
    // console.log(imgTensor);
    // var res=model.infer(imgTensor, 'conv_preds');
    // console.log(res)
    return await model.infer(imgTensor, 'conv_preds');
}

