import axios from "axios";

export async function queryQueues(url: string, name: string, password: string): Promise<string[]> {
    const queues_response = await axios.get(url, {
        auth: { username: name, password: password }
    });
    
    const queues: string[] = queues_response.data.map((rabbitQueue: any) => rabbitQueue.name);

    return queues;
}