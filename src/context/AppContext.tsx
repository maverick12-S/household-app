
import { createContext, ReactNode, useContext, useState } from "react";
import { Transaction } from "../types";
import { useMediaQuery, useTheme } from "@mui/material";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Schema } from "../validations/schema";
import { db } from "../firebase";
import { isFireStoreError } from "../utils/errorHandling";

interface AppContextType {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    currentMonth: Date;
    setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isMobile: boolean;
    onSaveTransaction: (transaction: Schema) => Promise<void>;
    onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>;
    onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


export const AppContextProvider = ({children}: {children:ReactNode}) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

      const onSaveTransaction = async(transaction: Schema) => {
        try{
          const  docRef = await addDoc(collection(db, "Transactions"), transaction);
          const newTransaction ={
            id : docRef.id,
            ...transaction
          } as Transaction;
          setTransactions((prevTransaction) => [...prevTransaction, newTransaction]);
        } catch(error) {
            if (isFireStoreError(error)) {
              console.error('🔥 Firestoreエラー:', error.message);
            } else {
              console.error('🛑 一般的なエラー:', error);
            }
          }
        
      }
      
      const onDeleteTransaction = async(transactionIds: string | readonly string[]) => {
        try{
          const idsToDelete = Array.isArray(transactionIds) ? transactionIds : [transactionIds];
          console.log('削除するID:', idsToDelete);
          for(const id of idsToDelete) {
            await deleteDoc(doc(db,"Transactions",id));
          }
          const filterdTransactions = transactions.filter(
                (transaction) => !idsToDelete.includes(transaction.id));
            setTransactions(filterdTransactions);
             }catch(error) {
            if (isFireStoreError(error)) {
              console.error('🔥 Firestoreエラー:', error.message);
            } else {
              console.error('🛑 一般的なエラー:', error);
            }
          }
      }
    
      const onUpdateTransaction = async(transaction: Schema, transactionId: string) => {
        try{
          const docRef = doc(db, "Transactions" , transactionId);
          await updateDoc(docRef,transaction);
    
          const updatedTransactions = transactions.map((t) =>
            t.id === transactionId ? {...t, ...transaction} : t);
          setTransactions(updatedTransactions);
    
        }catch(error){
          if (isFireStoreError(error)) {
              console.error('🔥 Firestoreエラー:', error.message);
            } else {
              console.error('🛑 一般的なエラー:', error);
            }
        }
      }


    return (
        <AppContext.Provider 
        value={{
            transactions
            ,setTransactions
            ,currentMonth
            ,setCurrentMonth
            ,isLoading
            ,setIsLoading,
            isMobile,
            onSaveTransaction,
            onDeleteTransaction,
            onUpdateTransaction,
            }}>

            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if(!context){
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
};