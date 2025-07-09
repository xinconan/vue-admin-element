<template>
  <div class="flex flex-col h-full" v-loading="loading">
    <section class="content">
      <div class="h-full overflow-auto" ref="bookRef">
        <book-item v-for="book in list" :book="book" :key="book.id">
          <template #footer="bookProps">
            <a
              :href="`http://ebooks.cmpbook.com/detail?id=${book.id}`"
              class="mr-4"
              target="_blank"
              rel="noreferrer noopener"
            >
              工程科技
            </a>
            <el-button
              type="primary"
              size="small"
              @click="addBook(bookProps.book)"
            >
              添加到图书馆
            </el-button>
          </template>
        </book-item>
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
import { get, post } from '../../utils/request';
import BookItem from './components/book-item.vue';
import type { ICmpRes, IBook } from '@/types/book';
import { ElMessage } from 'element-plus';

const loading = ref(true);
const page = ref(1);
const total = ref(0);
const list = ref<IBook[]>([]);
const bookRef = ref();

function addBook(book: IBook) {
  const bookInfo = {
    name: book.name,
    cover: book.cover,
    isbn: book.isbn.replaceAll('-', ''),
    author: book.author
      .replaceAll(/等?编著/g, '')
      .replaceAll('编绘', '')
      .replace('主编', '')
      .replaceAll('[等]', ''),
    publisher: book.publisher,
    pubdate: book.pubdate + ' 08:00:00',
    description: book.description,
    mediaType: ['1'],
  };

  // console.log(bookInfo);

  post('/book', bookInfo).then((res) => {
    ElMessage({
      type: 'success',
      message: `${bookInfo.name} 添加成功`,
    });
  });
}

function getBookList() {
  loading.value = true;
  get<ICmpRes>(`/epub/cmp?page=${page.value}&limit=20`)
    .then((data) => {
      total.value = data.otherResult.count;
      list.value = data.module.map((item) => {
        return {
          id: item.id,
          name: item.name,
          author: item.writer,
          cover: item.cover,
          description: '',
          mediaType: [],
          pubdate: item.publishdate,
          publisher: '机械工业出版社',
          isbn: item.isbn,
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
