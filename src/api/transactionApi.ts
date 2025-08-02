import { Schema } from "../validations/schema";

const API_BASE_URL = 'http://localhost:8080';
const CRUD_ENDPOINT = '/transactions';

const METHOD = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE',
} as const;

const createAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// ✅ 共通エラー処理関数
const handleError = async (res: Response) => {
  try {
    const errorData = await res.json();
    throw new Error(errorData.message || 'データの取得に失敗しました。');
  } catch {
    throw new Error('不明なサーバーエラーが発生しました。');
  }
};

export const fetchTransactionFormServer = async (token: string | undefined) => {
  if (!token) {
    throw new Error('データを読み込み中');
  }
  const headers = createAuthHeaders(token);
  const res = await fetch(`${API_BASE_URL}${CRUD_ENDPOINT}`, {
    method: METHOD.get,
    headers: headers,
  });

  if (!res.ok) {
    await handleError(res);
  }

  return await res.json();
};

export const postTransactionToServer = async (transaction: Schema, token: string | undefined) => {
  try {
    if (!token) {
      return;
    }
    const headers = createAuthHeaders(token);
    const res = await fetch(`${API_BASE_URL}${CRUD_ENDPOINT}`, {
      method: METHOD.post,
      headers: headers,
      body: JSON.stringify(transaction),
    });

    if (!res.ok) {
      await handleError(res);
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const updateTransactionOnServer = async (transaction: Schema, transactionId: string, token: string | undefined) => {
  if (!token) {
    return;
  }
  const headers = createAuthHeaders(token);
  const res = await fetch(`${API_BASE_URL}${CRUD_ENDPOINT}/${transactionId}`, {
    method: METHOD.put,
    headers: headers,
    body: JSON.stringify(transaction),
  });

  if (!res.ok) {
    await handleError(res);
  }

  return await res.json();
};

export const deleteTransactionOnServer = async (ids: string[], token: string | undefined) => {
  if (!token) {
    return;
  }
  const headers = createAuthHeaders(token);
  const res = await fetch(`${API_BASE_URL}${CRUD_ENDPOINT}/${ids}`, {
    method: METHOD.delete,
    headers: headers,
    body: JSON.stringify(ids),
  });

  if (!res.ok) {
    await handleError(res);
  }

  return true;
};
