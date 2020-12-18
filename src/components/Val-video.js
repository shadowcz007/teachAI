import * as Base from './Base';

let pannel =init();
let predictEvent;

function init(){
    //验证模型
    const vaPannel = Base.createPannel("pannel");
    
    //标题
    (() => {
        vaPannel.appendChild(
            Base.createTitle("从摄像头验证模型")
        );
    })();

    //验证模型,摄像头
    let predictButton = Base.createButton("从摄像头");
    vaPannel.appendChild(predictButton);
    // predictButton.addEventListener('click', async() => {
    //     inputVideoAndTrain = 2;
    //     start();
    // });
    predictButton.addEventListener('click',e=>{
        if (predictEvent) predictEvent();
    })
    return vaPannel
}

export function get(){
    return pannel
}

export function setPredictEvent(fun){
    predictEvent=fun;
}