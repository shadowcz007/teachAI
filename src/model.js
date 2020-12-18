import * as tf from '@tensorflow/tfjs';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
tf.setBackend('webgl');

import * as cocoSsd from './cocoSsd';
import * as mobilenet from './mobilenet';

export let knn, model;

// featureType 
// mobilenet 图像特征
// cocossd 目标检测
let featureType="mobilenet";

// 图像尺寸 
const IMAGE_SIZE = 227;
// KNN的返回数量
const TOPK = 10;


//设置特征抽取器类型
export function setFeatureType(t){
    if(t){
        featureType=t.trim().toLocaleLowerCase();
    };
    return featureType;
}


export async function init() {
    knn = knnClassifier.create();

    //增加模型缓存
    await mobilenet.init();
    await cocoSsd.init();

    //测试用
    window.cocoSsd = cocoSsd;
    window.knn = knn;
    window.tf;
    // this.start();
   
};

//特征抽取
async function extractFeature(image){
    // console.log(featureType)
    let logits;
    if(featureType=='mobilenet'){
        logits=await mobilenet.run(image);
    }else if(featureType=='cocossd'){
        //6bbox个最多
        logits=await cocoSsd.run(image);
        logits=Array.from(logits,g=>{
            //console.log(g);
            g.id=cocoSsd.getIdByClassName(g.class);
            return [...g.bbox,g.score,g.id]
        });
        logits=tf.tensor(logits).flatten();
        //36 size
        if(logits.size<=36){
            logits=logits.concat(tf.zeros([36-logits.size]))
        }else{
            logits=logits.slice(0,36);
        };  
    }
    // console.log(logits)
    return logits;
};

//特征可视化




//训练
export async function baseTrain(img=null, className=null) {
    // console.log(img)
    const image = tf.browser.fromPixels(img);
    let logits= await extractFeature(image);
    
    //可视化
    //TODO 临时把布局数据做导出
    if(featureType=='cocossd'){
        let noramlLayoutData=[];
        let pos=logits.dataSync();
        let c=document.createElement('canvas');
            let ctx=c.getContext('2d');
            c.width=img.width;
            c.height=img.height;
        ctx.drawImage(img,0,0,img.width,img.height);
        for(var i=0;i<pos.length;i+=6){
            var x=pos[i],y=pos[i+1],w=pos[i+2],h=pos[i+3],score=pos[i+4];
            x<=0?x=1:null;
            y<=0?y=1:null;
            
            if(w>0&&h>0){
                ctx.strokeStyle=`rgba(255,0,0,${score*255})`;
                ctx.lineWidth=8;
                ctx.strokeRect(x,y,w,h);
                
                noramlLayoutData.push({
                    x:x/img.width,
                    y:y/img.height,
                    w:w/img.width,
                    h:h/img.height,
                    wh:w/h,
                    area:(w*h)/(img.width*img.height)
                });
            }
            
            // console.log(x,y,w,h,score);
        };
        noramlLayoutData=noramlLayoutData.sort((b,a)=>a.area-b.area);
        img.src=c.toDataURL();
        img.setAttribute('data-layout',JSON.stringify(noramlLayoutData));
    };
    // document.body.appendChild(c);
    // Add current image to classifier
    knn.addExample(logits, className);

    // Dispose image when done
    image.dispose();
    if (logits != null) {
        logits.dispose();
    }
}

//TODO 带数据增强的训练
export async function train(img=null, className=null) {
    // console.log(tf.getBackend())
    // let imgs = await augment.run(img);

    // Array.from(imgs, im => {
    //     baseTrain(im, className);
    // });
    await baseTrain(img, className);
};

export async function predict(img=null) {

    const image = tf.browser.fromPixels(img);
 
    const numClasses = knn.getNumClasses();
    let res;
    // console.log(numClasses)
    if (numClasses > 0) {
        let logits= await extractFeature(image);
        // console.log(logits)
        if(logits){
            // If classes have been added run predict
            res = await knn.predictClass(logits, TOPK);
        }
        
        if (logits != null) {
            logits.dispose();
        };

    };

    // Dispose image when done
    image.dispose();
    
    return res
}



export function getTopK(res) {
    var scores = [];
    if (res) {
        for (let className in res.confidences) {
            var score = res.confidences[className];
            scores.push({ className, score });
        };
    };
    scores = scores.sort((a, b) => { return b.score - a.score }).filter(s => s.score > 0).slice(0, TOPK);
    // if(isText)
    return scores
};



export function displayPredictResult(res) {
    // The number of examples for each class
    const exampleCount = knn.getClassExampleCount();
    let texts = [];
    Object.keys(exampleCount).forEach((key) => {
        texts.push(`${key} - ${res.confidences[key] * 100}%`);
    });
    return texts.join("\n");
}

function imgTensor2Canvas(t){
    let canvas=document.createElement("canvas");
    tf.browser.toPixels(t,canvas);
    return canvas;
}

export function loadLocalModel(){
    let localModel=localStorage.getItem("easyteach_model");
    
    if(localModel){
        load(localModel);
        return knn.getNumExamples()>0
    }else{
        return false
    }
}

export function load(dataset=""){
    
    try {
        var tensorObj = JSON.parse(dataset);
        Object.keys(tensorObj).forEach((key) => {
            tensorObj[key] = tf.tensor(tensorObj[key].tensor, tensorObj[key].shape, tensorObj[key].tensor.dtype);
        }); 
        //需要清空knn
        knn.clearAllClasses();
        knn.setClassifierDataset(tensorObj);
        
        return true
    } catch (error) {
        return false
    }
}

export function reset(){
    //需要清空knn
    knn.clearAllClasses();
}

export function export2str(){
    let dataset = knn.getClassifierDataset();
    var datasetObj = {};
    Object.keys(dataset).forEach((key) => {
        let data = dataset[key].dataSync();
        var shape = dataset[key].shape,
            dtype = dataset[key].dtype;
        datasetObj[key] = {
            tensor: Array.from(data),
            shape: shape,
            dtype: dtype
        };
    });

    let jsonModel=JSON.stringify(datasetObj)
    localStorage.setItem("easyteach_model",jsonModel);
    return jsonModel;
}