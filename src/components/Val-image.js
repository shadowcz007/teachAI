import * as Base from './Base';
import * as Vis from './Vis';

let pannel = init();
let uploadImageForPredictEvent;

function init() {
    //验证模型
    const vaPannel = Base.createPannel("pannel");

    //标题
    (() => {
        vaPannel.appendChild(
            Base.createTitle("从图片验证模型")
        );
    })();
    //手动验证模型
    //上传一张
    const uploadImageAndPredictDiv = Base.createPannel("upload-image");
    vaPannel.appendChild(uploadImageAndPredictDiv);

    const uploadImagePreview = Base.createPannel("upload-image-preview");
    uploadImageAndPredictDiv.appendChild(uploadImagePreview);
    uploadImagePreview.setAttribute("alt", "上传图片");

    const uploadImageAndPredictInput = Base.createInput("file", false, "上传图片");
    uploadImageAndPredictDiv.appendChild(uploadImageAndPredictInput);
    uploadImageAndPredictInput.style.display = "none";

    uploadImageAndPredictInput.addEventListener("change", async(e) => {
        let file = e.target.files[0];
        let img = await uploadImageForPredict(file);
        if (uploadImageForPredictEvent) uploadImageForPredictEvent(img);
    });

    uploadImagePreview.addEventListener("click", (e) => {
        e.preventDefault();
        uploadImageAndPredictInput.click();
    });

    //可视化
    let visDom = Base.createPannel('vis', 'predict-result-top-k');
    uploadImageAndPredictDiv.appendChild(visDom);

    return vaPannel
};

export async function uploadImageForPredict(file) {
    let uploadImagePreview = document.querySelector('.upload-image-preview');
    if (!file) return;
    let img = await Base.file2Img(file);
    if (uploadImagePreview) uploadImagePreview.style.backgroundImage = `url(${img.src})`;
    return img
}


export function predictResultVis(top) {
    // console.log(top)
    Vis.createBarChart2(top, "predict-result-top-k");
}

export function get() { return pannel }

export function setEvent(f) {
    uploadImageForPredictEvent = f;
}
export function getEvent() {
    return uploadImageForPredictEvent;
}