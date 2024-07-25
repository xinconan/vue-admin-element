<script>
import {h, useSlots, nextTick} from 'vue'
export default {
  name: "fieldCollapse",
  props: {
    cols: {
      type: Number,
      default: 3,
    },
    settingCols: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      canCollapse: false,
      collapse: true, // 是否折叠，默认收起
    };
  },
  mounted() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      if (!this.$refs.collapseRef) {
        return;
      }
      const width = this.$refs.collapseRef.offsetWidth;
      let cols = 3;
      if (width < 1200) {
        cols = 3;
      } else if (width < 2200) {
        cols = 4;
      } else {
        cols = 5;
      }
      this.$emit("update:cols", cols); // 更新cols
    },
    splitChildren(children) {
      const length = children.length;
      this.realSettingCols = this.settingCols;
      // 查询按钮区域占的列数不能超过每行的总列数
      if (this.settingCols > this.cols) {
        this.realSettingCols = this.cols;
      }
      if (length <= this.cols * 2 - this.realSettingCols) {
        this.canCollapse = false;
        // 查询条件小于1行
        if (length + this.realSettingCols <= this.cols) {
          this.firstHalf = [];
          this.secondHalf = children;
          this.realSettingCols = this.cols - length;
          return;
        }
        this.firstHalf = children.slice(0, this.cols);
        this.secondHalf = children.slice(this.cols);
        // 第2行，剩余的列数
        this.realSettingCols = this.cols - (this.secondHalf.length % this.cols);
        return;
      }
      this.canCollapse = true;

      if (this.collapse) {
        // 收起情况
        this.firstHalf = children.slice(0, this.cols);
        this.secondHalf = children.slice(
          this.cols,
          this.cols * 2 - this.realSettingCols
        );
        return;
      }
      let rest = length % this.cols;
      // 当最后一行元素数量和操作列超过了一行可容纳的个数时，将多余的放到前面
      if (rest + this.realSettingCols > this.cols) {
        rest = this.cols - this.realSettingCols;
      } else {
        this.realSettingCols = this.cols - rest;
      }
      let index = length - rest;
      this.firstHalf = children.slice(0, index);
      this.secondHalf = children.slice(index);
    },
    handleCollapse() {
      this.collapse = !this.collapse;
      this.$emit("changeCollapse", this.collapse);
    },
  },
  created() {
    this.firstHalf = [];
    this.secondHalf = [];
  },
  // mounted() {
  //   const slots = useSlots();
  //   console.log(this.$slots.default()[0])
  //   console.log(slots.default()[0].children);
  // },
  render() {
    // const slots = useSlots();
    console.log(this.$slots.default()[0])
    // console.log(this.$children)
    const children = (this.$slots.default() || [])
    this.splitChildren(children);
    
    // nextTick(() => {
    //   const slots = useSlots();
    //   console.log(this.$slots.default()[0])
    //   console.log(slots.default()[0].children)
    // })
    // 只有1行时，只渲染下半段
    return h(
      "div",
      {
        ref: "collapseRef",
      },
      [
        this.firstHalf.length
          ? h(
              "div",
              {
                class: {
                  "field-collapse-top": true,
                },
              },
              this.firstHalf
            )
          : null,
        h(
          "div",
          {
            class: {
              "field-collapse-bottom": true,
            },
          },
          [
            ...this.secondHalf,
            h(
              "h-form-item",
              {
                props: {
                  labelWidth: 0.1,
                  cols: this.realSettingCols,
                },
                style: {
                  background: "#f00",
                },
              },
              this.canCollapse
                ? [
                    ...(this.$slots.setting || []),
                    h(
                      "span",
                      {
                        class: {
                          "collapse-btn": true,
                          "ml-2": true,
                        },
                        on: {
                          click: this.handleCollapse,
                        },
                      },
                      [
                        this.collapse ? "更多" : "收起",
                        h("h-icon", {
                          props: {
                            name: "arrow-r",
                            size: 12,
                          },
                          style: {
                            display: "inline-block",
                            transform: this.collapse
                              ? "rotate(90deg)"
                              : "rotate(-90deg)",
                          },
                        }),
                      ]
                    ),
                  ]
                : this.$slots.setting
            ),
          ]
        ),
      ]
    );
  },
};
</script>

<style lang="scss" scoped>
.field-collapse-top {
  max-height: 125px;
  overflow: auto;
  scrollbar-gutter: stable;
}
.field-collapse-bottom {
  overflow: hidden;
  scrollbar-gutter: stable;
}
.collapse-btn {
  cursor: pointer;
}
</style>
