import { computed, defineComponent, inject, onMounted, ref } from "vue";

export default defineComponent({
  props: {
    block: {type: Object},
  },
  setup(props) {

    const blockStyles = computed(() => ({
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      zIndex:  props.block.zIndex
    }))
    const config = inject('config')
    const blockRef = ref(null)
    onMounted(() => {
      const { offsetWidth, offsetHeight } = blockRef.value;
      if(props.block.alignCenter) {
        // 原则上重新派发事件修改
        props.block.left = props.block.left - offsetWidth / 2
        props.block.top = props.block.top - offsetHeight / 2
        props.block.alignCenter = false
      }
      props.block.width = offsetWidth
      props.block.height = offsetHeight

    })

    return () => {
      const component = config.componentMap[props.block.key];
      const RenderComponent = component.render();

      return <div class = 'editor-block' style = {blockStyles.value} ref = {blockRef}>
      {RenderComponent}
     </div>
    }
  }
})