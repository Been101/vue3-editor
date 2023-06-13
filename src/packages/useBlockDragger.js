import { reactive } from "vue";

export function useBlockDragger(focusData, lastSelectBlock, data) {
  let dragState = {
    startX: 0,
    startY: 0,
  };

  const markLine = reactive({
    x: null,
    y: null,
  });

  const mousemove = (e) => {
    let { clientX, clientY } = e;
    // 计算当前元素最新的 left 和 top, 去线里面找， 找到显示线
    // 鼠标移动后 - 鼠标移动前 + left
    const top = clientY - dragState.startY + dragState.startTop;
    const left = clientX - dragState.startX + dragState.startLeft;
    let x = null;
    let y = null;
    for (let i = 0; i < dragState.lines.y.length; i++) {
      const { top: t, showTop: s } = dragState.lines.x[i];
      if (Math.abs(t - top) < 5) {
        y = s; // 线要显示的位置
        clientX = dragState.startY - dragState.startTop + t; //
        break; // 找到一根线就跳出循环
      }
    }

    for (let i = 0; i < dragState.lines.x.length; i++) {
      const { left: l, showLeft: s } = dragState.lines.x[i];
      if (Math.abs(l - left) < 5) {
        x = s; // 线要显示的位置
        clientX = dragState.startX - dragState.startLeft + l; //
        break; // 找到一根线就跳出循环
      }
    }

    // const durX = l - dragState.startLeft // 这是有辅助线的时候，可以这么计算
    // const durY = t - dragState.startTop
    markLine.x = x;
    markLine.y = y;
    const durX = clientX - dragState.startX; // 没有辅助线的时候，这么计算
    const durY = clientY - dragState.startY;
    focusData.value.focus.forEach((block, i) => {
      block.top = dragState.startPos[i].top + durY;
      block.left = dragState.startPos[i].left + durX;
    });
  };

  const mouseup = (e) => {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
    markLine.x = null;
    markLine.y = null;
  };
  const mousedown = (e) => {
    const { width: BWidth, height: BHeight } = lastSelectBlock.value;
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: lastSelectBlock.value.left, // 拖拽 B 的初始左右的位置
      startTop: lastSelectBlock.value.top, // 拖拽 B的初始上下的位置
      startPos: focusData.value.focus.map(({ top, left }) => ({ top, left })),
      lines: (() => {
        const { unfocused } = focusData.value;
        const lines = { x: [], y: [] }; // 计算横线的位置用 y 来存放， x 存放纵向的位置
        [
          {
            top: 0,
            left: 0,
            width: data.value.container.width,
            height: data.value.container.height,
          },
          ...unfocused,
        ].forEach((block) => {
          const {
            top: ATop,
            left: ALeft,
            width: AWidth,
            height: AHeight,
          } = block;
          // showTop 是 辅助线显示的位置， top 是B 组件拖动的 top
          // 顶对顶
          lines.y.push({ showTop: ATop, top: ATop });
          // 底对顶
          lines.y.push({ showTop: ATop, top: ATop - BHeight });
          // 中对中
          lines.y.push({
            showTop: ATop + AHeight / 2,
            top: ATop + AHeight / 2 - BHeight / 2,
          });
          // 顶对底
          lines.y.push({ showTop: ATop + AHeight, top: ATop + AHeight });
          // 底对底
          lines.y.push({
            showTop: ATop + AHeight,
            top: ATop + AHeight - BHeight,
          });
          // 左对左
          lines.x.push({ showLeft: ALeft, left: ALeft });
          // 左对右
          lines.x.push({ showLeft: ALeft + AWidth, left: ALeft + AWidth });
          // 中对中
          lines.x.push({
            showLeft: ALeft + AWidth / 2,
            left: ALeft + AWidth / 2 - BWidth / 2,
          });
          // 右对右
          lines.x.push({
            showLeft: ALeft + AWidth,
            left: ALeft + AWidth - BWidth,
          });
          // 左对右
          lines.x.push({ showLeft: ALeft, left: ALeft - BWidth });
        });

        return lines;
      })(),
    };

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  };

  return {
    mousedown,
    markLine,
  };
}
