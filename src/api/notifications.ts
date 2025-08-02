 
 export const registerEmailNotification = async (token:string | undefined, email: string) => {

        if(!token){
            return;
        }
        const res =　await fetch("http://localhost:8080/notifications/register",{
            method: "POST",
            headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({email}),
        });
        if(!res.ok){
            const errorData = await res.json();
            throw new Error(errorData.message || 'データの取得に失敗しました。');
        }
 }

