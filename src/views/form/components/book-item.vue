<template>
  <div class="cxstar-item flex">
    <img :src="book.cover" :alt="book.name" />
    <div class="w-full ml-4">
      <div class="flex items-center">
        <h3 v-html="book.name"></h3>
        <el-icon @click="copy(book.name)" class="cursor-pointer ml-3"
          ><CopyDocument
        /></el-icon>
        <el-tag
          class="ml-4"
          v-if="book.mediaType?.length"
          v-for="media in book.mediaType"
          :key="media"
          :type="MEDIA_TYPE_MAP[media].tagType"
          effect="dark"
          size="small"
        >
          {{ MEDIA_TYPE_MAP[media].label }}
        </el-tag>
        <el-tag
          class="ml-4"
          v-if="book.categoryId"
          type="warning"
          effect="dark"
          size="small"
        >
          {{ book.categoryId + ':' + CAREGORY_MAP[book.categoryId] }}
        </el-tag>
        <div class="ml-auto mr-5">
          <slot name="head" :book="book"></slot>
        </div>
      </div>
      <div class="flex mt-4">
        <div class="flex-1">
          <span>作者：</span>
          <span>{{ book.author }}</span>
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
      <div class="line-clamp-2">{{ book.description }}</div>
      <div><slot name="footer" :book="book"></slot></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IBook } from '../../../../types/book';
import { CAREGORY_MAP, MEDIA_TYPE_MAP } from '@/utils/const';
import { useClipboard } from '@vueuse/core';
import { ElMessage } from 'element-plus';
import { watch } from 'vue';

const { copy, copied } = useClipboard();

watch(copied, (copied) => {
  if (copied) {
    ElMessage.success('复制成功');
  }
});

const props = defineProps<{
  book: IBook;
}>();

function getAuthor(author: string) {
  return author.replaceAll('<a>', '').replaceAll('</a>', '');
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
