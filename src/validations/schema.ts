import { z } from "zod";

const allCategories = [
  "食費", "日用品", "住居費", "交際費", "娯楽", "交通費",
  "給与", "副収入", "お小遣い",
] as const;

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  date: z.string().min(1, { message: "日付は必須です" }),
  amount: z.number().min(1, { message: "金額は1円以上必須です" }),
  content: z.string().min(1, { message: "内容を入力してください" }).max(50),
  category: z.enum(allCategories),
});
export type Schema = z.infer<typeof transactionSchema>;
