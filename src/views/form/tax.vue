<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form
        ref="formRef"
        :model="taxForm"
        :rules="taxFormRules"
        label-position="right"
        label-width="95px"
      >
        <el-form-item label="月薪" prop="salary">
          <el-input
            v-model="taxForm.salary"
            type="text"
            autocomplete="off"
            clearable
          >
            <template #append> 元 </template>
          </el-input>
        </el-form-item>
        <el-form-item label="专项扣除" prop="deductions">
          <el-input
            v-model="taxForm.deductions"
            type="text"
            autocomplete="off"
            clearable
          >
            <template #append> 元 </template>
          </el-input>
        </el-form-item>
        <el-form-item label="公积金基数" prop="fund">
          <el-input
            v-model.number="taxForm.fund"
            type="text"
            autocomplete="off"
            clearable
          >
            <template #append>
              <el-button @click="setForm('fund')">带入月薪</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="公积金比例" prop="fundPercent">
          <el-slider
            v-model="taxForm.fundPercent"
            :min="5"
            :max="12"
            show-input
          />
        </el-form-item>
        <el-form-item label="社保基数" prop="social">
          <el-input
            v-model.number="taxForm.social"
            type="text"
            autocomplete="off"
          >
            <template #append>
              <el-button @click="setForm('social')">带入月薪</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-collapse>
          <el-collapse-item title="社保比例设置（一般不用改，暂不开放编辑）">
            <el-form-item label="医疗" prop="medical">
              <el-input
                v-model="taxForm.medical"
                type="text"
                autocomplete="off"
                disabled
              >
                <template #append>%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="养老" prop="endowment">
              <el-input
                v-model="taxForm.endowment"
                type="text"
                autocomplete="off"
                disabled
              >
                <template #append>%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="失业" prop="unemployment">
              <el-input
                v-model="taxForm.unemployment"
                type="text"
                autocomplete="off"
                disabled
              >
                <template #append>%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="工伤" prop="injury">
              <el-input
                v-model="taxForm.injury"
                type="text"
                autocomplete="off"
                disabled
              >
                <template #append>%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="生育" prop="birth">
              <el-input
                v-model="taxForm.birth"
                type="text"
                autocomplete="off"
                disabled
              >
                <template #append>%</template>
              </el-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-form-item>
          <el-button type="primary" @click="calc">计算</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="12">
      <el-table :data="tableData" border stripe show-summary>
        <el-table-column prop="month" label="月份"></el-table-column>
        <el-table-column prop="tax" label="税费"></el-table-column>
        <el-table-column prop="salary" label="税后月薪"></el-table-column>
        <el-table-column prop="salaryWithFund" label="税后+公积金月薪"></el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import type { CSSProperties } from 'vue';
import { getTax, type ITaxInfo } from '../../utils/tax';

interface Mark {
  style: CSSProperties;
  label: string;
}

type Marks = Record<number, Mark | string>;

const formRef = ref<FormInstance>();

const taxForm = reactive({
  salary: '', // 月薪
  freeFee: '5000', // 免税扣除
  deductions: '', // 个人专项扣除
  social: '', // 社保基数
  fund: '', // 公积金基数
  fundPercent: 12, // 公积金5%-12%
  medical: 2, // 医疗保险2%
  endowment: 8, // 养老保险 8%
  unemployment: 0.5, // 失业保险0.5%
  injury: 0, // 工伤保险 0%
  birth: 0, // 生育保险 0%
});

const salarReg = /^[1-9]\d{3,10}$/;
const validateNum = (rule: any, value: any, callback: any) => {
  if (salarReg.test(value)) {
    callback();
  } else {
    callback(new Error('请输入4-11位数字'));
  }
};

const taxFormRules = reactive<FormRules>({
  salary: [
    {
      required: true,
      message: '请输入月薪',
      trigger: 'blur',
    },
    {
      validator: validateNum,
      trigger: 'blur',
    },
  ],
  fund: [
    {
      required: true,
      message: '请输入公积金缴纳基数',
      trigger: 'blur',
    },
    {
      pattern: /^[1-9]\d{3,4}/,
      message: '请输入4-5位数字',
      trigger: 'blur',
    },
  ],
  social: [
    {
      required: true,
      message: '请输入社保缴纳基数',
      trigger: 'blur',
    },
    {
      pattern: /^[1-9]\d{3,4}/,
      message: '请输入4-5位数字',
      trigger: 'blur',
    },
  ],
  deduction: [
    {
      validator: (rule: any, value, cb) => {
        if (!value) {
          cb();
        } else if (!/^[1-9]\d{3,4}$/.test(value)) {
          cb(new Error('请输入4-5位数字'));
        } else {
          cb();
        }
      },
    },
  ],
});

const marks = reactive<Marks>({
  5: '5%',
  6: '6%',
  7: '7%',
  8: '8%',
  9: '9%',
  10: '10%',
  11: '11%',
  12: '12%',
});

const tableData = ref<Array<ITaxInfo>>([]);

const setForm = (key: 'fund' | 'social') => {
  taxForm[key] = taxForm.salary;
};

const calc = () => {
  formRef.value?.validate((valid) => {
    if (!valid) {
      return;
    }
    const social =
      taxForm.medical +
      taxForm.endowment +
      taxForm.unemployment +
      taxForm.birth +
      taxForm.injury;
    const res = getTax({
      salary: parseInt(taxForm.salary),
      fundNum: parseInt(taxForm.fund),
      fund: taxForm.fundPercent,
      social,
      socialNum: parseInt(taxForm.social),
      deductions: parseFloat(taxForm.deductions),
    });
    tableData.value = res.month
  });
};
</script>
