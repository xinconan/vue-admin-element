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
            <el-button
              class="ml-3"
              size="small"
              :disabled="!token"
              :loading="urlLoadingBookId === bookProps.book.shId"
              @click="openDownload(bookProps.book)"
            >
              下载
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

    <el-dialog
      v-model="downloadVisible"
      title="选择下载格式"
      width="420px"
      @closed="resetDownload"
    >
      <div v-loading="urlLoading" class="download-format">
        <el-button
          v-for="item in formats"
          :key="item.type"
          :type="item.isDefault ? 'primary' : 'default'"
          :loading="downloadingType === item.type"
          :disabled="!!downloadingType && downloadingType !== item.type"
          @click="doDownload(item)"
        >
          {{ item.type.toUpperCase() }}
          <span v-if="item.isDefault">（默认）</span>
        </el-button>
        <span v-if="!urlLoading && !formats.length" class="text-gray-400">
          暂无可用下载格式
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, reactive } from 'vue';
import { get, post } from '../../utils/request';
import BookItem from './components/book-item.vue';
import type { IBook } from '@/types/book';
import { ElMessage } from 'element-plus';
import { useAppStore } from '../../store/modules/app';

interface IChBook {
  shId: string;
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

/** 中文在线相关接口前缀 */
const CHINESEALL_API = '/epub/chineseall';

interface IDownloadUrlResult {
  /** 默认下载地址与格式 */
  defaultUrl?: string;
  defaultType?: string;
  /** 其余键为各格式对应的下载地址，如 epub / pdf / txt */
  [format: string]: string | undefined;
}

interface IDownloadUrlRes {
  success: boolean;
  result: IDownloadUrlResult;
}

interface IDownloadFormat {
  type: string;
  url: string;
  isDefault?: boolean;
}

interface IDownloadRes {
  success?: boolean;
  message?: string;
  result?: unknown;
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

// 下载相关
const downloadVisible = ref(false);
const urlLoading = ref(false);
const urlLoadingBookId = ref<string | number>('');
const downloadingType = ref('');
const formats = ref<IDownloadFormat[]>([]);
const currentBook = ref<IBook | null>(null);

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
  let url = `${CHINESEALL_API}?page=${page.value}&search=${keyword.value}&token=${token.value}`;
  if (type.value !== 0) {
    url += `&searchType=${type.value}`;
  }
  get<IBookRes>(url)
    .then((data) => {
      total.value = data.totalCount;
      list.value = data.list.map((item) => {
        return {
          shId: item.shId,
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

/** 解析下载地址接口返回，提取可用格式（默认格式排在最前） */
function parseFormats(res: IDownloadUrlRes): IDownloadFormat[] {
  const result: IDownloadUrlResult = res?.result || {};
  const map = new Map<string, IDownloadFormat>();

  Object.entries(result).forEach(([key, value]) => {
    if (key === 'defaultUrl' || key === 'defaultType') return;
    if (typeof value !== 'string' || !/^https?:\/\//i.test(value)) return;
    map.set(key, { type: key, url: value });
  });

  const defaultUrl =
    typeof result.defaultUrl === 'string' ? result.defaultUrl : '';
  const defaultType =
    typeof result.defaultType === 'string' ? result.defaultType : '';

  if (defaultUrl) {
    const matched = [...map.values()].find((item) => item.url === defaultUrl);
    if (matched) {
      matched.isDefault = true;
    } else {
      map.set(defaultType || 'default', {
        type: defaultType || 'default',
        url: defaultUrl,
        isDefault: true,
      });
    }
  }

  return [...map.values()].sort(
    (a, b) => Number(!!b.isDefault) - Number(!!a.isDefault)
  );
}

/** 打开下载弹框，获取该图书支持的下载格式 */
function openDownload(book: IBook) {
  if (!token.value) {
    ElMessage.warning('请先输入 token');
    return;
  }
  if (!book.shId) {
    ElMessage.warning('该图书缺少 shId，无法下载');
    return;
  }

  currentBook.value = book;
  formats.value = [];
  downloadVisible.value = true;
  urlLoading.value = true;
  urlLoadingBookId.value = book.shId;

  get<IDownloadUrlRes>(`${CHINESEALL_API}/downloadurl`, {
    token: token.value,
    shId: book.shId,
  })
    .then((res) => {
      if (!res?.success) {
        ElMessage.error('获取下载地址失败');
        return;
      }
      formats.value = parseFormats(res);
      if (!formats.value.length) {
        ElMessage.warning('该图书暂无可用下载格式');
      }
    })
    .finally(() => {
      urlLoading.value = false;
      urlLoadingBookId.value = '';
    });
}

/** 按所选格式下载（由服务端下载并保存，前端只接收结果） */
async function doDownload(format: IDownloadFormat) {
  const book = currentBook.value;
  if (!book) return;

  downloadingType.value = format.type;
  try {
    const res = await post<IDownloadRes>(`${CHINESEALL_API}/download`, {
      token: token.value,
      name: book.name,
      url: format.url,
      isbn: (book.isbn || '').replaceAll('-', ''),
    });

    if (res && res.success === false) {
      ElMessage.error(res.message || `${format.type.toUpperCase()} 下载失败`);
      return;
    }

    ElMessage.success(
      `《${book.name}》${format.type.toUpperCase()} 已下载到服务端`
    );
    downloadVisible.value = false;
  } catch (err) {
    // 错误提示已由请求拦截器统一处理
    console.log('download err: ', err);
  } finally {
    downloadingType.value = '';
  }
}

function resetDownload() {
  formats.value = [];
  currentBook.value = null;
  downloadingType.value = '';
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

.download-format {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  min-height: 40px;
}
</style>
