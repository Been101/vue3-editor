import { computed, ref } from "vue";
export function useFocus(data, callback) {
  const selectIndex = ref(-1); // 没有选中任何组件
  let lastSelectBlock = computed(() => data.value.blocks[selectIndex.value]);
  const focusData = computed(() => {
    const focus = [];
    const unfocused = [];
    data.value.blocks.forEach((block) =>
      (block.focus ? focus : unfocused).push(block)
    );

    return { focus, unfocused };
  });

  const clearBlockFocus = () => {
    data.value.blocks.forEach((block) => (block.focus = false));
  };
  const containerMousedown = (e) => {
    clearBlockFocus();
    selectIndex.value = -1;
  };
  const blockMousedown = (e, block, idx) => {
    console.log(block);
    e.preventDefault();
    e.stopPropagation();
    if (e.ctrlKey) {
      if (focusData.value.focus.length <= 1) {
        block.focus = true;
      } else {
        block.focus = !block.focus;
      }
    } else {
      // block 上加个属性， 获取焦点后就 focus 变成 true
      if (!block.focus) {
        clearBlockFocus();
        block.focus = true;
      } // else 当自己已经是选中状态， 再次点击不取消选中状态
    }

    selectIndex.value = idx;
    callback(e);
  };

  return {
    blockMousedown,
    focusData,
    containerMousedown,
    lastSelectBlock,
  };
}
