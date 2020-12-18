import * as Base from './Base';
import * as Loading from './Loading';
import * as Data from './Dataset';
import * as Modify from './Modify';
import * as DefineClass from './Define-class';

let NUM_CLASSES = 0;
let pannel = init();

let modelReset;

let reTrain;

let saveButton, downloadButton;

let loadJSON, downloadJSON, saveJson2Local;

export function setLoadJSON(f) {
    loadJSON = f;
};

export function setDownloadJSON(f) {
    downloadJSON = f;
};

export function setSaveJson2Local(f) {
    saveJson2Local = f;
};

export function setReTrain(f) {
    reTrain = f;
}

function init() {
    //模型相关
    const modelPannel = Base.createPannel("pannel");

    //标题
    (() => {
        modelPannel.appendChild(
            Base.createTitle("模型相关")
        );
    })();
    let textInfo = Base.createInfo("模型信息");
    modelPannel.appendChild(textInfo);

    //重新训练
    let trainButton = Base.createButton("重新训练");
    console.log('init:', trainButton);

    modelPannel.appendChild(trainButton);

    trainButton.addEventListener("click", async() => {
        console.log(trainButton)
        trainButton.setAttribute("disabled", true);
        Loading.startLoading("训练中");
        trainButton.classList.add('disabled');

        // 用于训练的数据
        let imagesDataSetNew = {};

        //
        let imagesDataSet = Data.getImagesDataSet()

        if ((Object.keys(imagesDataSet.train)).length > 0) {
            imagesDataSetNew = imagesDataSet.train;
        } else {
            Array.from(Modify.get().querySelectorAll('.img-data'), d => {
                let label = d.getAttribute('data-label').trim();
                if (!imagesDataSetNew[label]) {
                    imagesDataSetNew[label] = [];
                };
                imagesDataSetNew[label].push(d);
            });
        };

        if ((Object.keys(imagesDataSetNew)).length > 0) {
            //需要清空knn
            if (modelReset) modelReset();
            if ((Object.keys(imagesDataSet.train)).length > 0) {
                for (const className in imagesDataSet.train) {
                    if (imagesDataSet.train.hasOwnProperty(className)) {
                        let div = DefineClass.createClassDiv(NUM_CLASSES, className);
                        let imagesDom = div.querySelector(".images");
                        await DefineClass.addImage2ImageDom(imagesDataSet.train[className], imagesDom, className);
                        NUM_CLASSES++;
                        Loading.setLoadingInfo(parseInt(100 * NUM_CLASSES / Object.keys(imagesDataSet.train).length) + "%");
                    }
                };
                Data.clearImagesDataSet();
                imagesDataSet.train = {};
            } else {
                // 用于训练的数据
                let imagesDataSetNew = {};

                Array.from(Modify.get().querySelectorAll('.img-data'), d => {
                    let label = d.getAttribute('data-label').trim();
                    if (!imagesDataSetNew[label]) {
                        imagesDataSetNew[label] = [];
                    };
                    imagesDataSetNew[label].push(d);
                });

                for (const className in imagesDataSetNew) {
                    await reTrain(imagesDataSetNew[className], className);
                }
            };
        };

        trainButton.removeAttribute('disabled');
        trainButton.classList.remove('disabled');
        Loading.removeLoading();
        console.log("完成训练")

    });

    //上传模型
    let loadInput = Base.createInput("file", false, "导入");
    loadInput.className = "hidden";
    modelPannel.appendChild(loadInput);

    let loadButton = Base.createButton("导入");
    // loadButton.id="import_model";
    modelPannel.appendChild(loadButton);
    loadButton.addEventListener('click', e => {
        loadInput.click();
    })

    loadInput.addEventListener("change", async(event) => {
        //  Loading.startLoading("加载模型");
        await loadJSON(event);
        // Loading.removeLoading();
    });

    //下载模型
    downloadButton = Base.createButton("下载");
    modelPannel.appendChild(downloadButton);
    downloadButton.addEventListener("click", () => {
        downloadJSON();
    });

    //保存
    let saveInput = Base.createInput("file", false, "保存");
    saveInput.className = "hidden";
    modelPannel.appendChild(saveInput);
    saveButton = Base.createButton("保存");
    modelPannel.appendChild(saveButton);
    saveButton.addEventListener("click", () => {
        saveJson2Local();
    });
    return modelPannel;

};

export function isCanTrain(bool) {

}

export function disableDownload(bool) {
    if (bool === true) {
        saveButton.classList.add("hidden");
        downloadButton.classList.add("hidden");
    } else {
        saveButton.classList.remove("hidden");
        downloadButton.classList.remove("hidden");
    }
}

export function get() { return pannel };

export function setText(text) {
    pannel.querySelector('.info').innerText = text;
};

export function updateClearEvent(f) {
    modelReset = f;
};