import { apiClient } from './client';

export async function SendMessage(receiver_id, content)
{
    const { data } = await apiClient.post(`/message/${receiver_id}`, {
        content: content
    })
    return data.data
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