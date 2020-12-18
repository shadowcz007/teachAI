import * as Base from './Base';
import * as Video from './Video';

// let currentClassDom;

let addEvent,augment;

export function setEvent(f){
    addEvent=f;
}

export function setAugment(f){
    augment=f;
}

// export function bindAugmentOne(f){
//     augmentOne=f;
// }


//逐张增强数据
async function augmentOne(targetImages = []) {
    //console.log(imagesDataSet)
    let c = targetImages.pop();
    if (c) {
        let label=c[1],imgElement=c[0];
        let cs = await augment.run(imgElement);
        Array.from(cs, s => {
            s.setAttribute('data-label',label);
            let imgDiv = createImageDiv(s);
            Base.insertAfter(imgDiv, imgElement.parentElement);
        });
        await augmentOne(targetImages);
    };
}


//数据集中的单张图片,包括关闭、调整等其他功能
export function createImageDiv(imgDataElement) {
    imgDataElement.className = "img-data";

    let label=imgDataElement.getAttribute('data-label');

    let imgDiv = Base.createPannel('img');
    let buttonDiv= Base.createPannel('button-div');
    let augmentButton = Base.createButton("数据增强");
    let closeButton = Base.createButton("删除");
    
    augmentButton.className='hover-btn';
    closeButton.className = "hover-btn";

    augmentButton.addEventListener("click",async e => {
        console.log(label)
        await augmentOne([[imgDataElement, label]]);
    });

    closeButton.addEventListener("click", e => {
        if (confirm("是否删除")) {
            imgDiv.remove();
        };
    });

    imgDiv.appendChild(imgDataElement);
    imgDiv.appendChild(buttonDiv);
    buttonDiv.appendChild(augmentButton);
    buttonDiv.appendChild(closeButton);
    
    return imgDiv
}

export  function createImageDivAndScroll(imgDataElement, imagesDom) {
    let imgDiv = createImageDiv(imgDataElement);
    imagesDom.appendChild(imgDiv);
    if (imagesDom.scrollTo) {
        imagesDom.scrollTo(0, imagesDom.scrollHeight * 10);
    }
}


function createImageDataSet() {
    //训练数据集
    const imagesDom = Base.createPannel("images");
    return imagesDom
}


export function initClassDiv(){
    document.body.querySelector("#data-set-all").innerHTML="";
};


//创建gui 每个类别
export function createClassDiv(classId, className) {
    if(!classId){
        classId=parseInt(10000*Math.random())+(new Date()).getTime();
    };
    //类别容器
    //const div = createPannel(className || "class_" + classId, "class_" + classId);
    const div = Base.createPannel('data-set-class', "class_" + classId);
    // div.setAttribute("data-label",);
    //训练数据集
    const imagesDom = createImageDataSet();
    //设置label
    const labelInput = Base.createInput("text");
    labelInput.className = "input-class-name";
    // 创建摄像头采集按钮
    const fromVideoButton = Base.createButton("从摄像头采集");
    //创建上传图片按钮
    const fromUploadInput = Base.createInput("file", true);
    fromUploadInput.className = "hidden";
    const fromUploadButton = Base.createButton("导入图片");

    //删除按钮
    const deleteButton = Base.createButton("删除");

    // 创建信息框
    //const infoText = createInfo(" No examples added");
    Video.updateCurrentClassDom(div);

    div.style.marginBottom = '10px';

    labelInput.value = className || div.id;

    fromVideoButton.setAttribute("data-clicked", 0);

    // Listen for mouse events when clicking the button
    fromVideoButton.addEventListener('click', (e) => {
        Video.startAndTrain();
        let isClicked = ~~(fromVideoButton.getAttribute("data-clicked"));
        // console.log(isClicked)
        if (isClicked == 0) {
            // this.training = labelInput.value.trim();
            Video.updateCurrentClassDom(div);
            Video.start();
            fromVideoButton.setAttribute("data-clicked", 1);
            fromVideoButton.innerText = "停止采集";
        } else {
            // this.training = -1;
            Video.stop();
            fromVideoButton.setAttribute("data-clicked", 0);
            fromVideoButton.innerText = "从摄像头采集";
        };
    });

    fromUploadInput.addEventListener("change", async(e) => {
        // console.log(e.target.files);
        let className=labelInput.value.trim();
        await addImage2ImageDom(e.target.files, imagesDom, className);

    });

    fromUploadButton.addEventListener("click", e => {
        fromUploadInput.click();
    })

    //this.infoTexts.push(infoText);

    div.appendChild(labelInput);
    div.appendChild(fromVideoButton);
    div.appendChild(fromUploadInput);
    div.appendChild(fromUploadButton);
    div.appendChild(deleteButton);
    div.appendChild(imagesDom);
    
    let dataSetChildren=document.body.querySelectorAll(".data-set-class");
    
    if(dataSetChildren.length>0){
        // console.log(dataSetChildren[0])
        document.body.querySelector("#data-set-all").insertBefore(div,dataSetChildren[0]);
    }else{
        document.body.querySelector("#data-set-all").appendChild(div);
    }
    

    return div
}


// 把本地图片批量添加到dom里
export async function addImage2ImageDom(files, imagesDom, className) {
    // let dataForTrain = [];
    for (let index = 0; index < files.length; index++) {
        const f = files[index];
        let img = await Base.file2Img(f);
        img.setAttribute('data-label',className);
        createImageDivAndScroll(img, imagesDom);
        if(addEvent) addEvent(img, className);
        // await model.train(img, className);
    };
    // return dataForTrain
};

// export function getCurrentClassDom(){
//     return currentClassDom
// }