import * as request from './requester'

const BrandBaseUrl = 'http://127.0.0.1:8882/'
const ClientsBaseUrl =  'http://127.0.0.1:8881/'
const InvoiceBaseUrl = 'http://127.0.0.1:8883/'


// Geting data
export const GetBrandData = async () => request.get(BrandBaseUrl);

export const GetAllClients = async () => request.get(ClientsBaseUrl);

export const GetAllInvoices = async () => request.get(InvoiceBaseUrl);


// Create in db

export const CreateBrandData = async (data) => request.post(`${BrandBaseUrl}create/`, data)

export const CreateNewInvoice = async (data) => request.post(`${InvoiceBaseUrl}create/`, data)


