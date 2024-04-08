export default {
  methods: {
    transformApiData(apiData, locales, nodeConnections) {
      let locale = ''
      if (locales.data.data.length) {
        for (let item of locales.data.data) {
          locale += item.locale + ', '
        }

        if (locale.at(-1) === ' ') {
          locale = locale.slice(0, -2)
        }
      } else {
        locale = 'no locales'
      }

      const transformedData = {
        drawflow: {
          Home: {
            data: {
              "1": {
                "id": 1,
                "name": "Node 1",
                "data": {},
                "class": "nodeOne",
                "html": `<div class="card-devices center"><span>/start</span></div>`,
                "typenode": false,
                "inputs": {},
                "outputs": {
                  "output_1": {
                    "connections": [
                      {
                        "node": "2",
                        "output": "input_1"
                      }
                    ]
                  }
                },
                "pos_x": 0,
                "pos_y": 250
              },
              "2": {
                "id": 2,
                "name": "Node 2",
                "data": {},
                "class": "nodeTwo",
                "html": `<div class="card-devices center"><span></span></div>`,
                "typenode": false,
                "inputs": {
                  "input_1": {
                    "connections": [
                      {
                        "node": "1",
                        "input": "output_1"
                      }
                    ]
                  }
                },
                "outputs": {
                  "output_1": {
                    "connections": [
                      {
                        // "node": "3",
                        "output": 'input_1'
                      }
                    ]
                  }
                },
                "pos_x": 270,
                "pos_y": 250
              },
            }
          }
        }
      };

      transformedData.drawflow.Home.data['2'].html = `<div class="card-devices center"><span>${locale}</span></div>`;
      transformedData.drawflow.Home.data['1'].pos_y = window.innerHeight / 2 - 50;
      transformedData.drawflow.Home.data['2'].pos_y = window.innerHeight / 2 - 50;

      if (apiData && apiData.length) {
        apiData.forEach((item, index) => {
          transformedData.drawflow.Home.data[`${item.id}`] = {
            id: item.id,
            name: `Node ${item.id}`,
            data: {},
            class: `${item.btn_type.toLowerCase()}`,
            html: `<div class="card-devices"><span>${item.alias}</span><p class="corner">${item.id}</p></div>`,
            typenode: false,
            inputs: {},
            outputs: {},
            pos_x: item.x_,
            pos_y: item.y_
          };
        });

        const lowestOrderNode = apiData.reduce((prev, current) => {
          return (prev.stage_order < current.stage_order) ? prev : current
        });
        const firstDynamicNode = transformedData.drawflow.Home.data[lowestOrderNode.id];

        const secondStaticNode = transformedData.drawflow.Home.data['2'];
        if (firstDynamicNode && secondStaticNode) {
          secondStaticNode.outputs = {
            output_1: {
              connections: [
                {
                  node: firstDynamicNode.id,
                  output: 'input_1'
                }
              ]
            }
          };
          firstDynamicNode.inputs = {
            input_1: {
              connections: [
                {
                  node: '2',
                  input: 'output_1'
                }
              ]
            }
          };
        }
      }


      const connections = [...nodeConnections.data.data.btns, ...nodeConnections.data.data.states];
      if (connections) {
        connections.forEach((connection) => {
          if (transformedData.drawflow.Home.data[connection.output_]) {
            if (!transformedData.drawflow.Home.data[connection.output_].outputs) {
              transformedData.drawflow.Home.data[connection.output_].outputs = {};
            }
            if (!transformedData.drawflow.Home.data[connection.output_].outputs.output_1) {
              transformedData.drawflow.Home.data[connection.output_].outputs.output_1 = { connections: [] };
            }
            transformedData.drawflow.Home.data[connection.output_].outputs.output_1.connections.push({
              node: connection.input_,
              output: 'input_1'
            });
          }
          if (transformedData.drawflow.Home.data[connection.input_]) {
            if (!transformedData.drawflow.Home.data[connection.input_].inputs) {
              transformedData.drawflow.Home.data[connection.input_].inputs = {};
            }
            if (!transformedData.drawflow.Home.data[connection.input_].inputs.input_1) {
              transformedData.drawflow.Home.data[connection.input_].inputs.input_1 = { connections: [] };
            }
            transformedData.drawflow.Home.data[connection.input_].inputs.input_1.connections.push({
              node: connection.output_,
              input: 'output_1'
            });
          }
        });
      }

      return transformedData
    }

  }
}