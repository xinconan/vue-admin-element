<template>
  <div class="cxstar-item flex">
    <img :src="book.imgUrl" :alt="book.title" />
    <div class="w-full ml-4">
      <div class="flex">
        <h3 v-html="book.title"></h3>
        <span class="ml-auto">{{ book.ruid }}</span>
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
          :href="`https://www.cxstar.com/Book/Detail?ruid=${book.ruid}&packageruid=`"
          target="_blank"
          rel="noreferrer noopener"
        >
          畅想
        </a>
        <a
          :href="`https://elib.cqlib.cn:8081/interlibSSO/goto/65/++9bwrs-q9bnl/Book/Detail?ruid=${book.ruid}&packageruid=`"
          target="_blank"
          rel="noreferrer noopener"
        >
          重庆图书馆
        </a>
        <a
          :href="`https://portal.sclib.org/interlibSSO/goto/214/++9bwrs-q9bnl/Book/Detail?ruid=${book.ruid}`"
          target="_blank"
          rel="noreferrer noopener"
        >
          四川图书馆
        </a>
        <a
          :href="`https://sso.gzlib.org.cn/interlibSSO/goto/184/++9bwrs-q9bnl/Book/Detail?ruid=${book.ruid}&packageruid=`"
          target="_blank"
          rel="noreferrer noopener"
        >
          广州图书馆
        </a>
        <a
          :href="`http://gfgfab3e1aaa3118d4124s6x6pxvnf95o56pnf.fhhh.ntszzy.org:8070/Book/Detail?ruid=${book.ruid}&packageruid=`"
          target="_blank"
          rel="noreferrer noopener"
        >
          南京图书馆
        </a>
        <a
          :href="`http://sso.lnlib.com/interlibSSO/goto/100/++9bwrs-q9bnl/Book/Detail?ruid=${book.ruid}&packageruid=`"
          target="_blank"
          rel="noreferrer noopener"
        >
          辽宁图书馆
        </a>
        <a
          :href="`http://sso.zslib.cn/interlibSSO/goto/183/++9bwrs-q9bnl/Book/Detail?ruid=${book.ruid}&packageruid=`"
          target="_blank"
          rel="noreferrer noopener"
        >
          中山图书馆
        </a>
        <a
          :href="`http://sm.interlib.cn:8086/vpn/54/https/www.cxstar.com/Book/Detail?ruid=${book.ruid}&packageruid=`"
          target="_blank"
          rel="noreferrer noopener"
        >
          中新天津图书馆
        </a>
        <el-button @click="addBook" type="primary" size="small">
          添加到图书馆
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { ICxBook } from '../../../../types/book';
import { post } from '../../../utils/request';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  book: ICxBook;
}>();

function getAuthor(author: string) {
  return author.replaceAll('<a>', '').replaceAll('</a>', '');
}

function removeStr(str: string) {
  return str.replace(/<\/?em>/g, '');
}

function addBook() {
  const book = props.book;
  const [year, month] = book.pubdate.split('.');
  const bookInfo = {
    name: removeStr(book.title),
    cover: book.imgUrl,
    isbn: book.isbn.replaceAll('-', ''),
    author: removeStr(book.author)
      .replace(/<\/?a>/g, '')
      .replaceAll(/等?编著/g, '')
      .replaceAll('编绘', '')
      .replace('主编', '')
      .replaceAll('[等]', ''),
    publisher: removeStr(book.publisher),
    // pubdate: new Date(parseInt(year), parseInt(month) - 1),
    pubdate: `${year}-${month}-01 08:00:00`,
    // pubdate: `${year}-${month}-01 00:00:00`,
    description: removeStr(book.abstract),
    mediaType: ['1'],
  };
  if (['人民卫生出版社', '中译出版社', '北京大学出版社'].includes(bookInfo.publisher)) {
    bookInfo.mediaType = ['2'];
  }
  if (/.*著$/.test(bookInfo.author)) {
    bookInfo.author = bookInfo.author.slice(0, -1);
  }
  // console.log(bookInfo);

  post('/book', bookInfo).then((res) => {
    ElMessage({
      type: 'success',
      message: `${bookInfo.name} 添加成功`,
    });
  });
}
</script>

<style lang="scss" scoped>
.cxstar-item {
  img {
    width: 90px;
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
