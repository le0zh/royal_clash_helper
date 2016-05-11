// API的跟地址 
const API_PATH = 'http://192.168.68.131:9001/api/v1';

//const API_PATH = 'http://42.96.171.42:9001/api';

//const API_PATH = 'http://192.168.68.131:3001/api';

export default class ApiService {
	apiPath() {
		return API_PATH;
	}

	fetchPromise(url) {
		// return fetch(url, {
		// 	//这里可以设置请求头，可以添加Token
		// 	//headers: this.tokenHeader(),
		// });

		return fetch(url);
	}
}

const apiService = new ApiService();

module.exports = apiService;