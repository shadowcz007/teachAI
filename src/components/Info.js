import * as Base from './Base';

let pannel=init();

function init(){
    const visPannel = Base.createPannel("pannel");
    //标题
    (() => {
        visPannel.appendChild(
            Base.createTitle("可视化")
        );
    })();
    //可视化
    let visDiv = Base.createPannel('vis-container');
    visPannel.appendChild(visDiv);

    let visDom = Base.createPannel('vis', 'data-set-vis');
    visDiv.appendChild(visDom);

    //提示
    let infoText = Base.createInfo("");
    visDiv.appendChild(infoText);
    return visPannel
}

export function get(){
    return pannel;
}

export function setText(text){
    if(pannel) pannel.querySelector(".info").innerText =text;
}