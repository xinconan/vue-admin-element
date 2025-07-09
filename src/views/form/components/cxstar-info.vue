<template>
  <div class="cxstar-info flex" v-loading="loading">
    <div class="left-side h-full overflow-auto">
      <div>
        <h3>出版社</h3>
        <ul>
          <li :class="{ active: publisher === '' }" @click="setPublisher('')">
            全部({{ total }})
          </li>
          <li
            :class="{ active: publisher === k }"
            v-for="[k, v] of Object.entries(publishers)"
            :key="k"
            @click="setPublisher(k)"
          >
            {{ k }}({{ v }})
          </li>
        </ul>
      </div>
      <div>
        <h3>出版时间</h3>
        <ul>
          <li :class="{ active: pubdate === '' }" @click="setPubdate('')">
            全部({{ total }})
          </li>
          <li
            :class="{ active: pubdate === k }"
            v-for="[k, v] of Object.entries(pubdates)"
            :key="k"
            @click="setPubdate(k)"
          >
            {{ k }}({{ v }})
          </li>
        </ul>
      </div>
    </div>
    <div class="main flex-1 flex flex-col overflow-hidden h-full">
      <div class="filter-wrap flex">
        <div
          class="filter-item"
          :class="{ active: sortField === 'ORDERNO' }"
          @click="setFilter('ORDERNO')"
        >
          综合
        </div>
        <div
          class="filter-item"
          :class="{ active: sortField === 'PUBDATED' }"
          @click="setFilter('PUBDATED')"
        >
          出版日期
        </div>
        <div
          class="filter-item"
          :class="{ active: sortField === 'BOOKLASTDATE' }"
          @click="setFilter('BOOKLASTDATE')"
        >
          上架时间
        </div>
        <el-button type="primary" size="small" @click="getBookList">刷新</el-button>
      </div>
      <div class="flex-1 overflow-auto">
        <cxstar-item
          v-for="book in books"
          :key="book.ruid"
          :book="book"
        ></cxstar-item>
      </div>
      <div>
        <el-pagination
          v-model:current-page="page"
          :total="total"
          :page-size="15"
          layout="total,prev, pager,next,jumper"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import cxstarItem from './cxstar-item.vue';
import { ref, watch } from 'vue';
import { get } from '../../../utils/request';
import type { ICxRes, ICxBook } from '@/types/book';
import { PUBLISHERS, PUBDATES } from '../../../utils/const';

const props = defineProps<{
  pinst: string;
  ifbg: number;
}>();

const loading = ref(true);
const sortField = ref('PUBDATED');
const publisher = ref(''); // 出版社
const publishers = ref({}); // 出版社列表
const pubdate = ref(''); // 出版时间
const pubdates = ref({}); // 出版时间列表
const books = ref<ICxBook[]>([]);
const page = ref(1);
const total = ref(0);

function setFilter(field: string) {
  sortField.value = field;
  page.value = 1;
  getBookList();
}

function setPublisher(pub: string) {
  publisher.value = pub;
  page.value = 1;
  getBookList();
}
function setPubdate(date: string) {
  pubdate.value = date;
  page.value = 1;
  getBookList();
}

function getBookList() {
  if (!props.pinst) {
    return;
  }
  loading.value = true;
  get<ICxRes>(
    `/epub/cxstar?pinst=${props.pinst}&page=${page.value}&ifbg=${props.ifbg}&sortField=${sortField.value}&publisher=${publisher.value}&pubdate=${pubdate.value}`
  )
    .then((res) => {
      total.value = res.total;
      books.value = res.data;
      const dates = {} as Record<string, number>;
      const pubdate: string[] = [];
      for (const [k, v] of Object.entries(res.pubdate)) {
        dates[k.trim()] = v;
        pubdate.push(k.trim());
      }
      const pub = Object.keys(res.publishers);

      PUBLISHERS.forEach((item) => {
        // 几个常用的出版社，如果不在返回结果里，手动加上，方便快速搜索
        if (!pub.includes(item)) {
          res.publishers[item] = 0;
        }
      });
      PUBDATES.forEach((item) => {
        // 几个常用的出版日期，如果不在返回结果里，手动加上，方便快速搜索
        if (!pubdate.includes(item)) {
          dates[item] = 0;
        }
      });
      publishers.value = res.publishers;
      pubdates.value = dates;
    })
    .finally(() => {
      loading.value = false;
    });
}

watch(
  page,
  () => {
    getBookList();
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.cxstar-info {
  height: calc(100vh - 214px);
  align-items: flex-start;
}
.left-side {
  width: 200px;
  margin-right: 20px;

  li {
    cursor: pointer;
    &.active {
      color: var(--el-color-error);
    }
  }
}
.filter-item {
  cursor: pointer;
  padding: 0 16px;
  margin-right: 20px;

  &.active {
    color: var(--el-color-error);
  }
}
</style>
