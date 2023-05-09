<template>
  <el-row>
    <el-col :span="10">
      <h3>PrivateKey</h3>
      <el-input
        v-model="privateKey"
        :rows="15"
        type="textarea"
        placeholder="Please input private key"
      />
    </el-col>
    <el-col :span="4">
      <div class="flex flex-col items-center justify-center mt-4 btn-wrapper">
        <el-button @click="privateKey = ''">清空PrivateKey</el-button>
        <el-button>清空PublicKey</el-button>
      </div>
    </el-col>
    <el-col :span="10">
      <h3>PublicKey</h3>
      <el-input
        v-model="publicKey"
        :rows="15"
        type="textarea"
        placeholder="Please input public key"
      />
    </el-col>
  </el-row>
  <el-row class="mt-4">
    <el-col :span="10">
      <h3>原文</h3>
      <el-input
        v-model="orgText"
        :rows="15"
        type="textarea"
      />
    </el-col>
    <el-col :span="4">
      <div class="flex flex-col items-center justify-center mt-4 btn-wrapper">
        <el-button @click="decText = ''">清空密文</el-button>
        <el-button @click="privateKey = ''">加密→</el-button>
        <el-button @click="decrypt">←解密</el-button>
        <el-button @click="decryptHex">←解密转16进制</el-button>
      </div>
    </el-col>
    <el-col :span="10">
      <h3>密文</h3>
      <el-input
        v-model="decText"
        :rows="15"
        type="textarea"
        placeholder="密文"
      />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import JSEncrypt from 'jsencrypt';

const privateKey = ref('');
const publicKey = ref('');
const orgText = ref('');
// 密文
const decText = ref('');

const decrypt = () => {
  orgText.value = doDecrypt(decText.value)
}
const decryptHex = () => {
  const txt = doDecrypt(decText.value)
  let res = ''
  for (let i = 0;i<txt.length;i++) {
    let r = txt.charCodeAt(i).toString(16)
    if (r.length === 1) {
      r = '0' + r
    }
    res += r
  }
  orgText.value = res
}
const doDecrypt = (decText: string) => {
  const crypt = new JSEncrypt()
  crypt.setPrivateKey(privateKey.value)
  return crypt.decrypt(decText) || ''
}

</script>

<style lang="scss" scoped>
.btn-wrapper {
  padding-top: 20px;
  button {
    width: 120px;
    margin-left: 0;
    margin-bottom: 16px;
  }
}
</style>
