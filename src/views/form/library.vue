<template>
  <div class="flex flex-col h-full" v-loading="loading">
    <div class="flex mb-4">
      <el-input
        class="ml-4 mr-4"
        style="width: 300px"
        placeholder="输入关键词搜索"
        v-model="keyword"
        @keyup.enter="doSearch"
      />
      <el-button type="primary" @click="doSearch" class="mr-4">搜索</el-button>
      <el-button type="primary" @click="getBookList">刷新</el-button>
    </div>
    <section class="content">
      <div class="h-full overflow-auto" ref="bookRef">
        <book-item v-for="book in list" :book="book" :key="book.id">
          <template #head="bookProps">
            <el-button
              type="primary"
              size="small"
              @click="onEdit(bookProps.book)"
              >编辑</el-button
            >
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
  <el-dialog v-model="dialogVisible" title="编辑">
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      label-width="100"
      v-loading="dialogLoading"
    >
      <el-form-item label="书名" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="ISBN" prop="isbn">
        <el-input v-model="form.isbn" autocomplete="off" />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="form.author" autocomplete="off" />
      </el-form-item>
      <el-form-item label="出版社" prop="publisher">
        <el-input v-model="form.publisher" autocomplete="off" />
      </el-form-item>
      <el-form-item label="出版时间" prop="pubdate">
        <el-input v-model="form.pubdate" autocomplete="off" />
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-input v-model="form.cover" autocomplete="off" />
      </el-form-item>
      <el-form-item label="资源类型" prop="mediaType">
        <el-select v-model="form.mediaType" multiple style="width:100%;" placeholder="请选择">
          <el-option
            v-for="type in MEDIA_TYPE"
            :key="type.value"
            :value="type.value"
            :label="type.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input
          v-model="form.description"
          autocomplete="off"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button class="mr-4" @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="dialogLoading"
          @click="onSubmit(formRef)"
          >确定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, reactive } from 'vue';
import { get, post } from '../../utils/request';
import BookItem from './components/book-item.vue';
import { IBook } from '@/types/book';
import type { FormRules, FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
import { MEDIA_TYPE } from '@/utils/const';

interface IBookRes {
  data: IBook[];
  total: number;
}

const loading = ref(true);
const dialogLoading = ref(false);
const page = ref(1);
const total = ref(0);
const list = ref<IBook[]>([]);
const keyword = ref(''); // 搜索关键字
const bookRef = ref();
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入书名', trigger: 'blur' },
    { max: 100, message: '书名不能超过100位', trigger: 'blur' },
  ],
  isbn: [
    { required: true, message: '请输入ISBN', trigger: 'blur' },
    { max: 50, message: '不能超过50位', trigger: 'blur' },
  ],
  author: [
    { required: true, message: '请输入作者', trigger: 'blur' },
    { max: 80, message: '不能超过80位', trigger: 'blur' },
  ],
  publisher: [
    { required: true, message: '请输入出版社', trigger: 'blur' },
    { max: 50, message: '不能超过50位', trigger: 'blur' },
  ],
});

const form = reactive({
  id: 0,
  name: '',
  isbn: '',
  cover: '',
  publisher: '',
  pubdate: '',
  author: '',
  description: '',
  mediaType: [1],
});

function doSearch() {
  page.value = 1;
  getBookList();
}

function onEdit(book: IBook) {
  console.log(book);
  form.name = book.name;
  form.author = book.author;
  form.cover = book.cover;
  form.isbn = book.isbn;
  form.description = book.description;
  form.pubdate = book.pubdate;
  form.publisher = book.publisher;
  form.id = book.id;
  form.mediaType = book.mediaType;
  dialogVisible.value = true;
}

function getBookList() {
  loading.value = true;
  get<IBookRes>(`/book?page=${page.value}&name=${keyword.value}`)
    .then((data) => {
      total.value = data.total;
      list.value = data.data;
    })
    .finally(() => {
      loading.value = false;
    });
}

function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      dialogLoading.value = true;
      const params = {
        ...form,
      };
      // if (params.pubdate) {
      //   params.pubdate += ' 08:00:00'
      // }
      post(`/book/${form.id}`, params)
        .then(() => {
          dialogVisible.value = false;
          formEl.resetFields();
          ElMessage({
            type: 'success',
            message: `修改成功`,
          });
          getBookList();
        })
        .finally(() => {
          dialogLoading.value = false;
        });
    }
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
