import { PropType, defineComponent, ref } from "vue";
import s from "./Home.module.scss";

export const Home = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup(props, context) {
    return () => <div class={s.wrapper}>home</div>;
  },
});
