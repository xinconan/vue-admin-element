<template>
  <div class="flex flex-col h-full">
    <section class="content">
      <div class="h-full overflow-auto" ref="bookRef">
        <ul>
          <template v-for="book in list" :key="book.id">
            <li>- {{ book.name.replace('【抢读版】', '') }}</li>
          </template>
        </ul>
      </div>
    </section>
    <div class="flex">

      <el-pagination
      v-model:current-page="page"
      :total="total"
      :page-size="20"
      layout="total,prev, pager,next,jumper"
      />
      <el-button type="primary" @click="doCopy">复制</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useClipboard } from '@vueuse/core';
import { ref, watchEffect } from 'vue';
import { get } from '../../utils/request';

const page = ref(1);
const total = ref(0);
const list = ref([]);
const bookRef = ref();

const {copy} = useClipboard()

function getBookList() {
  get(`/epub/ebook?page=${page.value}`).then(({ data }) => {
    console.log(data);
    total.value = data.total;
    list.value = data.records;
  });
}

watchEffect(async () => {
  getBookList();
});

function doCopy() {
  const content = bookRef.value?.textContent
  console.log(content);
  copy(content)
}
</script>

<style lang="scss" scoped>
.content {
  height: calc(100% - 32px);
  // height: calc(100% - var(--el-pagination-button-height));
}
</style>
