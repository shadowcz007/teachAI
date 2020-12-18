// import * as tf from '@tensorflow/tfjs';
import * as model from './model'

import * as augment from './augment';

import * as GlobalInfo from './components/Global-info';
import * as Dataset from './components/Dataset';
import * as Info from './components/Info';
import * as Extract from './components/Extract-feature';
import * as Video from './components/Video';
import * as ValVideo from './components/Val-video';
import * as ValImage from './components/Val-image';
import * as Modify from './components/Modify';
import * as ModelPannel from './components/Model';
import * as DefineClass from './components/Define-class';
import * as Menu from './components/Menu';
import * as Loading from './components/Loading';
import * as ValDataset from './components/Val-dataset';


import * as Paste from './components/Paste';

//几个模块面板
export let PANNELS = {
    GLOBAL_INFO: null, //消息通知
    EXTTRACT_FEATURE: null, //特征抽取器
    VIDEO: null, //摄像头
    DATA: null, //
    INFO: null, //提示信息
    VAL_FROM_DATASET: null, //从数据集验证
    VAL_FROM_IMAGE: null, //从本地图片或剪切板验证
    VAL_FROM_VIDEO: null, //从摄像头验证
    CLASS: null, //定义分类
    MODEL: null, //模型
}


export function init() {
    Loading.startLoading("Loading");
    Paste.init();

    //全局的消息
    let gPannel = GlobalInfo.init();
    document.body.appendChild(gPannel);
    PANNELS.GLOBAL_INFO = gPannel;

    //特征抽取器
    let extractForFeatureDiv = Extract.get();
    document.body.appendChild(extractForFeatureDiv);
    PANNELS.EXTTRACT_FEATURE = extractForFeatureDiv;
    Extract.setEvent = (value) => {
        var res = model.setFeatureType(value);
        console.log(res)
    };

    //摄像头输入
    let videoInputPannel = Video.get();
    document.body.appendChild(videoInputPannel);
    PANNELS.VIDEO = videoInputPannel;

    Video.updateTrainEvent(async(video, label) => {
        await model.train(video, label);
    });

    Video.updatePredictEvent(async(video) => {
        let res = await model.predict(video);
        // console.log(res)
        return model.displayPredictResult(res);
    });

    //从图片导入数据集
    let importDataDiv = Dataset.init();
    document.body.appendChild(importDataDiv);
    PANNELS.DATA = importDataDiv;

    //可视化
    let visPannel = Info.get();
    document.body.appendChild(visPannel);
    PANNELS.INFO = visPannel;

    //
    let valDatasetPannel = ValDataset.get();
    document.body.appendChild(valDatasetPannel);
    PANNELS.VAL_FROM_DATASET = valDatasetPannel;

    //验证模型
    let vaPannel = ValImage.get();
    document.body.appendChild(vaPannel);
    PANNELS.VAL_FROM_IMAGE = vaPannel;

    ValImage.setEvent(async(img) => {
        let res = await model.predict(img);
        let top = model.getTopK(res);
        predictResultVis(img, top);
        return { img: img, res: top }
    });

    Paste.updateUploadImageForPredictEvent(async(file) => {
        let img = await ValImage.uploadImageForPredict(file);
        //console.log(img,ValImage.getEvent())
        return await (ValImage.getEvent())(img);
    });

    Paste.updatePasteFun((predictRes) => {
        setMessage(predictRes.img, Array.from(predictRes.res, r => r.className + ' - ' + parseInt(r.score * 100) + "%").join("\n"));
    });

    let vaVPannel = ValVideo.get();
    document.body.appendChild(vaVPannel);
    PANNELS.VAL_FROM_VIDEO = vaVPannel;
    ValVideo.setPredictEvent(() => {
        Video.startPredict();
        Video.start();
    });

    //调整数据
    let modifyDataPannel = Modify.get();
    document.body.appendChild(modifyDataPannel);
    PANNELS.CLASS = modifyDataPannel;

    DefineClass.setEvent(async(img, className) => {
        await model.train(img, className);
    });

    DefineClass.setAugment(augment);

    //模型相关
    let modelPannel = ModelPannel.get();
    document.body.appendChild(modelPannel);
    PANNELS.MODEL = modelPannel;
    ModelPannel.updateClearEvent(() => {
        model.knn.clearAllClasses();
    });
    ModelPannel.setLoadJSON(loadJSON);
    ModelPannel.setDownloadJSON(downloadJSON);
    ModelPannel.setSaveJson2Local(saveJson2Local);
    ModelPannel.setReTrain(async(imgs, className) => {
        for (let index = 0; index < imgs.length; index++) {
            const img = imgs[index];
            await model.train(img, className);
        };
    })

    Info.setText("欢迎~");
    Loading.removeLoading();
}






//for sketch 插件
// async function uploadImageBase64ForPredict(base64){
//     if(!base64)return;
//     let img = await createImage(base64, 200);
//     let res = await model.predict(img);
//     // console.log(res);
//     let top=model.getTopK(res);
//     return top
// }


function saveJson2Local() {
    Loading.startLoading("保存");
    model.export2str();
    Loading.removeLoading();
}

function downloadJSON() {
    Loading.startLoading("下载中");
    let jsonModel = model.export2str();;
    let downloader = document.createElement('a');
    downloader.download = "model.json";
    downloader.href = 'data:text/text;charset=utf-8,' + encodeURIComponent(jsonModel);
    document.body.appendChild(downloader);
    downloader.click();
    downloader.remove();
    Loading.removeLoading();
};

async function loadJSON(event) {
    Loading.startLoading("加载中");
    let inputModel = event.target.files;
    console.log("Uploading");
    let fr = new FileReader();
    if (inputModel.length > 0) {
        fr.onload = async() => {
            var dataset = fr.result;
            model.load(dataset);
            console.log("Classifier has been set up! Congrats! ");
        };
    };
    await fr.readAsText(inputModel[0]);
    console.log("Uploaded");
    setModelInfo();
    Loading.removeLoading();
};







export function initClassDiv() {
    DefineClass.initClassDiv();
}
export function createClassDiv() {
    DefineClass.createClassDiv();
}
export function setGlobalInfo(t) {
    GlobalInfo.setGlobalInfo(t);
}
export function setGlobalAction(text, action) {
    GlobalInfo.setGlobalAction(text, action);
}
export function displayMenu(menus, actions) {
    Menu.displayMenu(menus, actions);
}

export function setMessage(img, text) {
    GlobalInfo.setMessage(img, text);
}

export function setModelInfo() {
    let c = Object.keys(model.knn.classExampleCount);
    if (ModelPannel.get().querySelector('.info')) ModelPannel.setText(`共${c.length}类别，分别为${c.slice(0,3).join("、")}${c.length>3?'...':''}`);
}

export function isCanTrain(bool) {
    console.log('isCanTrain', bool);
    ModelPannel.isCanTrain(bool);
}

export function predictResultVis(img, top) {
    let uploadImagePreview = document.querySelector('.upload-image-preview');
    uploadImagePreview.style.backgroundImage = `url(${img.src})`;
    ValImage.predictResultVis(top);
}