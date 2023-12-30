import { PropType, defineComponent, onMounted, ref } from "vue";
import s from "./JsonToExcel.module.scss";
import { Button, Spin, Table, Textarea } from "ant-design-vue";
import { DownloadOutlined, SwapOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { utils, writeFile } from "xlsx";
import dayjs from "dayjs";

export const JsonToExcel = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup() {
    const refJsonContent = ref(
      '[{"分组1":"馨兰","分组2":"慧美","分组3":"虹影"},{"分组1":"虹雨","分组2":"虹英","分组3":"慧艳"},{"分组1":"慧云","分组2":"慧颖","分组3":"怀玉"},{"分组1":"慧捷","分组2":"慧俊","分组3":"和洽"},{"分组1":"晗昱","分组2":"虹颖","分组3":"虹彩"},{"分组1":"慧心","分组2":"慧雅","分组3":"浩岚"},{"分组1":"馨欣","分组2":"慧智","分组3":"慧月"},{"分组1":"慧英","分组2":"慧巧","分组3":"慧秀"},{"分组1":"红螺","分组2":"慧丽","分组3":""}]'
    );
    const refDataReviewEl = ref<HTMLDivElement>();
    const refDataReviewHeight = ref(0);
    const refColumns = ref<any[]>([]);
    const refSpinning = ref(false);

    const refData = ref<any[]>([]);

    const TransJsonValue = () => {
      if (!refJsonContent.value) return false;

      refSpinning.value = true;

      const jsonStr = refJsonContent.value
        .replace(/^(\s|')+|(\s|')+$/g, "")
        .replace(/^(\s|")+|(\s|")+$/g, "");
      try {
        const json = JSON.parse(jsonStr);
        if (!isArrayOfObjects(json)) throw new Error("JSON需要是对象数组！");

        dealData(json).then(() => {
          refSpinning.value = false;
        });
      } catch (error: any) {
        refSpinning.value = false;
        if (String(error).includes("SyntaxError")) {
          console.log(error);

          message.warning("JSON字符串格式不正确！");
        } else {
          message.warning(error?.message);
        }
      }
    };

    // 处理数据
    const dealData = async (data: any[]) => {
      return new Promise((res) => {
        setTimeout(() => {
          clearData(false);
          data.forEach((row) => {
            refData.value.push(row);

            Object.keys(row).forEach((field) => {
              if (
                refColumns.value.filter((v) => v.title == field).length == 0
              ) {
                refColumns.value.push({
                  title: field,
                  dataIndex: field,
                  width: 200,
                });
              }
            });
          });
          res(true);
        }, 200);
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

    // 处理数据为xlsx需要的
    const dealDataToXlsx = () => {
      const body = [refColumns.value.map((v) => v.title)];
      refData.value.forEach((row) => {
        const excelRow: any[] = [];
        body[0].forEach((f) => {
          excelRow.push(row[f] ?? "");
        });
        body.push(excelRow);
      });
      return body;
    };

    const ExportToExcel = () => {
      if (refData.value.length > 0) {
        const data = dealDataToXlsx();
        const workbook = utils.book_new();
        const sheet = utils.aoa_to_sheet(data);
        utils.book_append_sheet(workbook, sheet, "Sheet1");
        writeFile(workbook, `json-${dayjs().format("YYYYMMDDHHmmss")}.xlsx`);
      } else {
        message.warning("请输入json并转换为excel！");
      }
    };

    onMounted(() => {
      refDataReviewHeight.value =
        (refDataReviewEl.value?.offsetHeight || 0) - 56;
    });

    return () => (
      <Spin spinning={refSpinning.value}>
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
            <Button type="primary" size={"middle"} onClick={ExportToExcel}>
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
      </Spin>
    );
  },
});
