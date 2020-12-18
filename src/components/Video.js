import * as Base from './Base';
import * as DC from './Define-class';

let pannel=init();
const IMAGE_SIZE = 227;

let video, videoPlaying, currentClassDom, inputVideoAndTrain, timer;

let trainEvent,predictEvent;

export function updateTrainEvent(f){
    trainEvent=f;
}

export function updatePredictEvent(f){
    predictEvent=f;
}

//摄像头开关
function init() {

    const videoInputPannel = Base.createPannel("pannel");
    
    //标题
    (() => {
        videoInputPannel.appendChild(
            Base.createTitle("摄像头")
        );
    })();

    let videoButton = Base.createButton("打开");
    videoInputPannel.appendChild(videoButton);
    videoButton.addEventListener('click', () => {
        if (!video) {
            // 创建 video元素
            video = createVideo();
            videoButton.className = "on";
            videoButton.innerText = "已开启";
            videoButton.disabled = true;
            // Setup webcam
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then((stream) => {
                    video.srcObject = stream;
                    video.width = IMAGE_SIZE;
                    video.height = IMAGE_SIZE;
                    // h.body = 0;
                    video.addEventListener('playing', () => videoPlaying = true);
                    video.addEventListener('paused', () => videoPlaying = false);
                }).catch(e => {
                    console.log(e)
                });
        };
    });
    return videoInputPannel

};


export function get(){
    return pannel
}

export function startAndTrain(){
    inputVideoAndTrain = 1;
}

export function startPredict(){
    inputVideoAndTrain = 2;
}

export function start() {
    if(!video){
        pannel.querySelector('button').click();
        return setTimeout(start,3000);
    };
    // console.log(PANNELS.VIDEO,!video)
    if (timer) {
        stop();
    }
    video.play();
    videoPlaying = true;
    timer = requestAnimationFrame(animate);
}

export function stop() {
    //video.pause();
    videoPlaying = false;
    cancelAnimationFrame(timer);
}

//从视频获取截图
function getCurrentFrame(label) {
    let canvas = Base.createCanvas(200, parseInt(video.videoHeight * 200 / video.videoWidth));
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 200, canvas.height);
    canvas.setAttribute('data-label',label);
    return canvas
}


async function animate() {
    if (videoPlaying) {
        // console.log(videoPlaying, inputVideoAndTrain)
        if (inputVideoAndTrain == 1) {
            let label=currentClassDom.querySelector(".input-class-name").value.trim();
            if(trainEvent) await trainEvent(video, label);
            // await model.train(video, label);
            //显示数据集
            DC.createImageDivAndScroll(
                getCurrentFrame(label),
                currentClassDom.querySelector(".images"));
        };
        if (inputVideoAndTrain == 1 || inputVideoAndTrain == 2) {
            if(predictEvent){
                document.querySelector("#global-video span").innerText= await predictEvent(video);
            }
            // let res = await model.predict(video);
            // // console.log(res)
            //  = model.displayPredictResult(res);
        };

        timer = requestAnimationFrame(animate);
    };

};

export function updateCurrentClassDom(div){
    currentClassDom=div;
};

function createVideo() {
    let div = Base.createPannel("video", "global-video");
    document.body.appendChild(div);
    let info = Base.createInfo("-");
    let video = document.createElement('video');
    div.appendChild(video);
    div.appendChild(info);

    video.setAttribute('autoplay', true);
    video.setAttribute('playsinline', true);
    video.setAttribute('mute', true);
    return video
}
