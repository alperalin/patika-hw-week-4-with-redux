import { service } from './service';
import { StatusGetProps } from './types';

async function getStatus(data: StatusGetProps) {
	// API call
	return await service
		.get('/status', { params: data })
		.then((response) => response.data);
}

export default getStatus;
