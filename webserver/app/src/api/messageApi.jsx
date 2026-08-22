import { useUserStore } from '../stores/userStore'; // Adapte le chemin
import { socket } from '../socket'; // ← Importe le socket
import { apiClient } from './client';

export async function SendMessage(receiver_id, content) {
    const userId = useUserStore.getState().user?.id; // ← Récupère l'userId
    
    if (!userId) {
        console.error('❌ Pas d\'userId trouvé');
        return;
    }
    
    console.log('🚀 Émission send_direct_message:', { userId, receiver_id, content });
    socket.emit('send_direct_message', {
        senderId: userId,
        receiverId: receiver_id,
        content: content
    });
}

export async function GetMessage(receiver_id)
{
    const { data } = await apiClient.get(`/message/${receiver_id}`)
    return data.data
}

export async function GetAllMessages()
{
    const { data } = await apiClient.get("/message")
    return data.data
}



// DELETE ET UPDATE A MIGRER SUR SOCKET AUSSI A FAIRE PLUS TARD
export async function UpdateMessage(message_id, content)
{
    const { data } = await apiClient.put(`/message/${message_id}`, {
        content: content
    })
    return data.data
}


export async function DeleteMessage(message_id)
{
    const { data } = await apiClient.delete(`/message/${message_id}`)
    return data.data
}