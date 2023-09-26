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
import { ref, watchEffect } from 'vue';
import { get } from '../../../utils/request';
import { ICxRes, ICxBook } from '../../../../types/book';

const props = defineProps<{
  pinst: string;
  ifbg: number;
}>();

const loading = ref(true);
const sortField = ref('ORDERNO');
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
}

function setPublisher(pub: string) {
  publisher.value = pub;
  page.value = 1;
}
function setPubdate(date: string) {
  pubdate.value = date;
  page.value = 1;
}

watchEffect(() => {
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
      publishers.value = res.publishers;
      pubdates.value = res.pubdate;
    })
    .finally(() => {
      loading.value = false;
    });
});
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
