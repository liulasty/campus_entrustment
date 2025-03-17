import axios from "axios";

import {paramsFilter, handleError} from "./help";
import {clearLoginInfo} from "@/utils";
import Cookies from "js-cookie";
// 封装 axios
const service = axios.create({
    timeout: 1000 * 120, withCredentials: true, headers: {
        "Content-Type": "application/json; charset=utf-8"
    }
});
let cancel;
const promiseArr = {};
// const { CancelToken } = service;

// 请求拦截器
service.interceptors.request.use(config => {
    // 发起请求时，取消掉当前正在进行的相同请求
    if (promiseArr[config.url]) {
        promiseArr[config.url]();
        promiseArr[config.url] = cancel;
    } else {
        promiseArr[config.url] = cancel;
    }
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    let token = Cookies.get("token");
    // let token = Store.state.user.token;
    token = token ? `Bearer ${token}` : "";
    config.headers.Authorization = token;
    return config;
}, error => Promise.reject(error));

// 响应拦截器即异常处理
service.interceptors.response.use(response => {
    // console.log("response:", response)
    if (response.request.responseType === "blob") {
        return response;
    }
    if (response.headers['content-type'].indexOf('application/octet-stream') != -1 || response.headers['content-type'].indexOf('application/pdf') != -1) {
        // console.log("response:", response)
        const blob = new Blob([response.data], {type: 'application/pdf'})
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = window.URL.createObjectURL(blob)
        link.setAttribute('download', response.headers['filename'])
        document.body.appendChild(link)
        link.click()

        // const url = window.URL.createObjectURL(
        //     new Blob([response.data], {
        //         type: "application/pdf;charset=UTF-8;"
        //     })
        // );
        // const link = document.createElement("a");
        // link.href = url;
        //
        // window.open(url); // 直接打开预览的代码

        // 下载的代码
        // link.setAttribute(response.headers['filename'], 'test');
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);

    }
    /**
     * 这里错误码处理
     */
    const err = {};
    // 按需求配置 error==0 表示操作成功
    switch (response.data.code) {
        case 0:
        case '0000':
        case 200:
            return response.data;
        case 10000:
            // token过期
            clearLoginInfo();
            err.message = response.data.msg || response.data.message || "操作失败11";
            return Promise.reject(err);
        // break;
        default:
            err.message = response.data.msg || response.data.message || "操作失败22";
            return Promise.reject(err);
        // break;
    }
    // 错误处理
}, error => {
    /**
     * 这里网络错误处理
     */
        // 按需求配置
    const err = {};
    if (!error.response) {
        err.message = error.message;
        return Promise.reject(err);
    }
    switch (error.response.status) {
        case 400:
            err.message = "错误请求";
            break;
        case 401:
            err.message = "未授权，请重新登录";
            break;
        case 403:
            err.message = "拒绝访问";
            break;
        case 404:
            err.message = "请求错误,未找到该资源";
            break;
        case 405:
            err.message = "请求方法未允许";
            break;
        case 408:
            err.message = "请求超时";
            break;
        case 500:
            err.message = "服务器出错";
            break;
        case 501:
            err.message = "网络未实现";
            break;
        case 502:
            err.message = "网络错误";
            break;
        case 503:
            err.message = "服务不可用";
            break;
        case 504:
            err.message = "网络超时";
            break;
        case 505:
            err.message = "http版本不支持该请求";
            break;
        default:
            err.message = `连接错误${error.response.status}`;
    }
    return Promise.reject(err);
});

service.defaults.baseURL = process.env.VUE_APP_API_PREFIX_URL; //
export function request(url, options, method = "GET", origin = false) {
    options = options || {};
    const {params, data, headers, responseType} = options;
    return new Promise(resolve => {
        service({
            method: method == 'postList' ? "post" : method,
            url,
            params: paramsFilter(params),
            data: method == 'postList' ? data : paramsFilter(data), // 改造，如果是post 且对象是list，就无须转对象
            headers,
            responseType
        })
            .then(res => {
                if (origin) {
                    resolve([null, res]);
                } else {
                    resolve([null, res.data]);
                }
                // handleSuccess(res.msg)
            })
            .catch(err => {

                let jt808url = process.env.VUE_APP_JT808_SERVER_URL
                let jt1078url = process.env.VUE_APP_JT1078_SERVER_URL
                // debugger
                if (err.message == 'Network Error' && (err.config.url.includes(jt1078url) || err.config.url.includes(jt808url))) {
                    console.log(err.config.url, "-Network Error-", err)
                    return
                } else {
                    handleError(err);
                }
                resolve([err]);
            });
    });
}