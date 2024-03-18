import * as requester from "./request"

const BaseUrl = 'http://127.0.0.1:8080/'

export const get_tasks = async () => requester.get(`${BaseUrl}tasks/`);

export const create_task = async (data) => requester.post(`${BaseUrl}create_task/`, data);

export const updateTask = async (status_id, id) => requester.post(`${BaseUrl}modify_task?status_id=${status_id}&id=${id}`);
