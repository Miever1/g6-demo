import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import G6, { Fisheye, Graph, Grid, Minimap } from '@antv/g6';
import { Space } from 'antd';
import { PictureFilled, EyeFilled, FileImageFilled } from '@ant-design/icons';

import { data } from "./data";

function App() {
  let graph: Graph | null = null;
  const ref: any = React.useRef(null);
  let fisheye = new Fisheye({
    r: 120
  });
  let grid = new Grid();
  const minimap = new Minimap({
    size: [100, 100],
    className: 'minimap',
    type: 'delegate',
  });
  const [pluginsState, setPluginsState] = useState({
    fisheye: false,
    minimap: false
  })
  

  useEffect(() => {
    const con: any = ReactDOM.findDOMNode(ref.current);
    if (!graph) {
      graph = new G6.Graph({
        container: con,
        width: 800,
        height: 800,
        modes: {
          default: ['zoom-canvas', 'drag-canvas', 'drag-node', 'activate-relations'],
        },
        layout: {
          type: 'forceAtlas2',
          preventOverlap: true,
          kr: 10,
          center: [250, 250],
        },
        defaultNode: {
          size: 20,
        },
        plugins: [grid],
    });
    }
    data.nodes.forEach((node: any) => {
      node.x = Math.random() * 1;
    });
    graph.on('afterlayout', () => {
      graph?.fitView()
    })
    graph.data(data);
    graph.render();
    graph.on('node:mouseenter', (e: any) => {
      const nodeItem = e.item;
      // 设置目标节点的 hover 状态 为 true
      graph?.setItemState(nodeItem, 'hover', true);
    });
    // 监听鼠标离开节点
    graph.on('node:mouseleave', (e: any) => {
      const nodeItem = e.item;
      // 设置目标节点的 hover 状态 false
      graph?.setItemState(nodeItem, 'hover', false);
    });
    return () => {
      graph?.destroy();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: "50px",
      width: 800,
      height: 800
    }}>
      <div style={{
        position: "relative"
      }}>
        <div
          style={{
            display: "flex",
            padding: "16px",
            width: "100%",
            justifyContent: "space-between"
          }}
        >
          <Space>
            <EyeFilled
              onClick={() => {
                setPluginsState({
                  ...pluginsState,
                  fisheye: !pluginsState['fisheye']
                });
                if (!pluginsState['fisheye']) {
                  graph?.addPlugin(fisheye);
                } else {
                  graph?.removePlugin(fisheye);
                }
              }}
            />
            <PictureFilled
              onClick={() => {
                setPluginsState({
                  ...pluginsState,
                  minimap: !pluginsState['minimap']
                });
                if (!pluginsState['minimap']) {
                  graph?.addPlugin(minimap);
                } else {
                  graph?.removePlugin(minimap);
                }
              }}
            />
            <FileImageFilled
              onClick={() => {
                graph?.downloadFullImage("typo", undefined, {
                  backgroundColor: "#FFF"
                });
              }}
            />
          </Space>
        </div>
      </div>
    </div>
  );
}

export default App;
