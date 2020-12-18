
//剪切板的回调
let pasteFun=null;
let uploadImageForPredictEvent;

export function updateUploadImageForPredictEvent(f){
    uploadImageForPredictEvent=f;
}

export function updatePasteFun(f){
    pasteFun=f;
}

export function init(){
    document.addEventListener('paste', async (event)=> {
        
        var isChrome = false;
        if (event.clipboardData || event.originalEvent) {
            //某些chrome版本使用的是event.originalEvent
            var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
            if(clipboardData.items){
                // for chrome
                var  items = clipboardData.items,
                    len = items.length,
                    blob = null;
                isChrome = true;
                for (var i = 0; i < len; i++) {
                    // console.log(items[i]);
                    if (items[i].type.indexOf("image") !== -1) {
                        //getAsFile() 此方法只是living standard firefox ie11 并不支持
                        blob = items[i].getAsFile();
                    }
                };

                let res;
                if(uploadImageForPredictEvent){
                    res=await uploadImageForPredictEvent(blob);
                }
                
                //console.log(res,uploadImageForPredictEvent,pasteFun)
                if(pasteFun&&res){
                    pasteFun(res);
                }
            }
        }
    })
}