export function useMenuDragger(containerRef, data) {
  let currentComponent = null;
  const dragenter = (e) => {
    e.dataTransfer.dropEffect = "move"; // H5 拖动的图标
  };
  const dragover = (e) => {
    e.preventDefault();
  };
  const dragleave = (e) => {
    e.dataTransfer.dropEffect = "none"; // H5 拖动禁用的图标
  };
  const drop = (e) => {
    const blocks = data.value.blocks; // 内部已有的组件
    data.value = {
      ...data.value,
      blocks: [
        ...blocks,
        {
          top: e.offsetY,
          left: e.offsetX,
          zIndex: 1,
          key: currentComponent.key,
          alignCenter: true, // 希望松手的时候组件在鼠标居中位置
        },
      ],
    };

    currentComponent = null;
  };
  const dragstart = (e, component) => {
    currentComponent = component;
    // dragenter 进入元素中添加一个移动的标识
    // dragover 在目标元素经过 必须阻止默认行为， 否则不能触发 drop
    // dragleave 离开元素的时候， 需要增加一个禁用标识
    //  drop 松手的时候， 根据拖拽的组件添加一个组件
    containerRef.value.addEventListener("dragenter", dragenter);
    containerRef.value.addEventListener("dragover", dragover);
    containerRef.value.addEventListener("dragleave", dragleave);
    containerRef.value.addEventListener("drop", drop);
  };

  const dragend = (e) => {
    containerRef.value.removeEventListener("dragenter", dragenter);
    containerRef.value.removeEventListener("dragover", dragover);
    containerRef.value.removeEventListener("dragleave", dragleave);
    containerRef.value.removeEventListener("drop", drop);
  };

  return {
    dragend,
    dragstart,
  };
}
