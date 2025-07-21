import React, { useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography, useTheme } from '@mui/material';
import { ExpenseCategory, incomeCategory, Transaction, TransactionType } from '../types';
import { useAppContext } from '../context/AppContext';
import useMonthlyTransactions from '../hooks/useMonthlyTransactions';

ChartJS.register(ArcElement, Tooltip, Legend);


function CategoryChart() {
const[selectedType, setSelectedType] = useState<TransactionType>("expense");
const theme = useTheme();
const { isLoading } = useAppContext();
const monthlyTransactions = useMonthlyTransactions();

const handleChange = (e: SelectChangeEvent<TransactionType>) => {
    setSelectedType(e.target.value  as TransactionType);
}
const categorySums = monthlyTransactions
.filter(
    (transaction) => transaction.type === selectedType
).reduce<Record<incomeCategory | ExpenseCategory , number>>((acc, transaction)=> {
    if(!acc[transaction.category]){
        acc[transaction.category] = 0;
    }
    acc[transaction.category] += transaction.amount;
    return acc;
},{} as Record<incomeCategory | ExpenseCategory , number>);

const categoryLabels = Object.keys(categorySums) as (incomeCategory | ExpenseCategory)[];

const categoryValues = Object.values(categorySums);

const options = {
  maintainAspectRatio:false,
  responsive: true,
};

const incomeCategoryColor:Record<incomeCategory, string>= {
    "給与": theme.palette.incomeCategoryColor.給与,
    "副収入": theme.palette.incomeCategoryColor.副収入,
    "お小遣い": theme.palette.incomeCategoryColor.お小遣い
}


const expenseCategoryColor:Record<ExpenseCategory, string>= {
    "食費": theme.palette.expenseCategoryColor.食費,
    "日用品": theme.palette.expenseCategoryColor.日用品,
    "娯楽": theme.palette.expenseCategoryColor.娯楽,
    "住居費": theme.palette.expenseCategoryColor.住居費,
    "交際費": theme.palette.expenseCategoryColor.交際費,
    "交通費": theme.palette.expenseCategoryColor.交通費,
}
const getCategoryColor = (category: incomeCategory | ExpenseCategory): string => {
    if(selectedType === "income"){
      return incomeCategoryColor[category as incomeCategory];
    }else {
    return expenseCategoryColor[category as ExpenseCategory];
    }
};
const data:ChartData<"pie"> = {
  labels: categoryLabels,
  datasets: [
    {
      data: categoryValues,
      backgroundColor: categoryLabels.map((category)=> getCategoryColor(category)),
      borderColor: categoryLabels.map((category)=> getCategoryColor(category)),
      borderWidth: 1,
    },
  ],
};

  return (
  <>
     <FormControl fullWidth>
        <InputLabel id="type-select-label">収支の種類</InputLabel>
        <Select
            labelId="type-select-label"
            id="type-select"
            value={selectedType}
            label="収支の種類"
            onChange={handleChange}
        >
            <MenuItem value="income">収入</MenuItem>
            <MenuItem value="expense">支出</MenuItem>
        </Select>
    </FormControl>
    <Box
        sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}
    >
{isLoading ? (
    <CircularProgress />
  ): monthlyTransactions.length > 0 ? (

    <Pie data={data} options={options} />
  ): (
    <Typography>データがありません</Typography>
  )}
    
    </Box>
  </>
  )
}

export default CategoryChart