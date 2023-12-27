import { PropType, defineComponent } from "vue";
import s from "./NotFound.module.scss"
import { NResult } from "naive-ui";

export const NotFound = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup() {
    return () => (
      <div class={s.wrapper}>
        <NResult
          status="404"
          title="404 资源不存在"
          description="生活总归带点荒谬"
        ></NResult>
      </div>
    );
  },
});
