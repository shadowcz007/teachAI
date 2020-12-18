import * as tf from '@tensorflow/tfjs';
import * as Info from './Info';
import * as Base from './Base';
import * as Loading from './Loading';
import * as DefineClass from './Define-class';
import * as model from '../model';


let pannel = init();
let imagesDataSetForValidation;

export function setImagesDataSetForValidation(obj) {
    imagesDataSetForValidation = obj;
}

export function get() {
    return pannel;
}

function init() {
    let valDatasetDiv = Base.createPannel("pannel");

    valDatasetDiv.appendChild(
        Base.createTitle("验证集")
    );

    //验证模型
    let validationButton = Base.createButton("验证数据集");
    valDatasetDiv.appendChild(validationButton);

    //验证集：多张图片
    let valImagesDiv = Base.createPannel('images');
    valDatasetDiv.appendChild(valImagesDiv);


    validationButton.addEventListener("click", async() => {
        Loading.startLoading("验证中");
        let yTrue = [],
            yPred = [];
        let i = 0;
        //验证数据显示
        valImagesDiv.innerHTML = '';
        for (const className in imagesDataSetForValidation) {
            if (imagesDataSetForValidation.hasOwnProperty(className)) {
                for (let index = 0; index < imagesDataSetForValidation[className].length; index++) {
                    const f = imagesDataSetForValidation[className][index];
                    let img = await Base.file2Img(f);
                    // console.log(img)
                    let result = await model.predict(img);
                    let top = model.getTopK(result);
                    top = Array.from(top, s => s.className);
                    let valVector = Array.from(Array.from(Object.keys(result.confidences), c => {
                        return { index: model.knn.labelToClassId[c], value: result.confidences[c] }
                    }).sort((a, b) => {
                        return a.index - b.index
                    }), v => v.value);
                    yTrue.push(model.knn.labelToClassId[className]);
                    yPred.push(valVector);

                    //验证数据集显示
                    img.setAttribute('data-label', className);
                    let imgDiv = DefineClass.createImageDiv(img);
                    imgDiv.querySelector('.button-div').innerHTML = `<button class="hover-btn">${top}</button>`;
                    valImagesDiv.appendChild(imgDiv)
                };
                i++;
                Loading.setLoadingInfo(parseInt(100 * i / Object.keys(imagesDataSetForValidation).length));
            }
        };
        //console.log(valImagesDiv)

        yTrue = tf.tensor1d(yTrue);
        yPred = tf.tensor2d(yPred);
        const accuracy = tf.metrics.sparseCategoricalAccuracy(yTrue, yPred);

        // const accuracy = tf.metrics.binaryAccuracy(yTrue, crossentropy);
        // let newCounts = validationData.filter(d => d.right);
        // console.log(accuracy.sum().dataSync()[0],yTrue.length)
        // newCounts = eval((Array.from(newCounts, c => c.right)).join("+"));
        Info.setText(`准确率${accuracy.sum().dataSync()[0]/yTrue.size}`);

        Loading.removeLoading();
    });
    return valDatasetDiv;
}