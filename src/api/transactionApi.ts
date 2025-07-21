export const fetchTransactionsFormServer = async () => {
    try{
        const res = await fetch('http://localhost:8080/transactions');
        if(!res.ok){
            throw new Error('データ取得に失敗しました。');
        }
        const data = await res.json();
        return data;
    } catch (error){
        console.log("Fetch error:",error);
        return [];
    }
};