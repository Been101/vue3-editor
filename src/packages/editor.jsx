import { ElTag } from "element-plus";
import { computed, defineComponent, inject, ref } from "vue";
import EditorBlock from "./editor-block";
import { useMenuDragger } from "./useMenuDragger";
import { useFocus } from "./useFocus";
import { useBlockDragger } from "./useBlockDragger";
export default defineComponent({
  props: {
    modelValue: { type: Object },
  },
  emits: ["update:modelValue"], // 要触发的事件, 用于代码提示
  setup(props, { emit }) {
    const data = computed({
      get() {
        return props.modelValue;
      },
      set(newValue) {
        emit("update:modelValue", newValue);
      },
    });

    const containerStyles = computed(() => ({
      width: data.value.container.width + "px",
      height: data.value.container.height + "px",
    }));
    console.log(data.value);
    const config = inject("config");

    const containerRef = ref(null);
    // 1. 菜单拖拽功能
    const { dragstart, dragend } = useMenuDragger(containerRef, data);

    // 2. 实现获取焦点
    const { blockMousedown, focusData, clearBlockFocus } = useFocus(data, (e) => {
        // 3. 拖拽多个元素的功能
      mousedown(e)
    });

    const { mousedown } = useBlockDragger(focusData);

   
    const containerMousedown = (e) => {
      clearBlockFocus();
    };

  

    return () => (
      <div class="editor">
        <div class="editor-left">
          <div>
            {config.componentList.map((component) => {
              return (
                <div
                  class="editor-left-item"
                  draggable
                  onDragstart={(e) => {
                    console.log(e);
                    dragstart(e, component);
                  }}
                  onDragend={dragend}
                >
                  <ElTag class="editor-left-item-label">
                    {component.label}
                  </ElTag>
                  <span class="editor-left-item-preview">
                    {component.preview()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div class="editor-container">
          <div class="editor-container-top">菜单栏</div>
          <div
            class="editor-container-canvas"
            ref={containerRef}
            onMousedown={containerMousedown}
          >
            <div
              className="editor-container-canvas__content"
              style={containerStyles.value}
            >
              {data.value.blocks.map((block) => (
                <EditorBlock
                  class={block.focus ? "editor-block-focus" : ""}
                  onMousedown={(e) => blockMousedown(e, block)}
                  block={block}
                ></EditorBlock>
              ))}
            </div>
          </div>
        </div>
        <div class="editor-right">属性控制栏目</div>
      </div>
    );
  },
});
