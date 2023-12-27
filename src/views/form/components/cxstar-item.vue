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
      <div>
        <a :href="`https://www.cxstar.com/Book/Detail?ruid=${book.ruid}&packageruid=`" target="_blank" rel="noreferrer noopener">畅想</a>
        <a :href="`https://elib.cqlib.cn:8081/interlibSSO/goto/65/++9bwrs-q9bnl/Book/Detail?ruid=${book.ruid}&packageruid=`" target="_blank" rel="noreferrer noopener">重庆图书馆</a>
        <a :href="`https://sso.gzlib.org.cn/interlibSSO/goto/184/++9bwrs-q9bnl/Book/Detail?ruid=${book.ruid}&packageruid=`" target="_blank" rel="noreferrer noopener">广州图书馆</a>
        <a :href="`http://gfgfab3e1aaa3118d4124s6x6pxvnf95o56pnf.fhhh.ntszzy.org:8070/Book/Detail?ruid=${book.ruid}&packageruid=`" target="_blank" rel="noreferrer noopener">南京图书馆</a>
        <a :href="`http://sso.lnlib.com/interlibSSO/goto/100/++9bwrs-q9bnl/Book/Detail?ruid=${book.ruid}&packageruid=`" target="_blank" rel="noreferrer noopener">辽宁图书馆</a>
        <a :href="`http://sm.interlib.cn:8086/vpn/54/https/www.cxstar.com/Book/Detail?ruid=${book.ruid}&packageruid=`" target="_blank" rel="noreferrer noopener">中新天津图书馆</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { ICxBook } from '../../../../types/book';

const props = defineProps<{
  book: ICxBook
}>();

function getAuthor(author: string) {
  return author.replaceAll('<a>', '').replaceAll('</a>', '')
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
    color: var(--el-color-error)
  }
}
</style>
