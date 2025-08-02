import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import {
  accountManagement,
  getToken,
  login,
  logout,
} from "../auth/keycloak";
import {
  deleteTransactionOnServer,
  postTransactionToServer,
  updateTransactionOnServer,
} from "../api/transactionApi";
import { Transaction } from "../types";
import { Schema } from "../validations/schema";
import { ErrorSnackbar } from "../components/common/ErrorSnackbar";
import { AuthContext } from "./AuthContext";

interface AppContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  onDeleteTransaction: (
    transactionId: string | readonly string[]
  ) => Promise<void>;
  onUpdateTransaction: (
    transaction: Schema,
    transactionId: string
  ) => Promise<void>;
  isAuthenticated: boolean | undefined;
  userInfo: unknown;
  login: () => void;
  logout: () => void;
  accountManagement: () => void;
  accessToken: string | undefined;
  errorMessage: string;
  setError: (message: string) => void;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const authContext = useContext(AuthContext);
  const accessToken = authContext?.accessToken;
  const isAuthenticated = authContext?.isAuthenticated;
  const userInfo = authContext?.userInfo;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const setError = (message: string) => setErrorMessage(message);
  const clearError = () => setErrorMessage("");

  const onSaveTransaction = async (transaction: Schema) => {
    try {
      const token = accessToken;
      const savedTransaction = await postTransactionToServer(transaction, token);
      if (savedTransaction && "id" in savedTransaction) {
        setTransactions((prev) => [...prev, savedTransaction as Transaction]);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const onDeleteTransaction = async (
    transactionIds: string | readonly string[]
  ) => {
    try {
      const token = accessToken;
      const idsToDelete = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds];
      const success = await deleteTransactionOnServer(idsToDelete, token);
      if (success) {
        setTransactions((prev) =>
          prev.filter((t) => !idsToDelete.includes(t.id))
        );
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const onUpdateTransaction = async (
    transaction: Schema,
    transactionId: string
  ) => {
    try {
      const token = accessToken;
      const updated = await updateTransactionOnServer(
        transaction,
        transactionId,
        token
      );
      if (updated) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === transactionId ? { ...t, ...updated } : t))
        );
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        setTransactions,
        currentMonth,
        setCurrentMonth,
        isLoading,
        setIsLoading,
        isMobile,
        onSaveTransaction,
        onDeleteTransaction,
        onUpdateTransaction,
        isAuthenticated,
        userInfo,
        login,
        logout,
        accountManagement,
        accessToken,
        errorMessage,
        setError,
        clearError,
      }}
    >
      <ErrorSnackbar open={!!errorMessage} message={errorMessage} onClose={clearError} />
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
