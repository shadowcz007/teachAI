// Copyright 2020 shadow
//
// 

import "@babel/polyfill";

import * as model from './src/model';
import * as css from './src/css';
import * as ui from './src/ui';
import * as pipe from './src/pipe';

// import * as smartcrop from 'smartcrop';

window.pipe = pipe;
// window.smartcrop=smartcrop;

//样式
css.init();

class Main {
    constructor() {
        // 初始化变量
        // 分类数量
        this.NUM_CLASSES = 0;
        this.infoTexts = [];
        this.training = -1; // -1 表示不在训练ing
        this.videoPlaying = false;
        this.currentClassDom = null;

        //加载的数据集
        this.imagesDataSet = {
            validation: {},
            train: {}
        };

        // 初始化,加载模型之类的
        model.init();

        ui.init();

        pipe.init();
        
    }

    async sleep(t = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, t);
        });
    }

    //gui
    displayPredictResult(res, trueClassName) {
        const numClasses = this.knn.getNumClasses();
        // The number of examples for each class
        const exampleCount = this.knn.getClassExampleCount();
        console.log(res, exampleCount)

        let globalInfoTexts = [trueClassName ? `真实值:${trueClassName}` : ""];
        Object.keys(exampleCount).forEach((key) => {
            globalInfoTexts.push(`${key} - ${res.confidences[key] * 100}%`);
        });
        this.globalInfoText.innerText = globalInfoTexts.join("\n");
    }

};

window.addEventListener('load', () => new Main());