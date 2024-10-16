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
      <el-button type="primary" size="small" @click="doSearch" class="mr-4">
        搜索
      </el-button>
      <label>展现形式：</label>
      <el-radio-group v-model="type">
        <el-radio :value="1">文字</el-radio>
        <el-radio :value="2">图文</el-radio>
      </el-radio-group>
      <label class="ml-4">资源类型：</label>
      <el-radio-group @change="doSearch" v-model="edition">
        <el-radio :value="1">纸质</el-radio>
        <el-radio :value="4">电子书</el-radio>
      </el-radio-group>
    </div>
    <section class="content">
      <div class="h-full overflow-auto" ref="bookRef">
        <ul v-if="type === 1">
          <template v-for="book in list" :key="book.id">
            <li>- {{ book.name }}</li>
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
                :src="`https://file.ituring.com.cn/LargeCover/${book.coverKey}`"
              />
              <div>
                <a
                  class="text-sm"
                  :href="`https://www.ituring.com.cn/book/${book.id}`"
                  rel="noreferrer nofollow noopener"
                  target="_blank"
                >
                  {{ book.name }}
                </a>
                <el-button @click="addBook(book)" type="primary" size="small">添加到图书馆</el-button>
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
        :page-size="15"
        layout="total,prev, pager,next,jumper"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { get, post } from '@/utils/request';
import { ElMessage } from 'element-plus';

interface IBook {
  name: string;
  id: string;
  isbn: string;
  authorNameString: string;
  abstract: string;
  coverKey: string;
}
interface IRes {
  pagination: {
    totalItemCount: number;
  };
  bookItems: IBook[];
}

const loading = ref(true);
const keyword = ref(''); // 搜索关键字
const type = ref(2);
const page = ref(1);
const edition = ref(4);
const total = ref(0);
const list = ref<IBook[]>([]);
const bookRef = ref();

function addBook(book: IBook) {
  const bookInfo = {
    name: book.name,
    cover: `https://file.ituring.com.cn/LargeCover/${book.coverKey}`,
    isbn: book.isbn.replaceAll('-', ''),
    author: book.authorNameString,
    publisher: '人民邮电出版社',
    // pubdate: new Date(parseInt(year), parseInt(month) - 1),
    pubdate: `2020-01-01 08:00:00`,
    description: book.abstract,
    mediaType: ['1'],
  };
  
  // console.log(bookInfo);
  
  post('/book', bookInfo).then(res => {
    ElMessage({
      type: 'success',
      message: `${bookInfo.name} 添加成功`
    })
  })
}

function doSearch() {
  page.value = 1;
  getBookList();
}

function getBookList() {
  loading.value = true;
  get<IRes>(`/epub/turing?page=${page.value}&name=${keyword.value}&edition=${edition.value}`)
    .then((data) => {
      total.value = data.pagination.totalItemCount;
      list.value = data.bookItems;
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
  height: calc(100% - 32px);
}
.book-card {
  img {
    width: 100%;
    aspect-ratio: 7/10;
  }
}
</style>
