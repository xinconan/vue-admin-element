<template>
  <div class="cxstar-item flex">
    <img :src="book.imgUrl" :alt="book.title" />
    <div class="w-full ml-4">
      <div class="flex items-center">
        <h3 v-html="book.title"></h3>
        <el-icon @click="copy(book.title)" class="cursor-pointer ml-3"><CopyDocument /></el-icon>
      </div>
      <div class="flex mt-4">
        <div class="flex-1">
          <span>作者：</span>
          <span v-html="getAuthor(book.author)"></span>
        </div>
        <div class="flex-1">
          <span>出版社：</span>
          <span v-html="book.publisher"></span>
        </div>
        <div class="flex-1">
          <span>出版时间：</span>
          <span>{{ book.pubdate }}</span>
        </div>
        <div class="flex-1">
          <span>ISBN：</span>
          <span>{{ book.isbn }}</span>
        </div>
      </div>
      <div class="line-clamp-2">{{ book.abstract }}</div>
      <div>
        <a
          :href="`https://yd.51zhy.cn/ebook/web/newBook/queryNewBookById?id=${book.ruid}&address=newBook`"
          target="_blank"
          rel="noreferrer noopener"
        >
          51zhy
        </a>
        <a
          :href="`http://sso.zslib.cn/interlibSSO/goto/129/+xc940ygx9bm//ebook/web/newBook/queryNewBookById?id=${book.ruid}&address=newBook`"
          target="_blank"
          rel="noreferrer noopener"
        >
          中山图书馆
        </a>
        <a
          :href="`http://sso.zslib.cn/interlibSSO/goto/129/+xc940ygx9bm/ebook/reader/index.html#/pdfReader?id=${book.ruid}`"
          target="_blank"
          rel="noreferrer noopener"
        >
          中山阅读页
        </a>
        <el-button @click="addBook" type="primary" size="small">添加到图书馆</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useClipboard } from '@vueuse/core';
import type { ICxBook } from '@/types/book';
import { post } from '../../../utils/request';
import { ElMessage } from 'element-plus';

const { copy, copied } = useClipboard();

const props = defineProps<{
  book: ICxBook;
}>();

function getAuthor(author: string) {
  return author.replaceAll('<a>', '').replaceAll('</a>', '');
}

function removeStr(str: string) {
  return str.replace(/<\/?em>/g, '')
}

watch(copied, (copied) => {
  if (copied) {
    ElMessage.success('复制成功')
  }
})

function addBook() {
  const book = props.book;
  const bookInfo = {
    name: removeStr(book.title),
    cover: book.imgUrl,
    isbn: book.isbn.replaceAll('-', ''),
    author: book.author.replace(/<\/?a>/g, '').replaceAll('编著', '').replace('主编', ''),
    publisher: removeStr(book.publisher),
    // pubdate: new Date(parseInt(year), parseInt(month) - 1),
    pubdate: `${book.pubdate.substring(0, 10)} 08:00:00`,
    description: removeStr(book.abstract),
    mediaType: ['1'],
  };
  if (/.*著$/.test(bookInfo.author)) {
    bookInfo.author = bookInfo.author.slice(0, -1);
  }
  // console.log(bookInfo);
  
  post('/book', bookInfo).then(res => {
    ElMessage({
      type: 'success',
      message: `${bookInfo.name} 添加成功`
    })
  })
}
</script>

<style lang="scss" scoped>
.cxstar-item {
  img {
    width: 90px;
    aspect-ratio: 7/10;
  }

  &:not(:last-child) {
    margin-bottom: 16px;
  }

  a {
    margin-right: 20px;
  }

  :deep(em) {
    color: var(--el-color-error);
  }
}
</style>
