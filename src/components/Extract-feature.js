 import * as Base from './Base';
 
let pannel=init();
let changeFeatureEvent=null;
 
function init(){
    const extractForFeatureDiv = Base.createPannel("pannel");
    
    //标题
    (() => {
        extractForFeatureDiv.appendChild(
            Base.createTitle("特征抽取器")
        );
    })();

    let input=Base.createInput("text");
    input.value="mobilenet";
    input.addEventListener("change",e=>{
        e.preventDefault();
        if(changeFeatureEvent)changeFeatureEvent(input.value);
        // var res=model.setFeatureType(input.value);
        // console.log(res)
    });
    extractForFeatureDiv.appendChild(input);

    return extractForFeatureDiv
    
}

export function get(){
    return pannel
}

export function setEvent(fun){
    changeFeatureEvent=fun;
}