import * as tf from '@tensorflow/tfjs';
import * as Base from './Base';
import * as Loading from './Loading';
import * as Vis from './Vis';
import * as Info from './Info';
import * as utils from '../utils';
import * as ValDataset from './Val-dataset';

// import { Info } from 'vega';

//加载数据集,文件路径
let imagesDataSet = {
    validation: {},
    train: {}
};

export function getImagesDataSet() {
    return imagesDataSet
}
export function clearImagesDataSet() {
    imagesDataSet.train = {};
}

//从图片导入数据集
export function init() {
    // let NUM_CLASSES = 0;

    // let validationData = [];

    const importDataDiv = Base.createPannel("pannel");

    //标题
    (() => {
        importDataDiv.appendChild(
            Base.createTitle("从图片数据集")
        );
    })();

    //数据集切分比例
    let splitNum = Base.createInput("text", false, "数据集切分比例");
    importDataDiv.appendChild(splitNum);
    splitNum.value = 0.85;

    //加载训练数据集,暂时只支持图片
    let loadDataSetInput = Base.createInput("file", true, "导入");
    loadDataSetInput.className = "hidden";
    importDataDiv.appendChild(loadDataSetInput);

    let loadDataSetDivButton = Base.createButton("导入");
    loadDataSetDivButton.id = "import_dataset";
    importDataDiv.appendChild(loadDataSetDivButton);
    loadDataSetDivButton.addEventListener('click', e => {
        loadDataSetInput.click();
    });

    loadDataSetInput.addEventListener("change", async(e) => {
        if (e.target.files.length == 0) return;
        //loading
        Loading.startLoading("加载数据集");
        //初始化
        imagesDataSet.train = {};
        imagesDataSet.validation = {};
        // Array.from(e.target.files,f=>{
        //     console.log(isImage(f.name),f.name)
        // })
        //随机
        let files = Array.from(e.target.files).filter(f => utils.isImage(f.name));
        tf.util.shuffle(files);

        //数据集
        let dataSet = {};
        Array.from(files, f => {
            // console.log(f)
            var ts = f.name.split("_");
            // if(ts.includes('符号'))console.log(ts)
            var text = ts[ts.length - 1].replace(/\..*/ig, "");
            var labels = text.split(",");
            // console.log(labels);
            Array.from(labels, label => {
                if (!dataSet[label]) {
                    dataSet[label] = [];
                };
                dataSet[label].push(f);
            });
        });

        //补充数据的提示
        let badDataSet = {};
        let lens = Array.from(Object.keys(dataSet), k => dataSet[k].length);
        let count = tf.tensor1d(lens).sum().dataSync()[0];

        //验证集
        for (const label in dataSet) {
            if (dataSet.hasOwnProperty(label)) {
                let ds = dataSet[label];
                // if(label=="符号")console.log(ds)
                //TODO 提示样本量不足
                if (ds.length <= 3) {
                    badDataSet[label] = ds.length;
                };
                tf.util.shuffle(ds);
                //切割成训练和验证集
                let index = ~~(ds.length * parseFloat(splitNum.value.trim())) || 1;
                // console.log(index,ds.length)
                imagesDataSet.train[label] = ds.slice(0, index);
                imagesDataSet.validation[label] = ds.slice(index, ds.length);
            }
        };

        Info.setText(`共${Object.keys(dataSet).length}个分类
                    样本数${count}
                    其中，样本不足:${JSON.stringify(badDataSet,null,2)}`);

        //ModelPannel.isCanTrain(true);

        //可视化
        Vis.createBarChartForDataSet(imagesDataSet.train, imagesDataSet.validation, 'data-set-vis');

        //
        ValDataset.setImagesDataSetForValidation(imagesDataSet.validation);

        //
        Loading.removeLoading();

    });


    return importDataDiv;
};