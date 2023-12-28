import { PropType, defineComponent, onMounted, ref } from "vue";
import s from "./JsonToExcel.module.scss";
import { Button, Table, Textarea } from "ant-design-vue";
import { DownloadOutlined, SwapOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

export const JsonToExcel = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup() {
    const refJsonContent = ref("");
    const refDataReviewEl = ref<HTMLDivElement>();
    const refDataReviewHeight = ref(0);
    const refColumns = ref<any[]>([]);

    const refData = ref<any[]>([]);

    const TransJsonValue = () => {
      if (!refJsonContent.value) return false;

      const jsonStr = refJsonContent.value
        .replace(/^(\s|')+|(\s|')+$/g, "")
        .replace(/^(\s|")+|(\s|")+$/g, "");
      try {
        const json = JSON.parse(jsonStr);
        if (!isArrayOfObjects(json)) throw new Error("JSON需要是对象数组！");

        dealData(json);
      } catch (error: any) {
        if (String(error).includes("SyntaxError")) {
          console.log(error);

          message.warning("JSON字符串格式不正确！");
        } else {
          message.warning(error?.message);
        }
      }
    };

    // 处理数据
    const dealData = (data: any[]) => {
      clearData(false);

      data.forEach((row) => {
        refData.value.push(row);

        Object.keys(row).forEach((field) => {
          if (refColumns.value.filter((v) => v.title == field).length == 0) {
            refColumns.value.push({
              title: field,
              dataIndex: field,
              width: 200,
            });
          }
        });
      });
    };

    // 清空数据
    const clearData = (isClearJson = true) => {
      if (isClearJson) refJsonContent.value = "";

      refData.value = [];
      refColumns.value = [];
    };

    // 判断是对象构成的数组
    const isArrayOfObjects = (arr: any) => {
      // 首先检查 arr 是否是数组
      if (Array.isArray(arr)) {
        // 遍历数组中的每个元素
        for (let i = 0; i < arr.length; i++) {
          // 使用 typeof 操作符检查元素是否是对象
          if (
            typeof arr[i] !== "object" ||
            arr[i] === null ||
            Array.isArray(arr[i])
          ) {
            // 如果不是对象，则返回 false
            return false;
          }
        }
        // 如果数组中的所有元素都是对象，则返回 true
        return true;
      } else {
        // 如果不是数组，则返回 false
        return false;
      }
    };

    onMounted(() => {
      refDataReviewHeight.value =
        (refDataReviewEl.value?.offsetHeight || 0) - 56;
    });

    return () => (
      <div class={s.wrapper}>
        <div class={s.jsonContent}>
          <Textarea
            v-model:value={refJsonContent.value}
            placeholder="请输入JSON数据，格式为一维数组，键名即为excel列名"
            class={s.jsonTextArea}
          />
        </div>
        <div class={s.actions}>
          <Button type="primary" size={"middle"} onClick={TransJsonValue}>
            <SwapOutlined />
            转换Excel
          </Button>
          <Button type="primary" size={"middle"}>
            <DownloadOutlined />
            下载Excel
          </Button>
          <Button type="dashed" size={"middle"} onClick={() => clearData()}>
            清空
          </Button>
        </div>
        <div class={s.dataReview} ref={refDataReviewEl}>
          <Table
            columns={refColumns.value}
            data-source={refData.value}
            bordered
            pagination={false}
            scroll={{
              y: refDataReviewHeight.value,
            }}
          ></Table>
        </div>
      </div>
    );
  },
});
