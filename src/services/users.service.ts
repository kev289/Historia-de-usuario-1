export const getUsers = async () => {
    const res = await fetch("/api/users")   
    const data = await res.json();
    
    return data;
}
