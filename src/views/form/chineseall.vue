<template>
  <div class="flex flex-col h-full" v-loading="loading">
    <div class="flex items-center mb-4">
      <el-input
        style="width: 300px"
        placeholder="输入token"
        v-model="token"
        clearable
        @keyup.enter="doSearch"
      />
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
      <el-radio-group class="ml-4" @change="doSearch" v-model="type">
        <el-radio :value="0">全部</el-radio>
        <el-radio :value="3">出版社</el-radio>
      </el-radio-group>
    </div>
    <section class="content">
      <div class="h-full overflow-auto" ref="bookRef">
        <book-item v-for="book in list" :book="book" :key="book.id">
          <template #head="bookProps">
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
import { ref, watch, reactive } from 'vue';
import { get, post } from '../../utils/request';
import BookItem from './components/book-item.vue';
import { IBook } from '@/types/book';
import { ElMessage } from 'element-plus';
import { useAppStore } from '../../store/modules/app';

interface IChBook {
  assetsId: number;
  name: string;
  isbn: string;
  publishDate: string;
  publisher: string;
  author: string;
  intro: string;
  coverImgUrl: string;
}

interface IBookRes {
  list: IChBook[];
  totalCount: number;
}

const appStore = useAppStore();

const loading = ref(false);
const page = ref(1);
const total = ref(0);
const type = ref(0);
const list = ref<IBook[]>([]);
const token = ref(appStore.chineseToken);
const keyword = ref(''); // 搜索关键字
const bookRef = ref();

function doSearch() {
  page.value = 1;
  getBookList();
}

function removeHighlight(str: string) {
  return str
    .replaceAll('<span class="search_key_highlight">', '')
    .replaceAll('</span>', '');
}

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
    pubdate: book.pubdate.replace('年', '-').replace('月', '-01 08:00:00'),
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
  if (!token.value) return;
  appStore.setChineseToken(token.value);
  loading.value = true;
  let url = `/epub/chineseall?page=${page.value}&search=${keyword.value}&token=${token.value}`;
  if (type.value !== 0) {
    url += `&searchType=${type.value}`;
  }
  get<IBookRes>(url)
    .then((data) => {
      total.value = data.totalCount;
      list.value = data.list.map((item) => {
        return {
          id: item.assetsId,
          name: removeHighlight(item.name),
          isbn: item.isbn,
          author: removeHighlight(item.author),
          description: item.intro,
          mediaType: [],
          pubdate: item.publishDate,
          publisher: removeHighlight(item.publisher),
          cover: item.coverImgUrl,
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
