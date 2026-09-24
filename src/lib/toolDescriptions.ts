export const toolDescriptions: Record<
  string,
  { en: { how: string[] }; ur: { how: string[] } }
> = {
  emi: {
    en: {
      how: [
        "Enter the loan principal (total amount borrowed).",
        "Enter the annual interest rate in percent.",
        "Enter the tenure in years.",
        "Click Calculate to see monthly EMI, total interest and total payment.",
      ],
    },
    ur: {
      how: [
        "قرض کی اصل رقم درج کریں۔",
        "سالانہ سود کی شرح فیصد میں درج کریں۔",
        "مدت سالوں میں درج کریں۔",
        "حساب لگائیں — ماہانہ قسط، کل سود اور کل ادائیگی نظر آئے گی۔",
      ],
    },
  },
  sip: {
    en: {
      how: [
        "Enter monthly investment amount.",
        "Enter expected annual return (%).",
        "Enter tenure in years.",
        "See maturity value, amount invested and estimated gain.",
      ],
    },
    ur: {
      how: [
        "ماہانہ سرمایہ کاری درج کریں۔",
        "متوقع سالانہ منافع (%) لکھیں۔",
        "مدت سالوں میں درج کریں۔",
        "میچورٹی، کل سرمایہ اور منافع دیکھیں۔",
      ],
    },
  },
  bmi: {
    en: {
      how: [
        "Enter weight in kg and height in cm.",
        "Click Calculate BMI.",
        "Read BMI number and health category.",
      ],
    },
    ur: {
      how: [
        "وزن (kg) اور قد (cm) درج کریں۔",
        "BMI حساب لگائیں۔",
        "BMI نمبر اور صحت کا زمرہ دیکھیں۔",
      ],
    },
  },
  age: {
    en: {
      how: [
        "Select your date of birth.",
        "Click Calculate Age.",
        "See years, months, days and total days lived.",
      ],
    },
    ur: {
      how: [
        "تاریخ پیدائش منتخب کریں۔",
        "عمر حساب لگائیں۔",
        "سال، مہینے، دن اور کل دن دیکھیں۔",
      ],
    },
  },
  basic: {
    en: {
      how: [
        "Tap numbers and operators like a normal calculator.",
        "Use C to clear and ⌫ to delete.",
        "Press = to get the result.",
      ],
    },
    ur: {
      how: [
        "نمبر اور آپریٹر دبائیں۔",
        "C سے صاف، ⌫ سے مٹائیں۔",
        "= سے نتیجہ دیکھیں۔",
      ],
    },
  },
  percentage: {
    en: {
      how: [
        "Choose mode: % of number, what % is X of Y, or percent change.",
        "Enter the two values.",
        "Click Calculate for the answer.",
      ],
    },
    ur: {
      how: [
        "موڈ منتخب کریں: فیصد، کتنا فیصد، یا تبدیلی۔",
        "دونوں ویلیو درج کریں۔",
        "حساب لگائیں دبائیں۔",
      ],
    },
  },
  currency: {
    en: {
      how: [
        "Enter amount and choose From / To currencies.",
        "Click Convert (needs internet for live rates).",
        "See converted amount and exchange rate.",
      ],
    },
    ur: {
      how: [
        "رقم اور From/To کرنسی منتخب کریں۔",
        "Convert دبائیں (لائیو ریٹ کے لیے انٹرنیٹ چاہیے)۔",
        "نتیجہ اور ایکسچینج ریٹ دیکھیں۔",
      ],
    },
  },
  default: {
    en: {
      how: [
        "Fill in the required fields carefully.",
        "Click Calculate.",
        "Check the result panel for the answer and extra details.",
      ],
    },
    ur: {
      how: [
        "ضروری خانے بھریں۔",
        "حساب لگائیں دبائیں۔",
        "نتیجہ والے خانے میں جواب دیکھیں۔",
      ],
    },
  },
};

export function getHowTo(toolId: string, lang: "en" | "ur") {
  const d = toolDescriptions[toolId] || toolDescriptions.default;
  return d[lang].how;
}
