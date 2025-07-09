<template>
  <div class="flex flex-col h-full" v-loading="loading">
    <div class="flex items-center mb-4">
      <el-input
        class="ml-4 mr-4"
        style="width: 300px"
        placeholder="输入关键词搜索"
        v-model="keyword"
        clearable
        @keyup.enter="doSearch"
      />
      <el-button type="primary" size="small" @click="doSearch">
        搜索
      </el-button>
    </div>
    <section class="content">
      <div class="h-full overflow-auto" ref="bookRef">
        <book-item v-for="book in list" :book="book" :key="book.id">
          <template #footer="bookProps">
            <a
              :href="`https://www.sklib.cn/booklib/bookPreview?SiteID=122&ID=${book.id}`"
              class="mr-4"
              target="_blank"
              rel="noreferrer noopener"
            >
              社会科学文库
            </a>
            <a
              :href="`https://z.library.sh.cn/https/443/cn/sklib/www/yitlink/booklib/bookPreview?SiteID=122&ID=${book.id}`"
              class="mr-4"
              target="_blank"
              rel="noreferrer noopener"
            >
              上海图书馆
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
import { ref, watch, watchEffect } from 'vue';
import { get, post } from '../../utils/request';
import BookItem from './components/book-item.vue';
import type { IBook } from '@/types/book';
import { ElMessage } from 'element-plus';

interface ISklibBook {
  summary: string;
  coverPath: string;
  publishDate: string;
  title: string;
  ISBN: string;
  ID: string;
  logoId: string;
  authorInfo: string;
  publisher: string[];
}

interface ISklibRes {
  total: number;
  data: ISklibBook[];
}

const loading = ref(true);
const page = ref(1);
const total = ref(0);
const list = ref<IBook[]>([]);
const bookRef = ref();
const keyword = ref('');

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

function doSearch() {
  page.value = 1;
  getBookList();
}

function removeTrailingSemicolon(str: string) {
  if (str.endsWith(';')) {
    str = str.slice(0, -1);
  }
  return str;
}

function getBookList() {
  loading.value = true;
  get<ISklibRes>(`/epub/sklib?page=${page.value}&title=${keyword.value}`)
    .then((data) => {
      total.value = data.total;
      list.value = data.data.map((item) => {
        return {
          id: item.ID,
          name: item.title,
          author: removeTrailingSemicolon(item.authorInfo),
          cover: `https://www.sklib.cn/booklib/zpimage.zhtml?ID=${item.logoId}&SiteID=122&draft=0&type=logo`,
          description: item.summary,
          mediaType: [],
          pubdate: item.publishDate.substring(0, 10),
          publisher: '中国社会科学出版社',
          isbn: item.ISBN,
        };
      });
    })
    .finally(() => {
      loading.value = false;
    });
}

watch(
  page,
  async () => {
    getBookList();
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.content {
  height: calc(100% - 64px);
}
</style>
