import * as vega from 'vega-embed';
// console.log(vega)


export function createBarChartForDataSet(dataForTrain, dataForVal, id) {
    let values = [];
    for (const label in dataForTrain) {
        if (dataForTrain.hasOwnProperty(label)) {
            const dt = dataForTrain[label];
            const dv = dataForVal[label];
            values.push({
                label: label,
                trainingSet: dt?dt.length:0,
                validationSet:dv?dv.length:0
            });
        }
    };

    // vis.createBarChart(values, id,"数据集分布情况");
    createPyramid(values,id,'数据集分布情况');
};


// values=[
//     { "category": "A", "amount": 28 },
//     { "category": "B", "amount": 55 }
// ]
export function createBarChart(values = [], id = "vis",title="Bar Chart", width = 600, height = 100, padding = 12) {
    let data={
        title: {
            text:title,
            anchor: "start",
            limit:198
        },
        data: {
            values: values
        },
        vconcat: [{
            width:width,
            height:height,
            mark: "bar",
            encoding: {
                x: {field: 'label', type: 'ordinal'},
                y: {field: 'trainingSet', type: 'quantitative'}
            }
          }, {
            width:width,
            height:height,
            mark: "bar",
            encoding: {
                x: {field: 'label', type: 'ordinal'},
                y: {field: 'validationSet', type: 'quantitative'}
            }
          }]
    };
    render(data, id);
};

export function createPyramid(values=[],id="vis",title="xxxxx",width=600,height=600){
    values=values.sort((a,b)=>b.trainingSet-a.trainingSet);
    let maxX=values[0].trainingSet;
    let data={
        title:{
            text:title
        },
        data:{
            values:values
        },
        hconcat: [{
            title: "trainingSet",
            mark: "bar",
            encoding: {
                x: {
                    field: 'trainingSet', 
                    type: 'quantitative',
                    sort:"descending",
                    scale: {
                        domain: [0, maxX]
                      }
                },
                y: {field: 'label', 
                    axis: null,
                    type: 'ordinal',
                    sort:{
                        // op: "sum",
                        field: "trainingSet"
                    }},
                color: {
                    scale: {
                        range: ["#675193", "#ca8861"]
                    },
                    legend: null
                },
                tooltip: {field: "trainingSet", type: "quantitative"}
            }
          }, {
            width: 20,
            view: {
                stroke: null
            },
            mark: {
              type: "text",
              align: "center"
            },
            encoding: {
                y: {
                    field: "label", 
                    type: "ordinal", 
                    axis: null,
                    sort:{
                        // op: "sum",
                        field: "trainingSet"
                        }
                    },
                text: {
                    field: "label", 
                    type: "ordinal"
                    },
                tooltip: [
                    {field: "trainingSet", type: "quantitative",title:"训练集"},
                    {field: "validationSet", type: "quantitative",title:"验证集"}
                ]
            }
          },
          {
            title: "validationSet",
            mark: "bar",
            encoding: {
                x: {
                    field: 'validationSet', 
                    type: 'quantitative',
                    sort:"ascending",
                    scale: {
                        domain: [0, maxX]
                      }
                    },
                y: {field: 'label',axis: null, type: 'ordinal',sort:{
                    // op: "sum",
                    field: "trainingSet"
                }},
                color: {
                    scale: {
                        range: ["#675193", "#ca8861"]
                    },
                    legend: null
                },
                tooltip: {field: "validationSet", type: "quantitative"}
            }
          } 
        ],
          config: {
            view: {
                stroke: null},
            axis: {
                grid: false
            }
          }
    };
    render(data, id);
}

// [{
//     "label":"2",
//     "score":0.1
//   }]
export function createBarChart2(values = [], id = "vis"){
    let data={
        "width": 200,
        "height": 240,
        "data": {values:values},
        "encoding": {
            "y": {
              "field": "className",
              "type": "nominal",
              "axis": null
            }
          },
          "layer": [{
            "mark": {"type": "bar", "color": "#ddd"},
            "encoding": {
              "x": {
                "type": "quantitative",
                "field": "score",
                "scale":{"domain":[0,1]},
                "title": "分数"
              }
            }
          }, {
            "mark": {"type": "text", "align": "left", "x": 5},
            "encoding": {
              "text": {"field": "className"}
            }
          }]
      }; 
      render(data, id); 
};




export let view;
// export default version = "1.0";

export function render(json, id) {
    vega.embed('#'+id, json);
};