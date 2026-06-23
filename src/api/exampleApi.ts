import apiClient from './axiosInterceptor'
import { itemsUrl } from '../utils/utils'

export const fetchItems = async (params = {}) => {
  const response = await apiClient.get(itemsUrl, { params })
  return response.data
}

export default {
  fetchItems,
}
