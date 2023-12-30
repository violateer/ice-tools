import { PropType, defineComponent } from "vue";
import s from "./NotFound.module.scss";
import { Result } from "ant-design-vue";

export const NotFound = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup() {
    return () => (
      <div class={s.wrapper}>
        <Result
          status="403"
          title="403"
          sub-title="Sorry, you are not authorized to access this page."
        ></Result>
      </div>
    );
  },
});
