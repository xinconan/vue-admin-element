<template>
  <div class="flex flex-col h-full" v-loading="loading">
    <div class="flex items-center">
      <label>展现形式：</label>
      <el-radio-group v-model="type">
        <el-radio :value="1">文字</el-radio>
        <el-radio :value="2">图文</el-radio>
      </el-radio-group>
      <label class="ml-4">资源类型：</label>
      <el-radio-group @change="doSearch" v-model="edition">
        <el-radio :value="1">电子书</el-radio>
        <el-radio :value="2">纸质</el-radio>
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
              <span class="book-date text-xs">{{ book.publishDate }}</span>
              <img :src="book.logo" />
              <div>
                <a
                  class="text-sm"
                  :href="`https://www.epubit.com/bookDetails?id=${book.code}`"
                  rel="noreferrer nofollow noopener"
                  target="_blank"
                >
                  {{ book.name }}
                </a>
                <el-button @click="addBook(book)" type="primary" size="small">
                  添加到图书馆
                </el-button>
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
import { get, post } from '../../utils/request';
import { ElMessage } from 'element-plus';

interface IBook {
  name: string;
  id: string;
  code: string;
  logo: string;
  authors: string;
  isbn: string;
  publishDate: string;
}

interface IEpubRes {
  data: {
    total: number;
    records: IBook[];
  };
}

const loading = ref(true);
const type = ref(2);
const page = ref(1);
const total = ref(0);
const edition = ref(1);
const list = ref<IBook[]>([]);
const bookRef = ref();

const { copy } = useClipboard();

function addBook(book: IBook) {
  const bookInfo = {
    name: book.name,
    cover: book.logo,
    isbn: book.isbn.replaceAll('-', ''),
    author: book.authors,
    publisher: '人民邮电出版社',
    // pubdate: new Date(parseInt(year), parseInt(month) - 1),
    pubdate: book.publishDate + ` 08:00:00`,
    description: '',
    mediaType: ['1'],
  };

  post('/book', bookInfo).then((res) => {
    ElMessage({
      type: 'success',
      message: `${bookInfo.name} 添加成功`,
    });
  });
}

function getBookList() {
  loading.value = true;
  get<IEpubRes>(`/epub/ebook?page=${page.value}&edition=${edition.value}`)
    .then(({ data }) => {
      console.log(data);
      total.value = data.total;
      data.records.forEach(
        (item) => (item.publishDate = item.publishDate.substring(0, 10))
      );
      list.value = data.records;
    })
    .finally(() => {
      loading.value = false;
    });
}

watchEffect(async () => {
  getBookList();
});

function doSearch() {
  page.value = 1;
  getBookList();
}

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
  position: relative;

  .book-date {
    position: absolute;
    right: 0;
    top: 0;
  }
  img {
    width: 100%;
    aspect-ratio: 7/10;
  }
}
</style>
