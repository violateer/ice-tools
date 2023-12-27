import { defineComponent } from "vue";
import "./App.scss";
import { RouterView } from "vue-router";

export default defineComponent({
  setup() {
    return () => <RouterView />;
  },
});
