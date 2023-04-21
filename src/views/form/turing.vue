<template>
  <div class="flex flex-col h-full">
    <div class="flex">
      <el-radio-group v-model="type">
        <el-radio :label="1">文字</el-radio>
        <el-radio :label="2">图文</el-radio>
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
        <el-col :xs="6" :sm="6" :md="4" :lg="3" :xl="2" v-for="book in list" :key="book.id">
          <el-card class="book-card">
            <img :src="`https://file.ituring.com.cn/LargeCover/${book.coverKey}`"/>
            <div>
              <span>{{ book.name }}</span>
            </div>
          </el-card>
        </el-col></el-row>
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
import { ref, watchEffect } from 'vue';
import { get } from '../../utils/request';

interface IBook{
  name: string;
  id: string;
  coverKey: string;
}
interface IRes{
  pagination: {
    totalItemCount: number,
  },
  bookItems: IBook[]
}

const type = ref(1);
const page = ref(1);
const total = ref(0);
const list = ref<IBook[]>([]);
const bookRef = ref();


function getBookList() {
  get<IRes>(`/epub/turing?page=${page.value}`).then(( data ) => {
    total.value = data.pagination.totalItemCount;
    list.value = data.bookItems;
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
.book-card{
  img {
    width: 100%;
  }
}
</style>
