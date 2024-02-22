<template>
  <div class="flex flex-col h-full" v-loading="loading">
    <section class="content">
      <div class="h-full overflow-auto" ref="bookRef">
        <dzgy-item v-for="book in list" :book="book" :key="book.ruid"/>
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
import { ref, watchEffect } from 'vue';
import { get } from '../../utils/request';
import DzgyItem from './components/dzgy-item.vue';
import { ICxBook } from '@/types/book';

interface IBook {
  Abstracts: string;
  Author: string;
  CoverUrl: string;
  Publisher: string;
  PublishDate: string;
  Title: string;
  Id: string;
  ExtendData: {
    Isbn: string;
  };
}

interface IEpubRes {
  RecordCount: number;
  ItemList: IBook[];
}

const loading = ref(true);
const page = ref(1);
const total = ref(0);
const list = ref<ICxBook[]>([]);
const bookRef = ref();

function getBookList() {
  loading.value = true;
  get<IEpubRes>(`/epub/dzgy?page=${page.value}`)
    .then((data) => {
      console.log(data);
      total.value = data.RecordCount;
      list.value = data.ItemList.map((item) => {
        return {
          ruid: item.Id,
          title: item.Title,
          author: item.Author,
          imgUrl: item.CoverUrl,
          abstract: item.Abstracts,
          pubdate: item.PublishDate,
          publisher: item.Publisher,
          isbn: item.ExtendData.Isbn,
        };
      });
    })
    .finally(() => {
      loading.value = false;
    });
}

watchEffect(async () => {
  getBookList();
});
</script>

<style lang="scss" scoped>
.content {
  height: calc(100% - 32px);
}
</style>
