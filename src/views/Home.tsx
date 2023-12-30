import { PropType, defineComponent, ref } from "vue";
import s from "./Home.module.scss";
import { TabPane, Tabs, TabsProps } from "ant-design-vue";
import { JsonToExcel } from "@/components/JsonToExcel";

export const Home = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup() {
    const refActiveKey = ref("1");
    const refTabPosition = ref<TabsProps["tabPosition"]>("top");
    return () => (
      <>
        <div class={s.wrapper}>
          <Tabs
            v-model:activeKey={refActiveKey.value}
            tab-position={refTabPosition.value}
            class={s.tabs}
          >
            <TabPane key="1" tab="Json转Excel">
              <JsonToExcel />
            </TabPane>
            {/* <TabPane key="2" tab="Tab 2">
              Content of Tab 2
            </TabPane>
            <TabPane key="3" tab="Tab 3">
              Content of Tab 3
            </TabPane> */}
          </Tabs>
        </div>
      </>
    );
  },
});
