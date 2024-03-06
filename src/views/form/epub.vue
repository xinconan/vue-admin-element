<template>
  <div class="flex flex-col h-full" v-loading="loading">
    <div class="flex">
      <el-radio-group v-model="type">
        <el-radio :value="1">文字</el-radio>
        <el-radio :value="2">图文</el-radio>
      </el-radio-group>
    </div>
    <section class="content">
      <div class="h-full overflow-auto" ref="bookRef">
        <ul v-if="type === 1">
          <template v-for="book in list" :key="book.id">
            <li>- {{ book.name.replace('【抢读版】', '') }}</li>
          </template>
        </ul>
        <el-row v-else :gutter="10">
          <el-col
            :xs="6"
            :sm="6"
            :md="4"
            :lg="3"
            :xl="2"
            v-for="book in list"
            :key="book.id"
          >
            <el-card class="book-card">
              <img
                :src="book.logo"
              />
              <div>
                <span>{{ book.name }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </section>
    <div class="flex">
      <el-pagination
        v-model:current-page="page"
        :total="total"
        :page-size="20"
        layout="total,prev, pager,next,jumper"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useClipboard } from '@vueuse/core';
import { ref, watchEffect } from 'vue';
import { get } from '../../utils/request';

interface IBook {
  name: string;
  id: string;
  logo: string;
}

interface IEpubRes {
  data: {
    total: number;
    records: IBook[];
  };
}

const loading = ref(true);
const type = ref(1);
const page = ref(1);
const total = ref(0);
const list = ref<IBook[]>([]);
const bookRef = ref();

const { copy } = useClipboard();

function getBookList() {
  loading.value = true;
  get<IEpubRes>(`/epub/ebook?page=${page.value}`)
    .then(({ data }) => {
      console.log(data);
      total.value = data.total;
      list.value = data.records;
    })
    .finally(() => {
      loading.value = false;
    });
}

watchEffect(async () => {
  getBookList();
});

// function doCopy() {
//   const content = bookRef.value?.textContent;
//   console.log(content);
//   copy(content);
// }
</script>

<style lang="scss" scoped>
.content {
  height: calc(100% - 32px);
}
.book-card {
  img {
    width: 100%;
  }
}
</style>
