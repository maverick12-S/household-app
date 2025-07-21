import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
}from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AlarmIcon from '@mui/icons-material/Alarm';
import AddHomeIcon from '@mui/icons-material/AddHome';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import TrainIcon from '@mui/icons-material/Train';
import WorkIcon from '@mui/icons-material/Work';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import SavingsIcon from '@mui/icons-material/Savings';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ExpenseCategory, incomeCategory, Transaction } from '../types';
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, transactionSchema } from "../validations/schema";
import { Category } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

interface TransactionFormProps {
  onCloseForm: () => void,
  isEntryDrawerOpen: boolean,
  currentDay: string,
  selectedTransaction: Transaction | null,
  setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


type IncomeExpense = "income" | "expense";
interface CategoryItem{
  label: incomeCategory | ExpenseCategory;
  icon : JSX.Element;
}

const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  selectedTransaction,
  setSelectedTransaction,
  isDialogOpen,
  setIsDialogOpen,
 }: TransactionFormProps) => {

  const {isMobile,onSaveTransaction,onDeleteTransaction,onUpdateTransaction} = useAppContext();
  const formWidth = 320;
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState:{errors},
    reset
  } = useForm<Schema>({
    defaultValues: {
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "" as Schema["category"],
      content:"" ,
    },
    resolver: zodResolver(transactionSchema),
  });
  console.log(errors);

  const currentType = watch("type");

  useEffect(() => {
    setValue("date", currentDay);
  },[currentDay])

  const expenseCategories:CategoryItem[] = [
    {label: "食費", icon:<FastfoodIcon fontSize="small" />},
    {label: "日用品", icon:<AlarmIcon fontSize="small"/>},
    {label: "住居費", icon:<AddHomeIcon fontSize="small"/>},
    {label: "交際費", icon:<Diversity3Icon fontSize="small"/>},
    {label: "娯楽", icon:<SportsTennisIcon fontSize="small"/>},
    {label: "交通費", icon:<TrainIcon fontSize="small"/>},
  ]

  const incomeCategories: CategoryItem[] = [
    {label: "給与", icon:<WorkIcon fontSize="small" />},
    {label: "副収入", icon:<AddBusinessIcon fontSize="small"/>},
    {label: "お小遣い", icon:<SavingsIcon fontSize="small"/>},
  ]

  const[categories,setCategories] = useState(expenseCategories);
  useEffect(() => {
    const newCategories = currentType === "expense" ?  expenseCategories : incomeCategories;
    setCategories(newCategories);
  },[currentType])

  const onSubmit:SubmitHandler<Schema> = (data:Schema) => {
    if(selectedTransaction){
      onUpdateTransaction(data,selectedTransaction.id)
      .then(() => {
        setSelectedTransaction(null);
        if(isMobile){
          setIsDialogOpen(false);
          }
      })
      .catch((error) => {
        console.error(error);
      })
    }else{
      onSaveTransaction(data)
      .then(() => {
        if(isMobile){
          setIsDialogOpen(false);
          }
      })
      .catch((error) => {
        console.error(error);
      })
    }
    reset({
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "" as Schema["category"],
      content:""});
  };

  useEffect(() => {
    if(selectedTransaction){
      const categoryExists = categories.some(
        (category) => category.label === selectedTransaction.category);
        setValue("category",categoryExists ? selectedTransaction.category : "" as Schema["category"]);
    }
    
  },[selectedTransaction, categories])
  useEffect(() => {
    if(selectedTransaction){
      setValue("type",selectedTransaction.type);
      setValue("date",selectedTransaction.date);
      setValue("amount",selectedTransaction.amount);
      setValue("content",selectedTransaction.content);
    }else{
      reset({
        date: currentDay,
        type: "expense",
        amount: 0,
        category: "" as Schema["category"],
        content:""
      })
    }
  }, [selectedTransaction]);

  const handleDelete = () => {
    if(selectedTransaction){
          onDeleteTransaction(selectedTransaction?.id);
          if(isMobile){
          setIsDialogOpen(false);
          }
          setSelectedTransaction(null);
    }
  }
  const formContent = (
    <>
      <Box display={"flex"} justifyContent="space-between" mb={2}>
      <Typography>入力</Typography>
      <IconButton
        onClick={onCloseForm}
        sx={{
          color: (theme) => theme.palette.grey[500],
        }}
      >
      <CloseIcon/>
      </IconButton>
    </Box>
    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <Controller
  name="type"
  control={control}
  render={({ field }) => (
    <ButtonGroup fullWidth>
      <Button
        variant={field.value === "expense" ? "contained" : "outlined"}
        color="error"
        onClick={() => field.onChange("expense")}
      >
        支出
      </Button>
      <Button
        variant={field.value === "income" ? "contained" : "outlined"}
        onClick={() => field.onChange("income")}
      >
        収入
      </Button>
    </ButtonGroup>
  )}
/>
 <Controller
  name="date"
  control={control}
  render={({ field }) => (

    <TextField
    label="日付"
    type="date"
    InputLabelProps={{ shrink: true }}
    error={!!errors.date}
    helperText={errors.date?.message}
    value={field.value}
    onChange={field.onChange}
    fullWidth
    />
  )}
/>
          <Controller
  name="category"
  control={control}
  render={({ field }) => (
    <TextField
      {...field}
      label="カテゴリ"
      select
      error={!!errors.category}
      helperText={errors.category?.message}
      value={field.value || ""}
      InputLabelProps={{
        htmlFor: "category"
      }}
      inputProps={{ id: "category" }}
      fullWidth
    >
      {categories.map((category, index) => (
        <MenuItem value={category.label} key={index}>
          <ListItemIcon>{category.icon}</ListItemIcon>
          {category.label}
        </MenuItem>
      ))}
    </TextField>

  )}
/>

          <Controller
          name="amount"
          control={control}
          render={({field}) => (
            <TextField
            error={!!errors.amount}
             helperText={errors.amount?.message}
            {...field }
            value={field.value === 0 ? "" : field.value}
            onChange={(e) => {
              const newValue = parseInt(e.target.value,10) || 0;
              field.onChange(newValue);
            }}
            label="金額"
            type="number" />
          )}
          />


      <Controller
  name="content"
  control={control}
  render={({ field }) => (
    <TextField
      label="内容"
      type="text"
      error={!!errors.content}
      helperText={errors.content?.message}
      value={field.value || ""}
      onChange={field.onChange}
      fullWidth
    />
  )}
/>

<Button
  type="submit"
  variant="contained"
  color={currentType === "income" ? "primary" : "error"}
  fullWidth
>
  {selectedTransaction ? "更新" : "保存"}
</Button>
  {selectedTransaction && (
    <Button onClick={handleDelete}
  variant="outlined"
  color={"secondary"}
  fullWidth
>
  削除
</Button>
  )}
      </Stack>
    </Box>
    </>
  )


  return (
    <>
    {isMobile ? (
      <Dialog open={isDialogOpen} fullWidth maxWidth="sm" onClose={onCloseForm}>
        <DialogContent>
          {formContent}
        </DialogContent>
      </Dialog>
    ):(
      <Box
      sx={{
        position: 'fixed',
        top: 64,
        right: isEntryDrawerOpen ?formWidth : "-2%",
        width: formWidth,
        height: "100%",
        bgcolor: "background.paper",
        zIndex: (theme) => theme.zIndex.drawer - 1,
        transition: (theme) =>
          theme.transitions.create('right', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          p: 2,
          boxSizing: 'border-box',
          boxShadow: "0px 0px 15px -5px #777777",
      }}
    >
      {formContent}
    </Box>
    )}
    
    </>
  );
};

export default TransactionForm