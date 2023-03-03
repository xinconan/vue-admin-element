// const example = {
//   salary: 33000,
//   fundNum: 33000, // 公积金缴纳基数
//   fund: 7, // 公积金缴纳比例
//   socialNum: 33000,
//   social: 10.5, // 社保五险缴纳总比例
//   deductions: 1500, // 附加扣除
// };

interface ITaxConfig {
  salary: number; // 月薪
  fundNum: number; // 公积金缴纳基数
  fund: number; // 公积金缴纳比例
  socialNum: number; // 社保缴纳基数
  social: number; // 社保五险缴纳总比例
  deductions: number; // 附加扣除
}

export interface ITaxInfo {
  tax: number;
  month: number;
  salary: number;
  salaryWithFund: number;
}

export interface ITaxResult {
  month: Array<ITaxInfo>;
  total: number;
  average: number;
  averageWithFund: number;
}

export function getTax(config: ITaxConfig): ITaxResult {
  const res = [];
  const socialNum = ((config.socialNum * config.social) / 100).toFixed(2);
  const fundNum = ((config.fundNum * config.fund) / 100).toFixed(2);
  console.log(socialNum, fundNum);
  const deduct = [0];
  // 每月扣除五险一金后
  const monthNum = config.salary - Number(socialNum) - Number(fundNum);
  const monthTax = monthNum - 5000 - config.deductions;
  let total = 0;
  const monthFund = parseFloat(fundNum) * 2;
  for (let i = 0; i < 12; i++) {
    // 扣除5000后计税部分
    const sum = monthTax * (i + 1);
    let tax = 0;
    if (sum <= 36000) {
      tax = sum * 0.03 - deduct[i];
    } else if (sum > 36000 && sum <= 144000) {
      tax = sum * 0.1 - 2520 - deduct[i];
    } else if (sum > 144000 && sum <= 300000) {
      tax = sum * 0.2 - 16920 - deduct[i];
    } else if (sum > 300000 && sum <= 420000) {
      tax = sum * 0.25 - 31920 - deduct[i];
    } else if (sum > 420000 && sum <= 660000) {
      tax = sum * 0.3 - 52920 - deduct[i];
    } else if (sum > 660000 && sum <= 960000) {
      tax = sum * 0.35 - 85920 - deduct[i];
    } else if (sum > 960000) {
      tax = sum * 0.45 - 181920 - deduct[i];
    }
    tax = +tax.toFixed(2);
    deduct[i + 1] = tax + deduct[i];
    res.push({
      tax,
      month: i + 1,
      salary: monthNum - tax,
      salaryWithFund: monthFund + monthNum - tax,
    });

    total += res[i].salary;
  }

  const average = parseFloat((total / 12).toFixed(2));

  return {
    month: res,
    total,
    average,
    averageWithFund: average + monthFund,
  };
}
