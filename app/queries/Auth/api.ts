import { useHttpPrivateRequest } from '@/services/httpRequest/useHttpPrivateRequest';
import { LoginPayload } from './types';
import { API_URLS } from '../keys';
import useHttpPublicRequest from '@/services/httpRequest/useHttpPublicRequest ';

const useApi = (baseURL = API_URLS.IDENTITY) => {
  const publicApi = useHttpPublicRequest(baseURL);
  const privateApi = useHttpPrivateRequest(baseURL);

  const authenticate = (payload: LoginPayload) => {
    return publicApi.post('/api/v1/auth/token', payload);
  };

  const getUserInfo = () => {
    return privateApi.get('/api/v1/users/me');
  };

  const getRefreshToken = () => {
    return publicApi.post('/api/v1/auth/refresh');
  };

  return {
    authenticate,
    getUserInfo,
    getRefreshToken,
  };
};

export default useApi;