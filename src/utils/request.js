import axios from "axios";
import { Message } from 'element-ui';
import qs from 'qs';

// 请求基础路径配置
class Baseurl{
	static host = '127.0.0.1';
	static port = '3000';
	static path = 'api';

	static baseURL(){
		return `http://${this.host}:${this.port}/${this.path}`;
	}
}

// 请求基础路径
axios.defaults.baseURL = Baseurl.baseURL();

// 响应时间设置
axios.defaults.timeout = 5000;

// 默认的post传参方式就是application/x-www-form-urlencoded;charset=UTF-8，不过使用该方式时需要用qs对post进行传参序列化
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

console.log(axios.defaults.baseURL);

// token 白名单url
const tokenWL = ['/user/login'];

// request 请求拦截器
//挂载请求拦截器 (相当于请求的预验证，请求到达服务器之前先验证这次请求)
axios.interceptors.request.use(config => {

	// 如果浏览器中有token且该地址不在白名单中，则为请求头添加token
	if(window.sessionStorage.getItem("token") && !tokenWL.includes(config.url)){
		//为请求头添加对象，添加token验证的Authorization字段
		config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem("token");
	}

	// 如果是post请求，使用qs序列化对象
	if(config.method  === 'post'){
        config.data = qs.stringify(config.data);
    }
	return config;
});

// response 响应拦截器
axios.interceptors.response.use(
	// 响应处理
	response => {
		const code = response.status;
		// 自定义响应码，233为直接渲染显示错误信息
		if(code == 233){
			Message.warning(response.data.msg);
		}
		// 自定义响应码，仅在控制台输出错误信息
		if(code == 250){
			console.warn('[响应提示]',response.data.msg);
		}
		if(code == 200){
			return response.data;
		}
	},

	//响应错误拦截
	error => {
		return Promise.reject(error);
	}
);

export default axios;