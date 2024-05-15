import * as request from './requester'

const BrandBaseUrl = 'http://127.0.0.1:8882/'
const ClientsBaseUrl =  'http://127.0.0.1:8881/'
const InvoiceBaseUrl = 'http://127.0.0.1:8883/'


// Geting data
export const GetBrandData = async () => request.get(BrandBaseUrl);

export const GetAllClients = async () => request.get(ClientsBaseUrl);

export const GetAllInvoices = async () => request.get(InvoiceBaseUrl);

export const GetInvoiceData = async (id) => request.get(`${InvoiceBaseUrl}get_invoice?id=${id}`);

// Create in db

export const CreateBrandData = async (data) => request.post(`${BrandBaseUrl}create/`, data)

export const CreateNewInvoice = async (data) => request.post(`${InvoiceBaseUrl}create/`, data)

export const CreateNewClient = async (data) => request.post(`${ClientsBaseUrl}create/`, data)




// Delete from db

export const DeleteClient = async (id) => request.del(`${ClientsBaseUrl}delete?id=${id}`)

export const DeleteInvoice = async (id) => request.del(`${InvoiceBaseUrl}delete?id=${id}`)
