import {Message} from "element-ui";
import {request} from "./axios";

// eslint-disable-next-line no-unused-vars
function isObject(obj) {
    return obj !== null && typeof obj === "object";
}

// 序列化 params
export function param(data) {
    let url = "";
    if (data) {
        for (const k of Object.keys(data)) {
            const value = data[k] !== undefined ? data[k] : "";
            url += `&${k}=${encodeURIComponent(value)}`;
        }
    }
    return url ? url.substring(1) : "";
}

// 参数转换为 formData
export function paramsToFormData(params) {
    const formData = new FormData();
    for (const k in params) {
        if (params[k] !== undefined) {
            formData.append(k, params[k]);
        }
    }
    return formData;
}

// 参数过滤 去掉第一层的undefined 和 空值 不要递归
export const paramsFilter = params => {
    const query = {};
    for (const k in params) {
        if (params[k] !== undefined || params[k] !== null) {
            // if (isObject(params[k])) {
            //   query[k] = paramsFilter(params[k])
            // } else {
            //   query[k] = params[k]
            // }
            query[k] = params[k];
        }
    }
    return query;
};

let errCount = 0;
// 请求失败处理
export const handleError = err => {
    console.log("handleError00000000", err)
    if (!err.message) return; // 重复请求
    if (err.message === "timeout of 10000ms exceeded") {
        err.message = "请求超时，请检测网络或者联系管理员";
    } else if (err.message === "Network Error") {
        err.message = "网络错误，请检查您的网络";
    } else {
        // err.message = "系统繁忙，请稍后再试";
    }
    if (errCount > 0) return;
    errCount += 1;
    Message({
        showClose: true,
        message: err.message,
        type: "error",
        onClose() {
            errCount -= 1;
        }
    });
};
// 操作成功处理
export const handleSuccess = message => {
    if (!message) return; // 有成功消息
    Message({
        showClose: true,
        message,
        type: "success"
    });
};

export {request} from "./axios";

export class RestfulApi {
    constructor(url) {
        this.url = url;
    }

    _getPath(query = {}) {
        let str = Object.values(query).join("/");
        str = str ? "/" + str : "";
        return `${this.url}${str}`;
    }

    get(path, {query, ...args} = {}) {
        return request(`${this._getPath(query)}/${path}`, {...args}, "get");
    }

    post(path, {query, ...args} = {}) {
        return request(`${this._getPath(query)}/${path}`, {...args}, "post");
    }

    postList(path, {query, ...args} = {}) {
        return request(`${this._getPath(query)}/${path}`, {...args}, "postList");
    }

    // put({ query, ...args }) {
    //   return request(`${this._getPath(query)}`, { ...args }, 'post')
    // }

    // delete({ query, ...args }) {
    //   return request(`${this._getPath(query)}`, { ...args }, 'post')
    // }

    // 兼容
    add({query, ...args} = {}) {
        return request(`${this._getPath(query)}/add`, {...args}, "post");
    }

    delete({query, ...args} = {}) {
        return request(`${this._getPath(query)}/delete`, {...args}, "get");
    }

    statistics({query, ...args} = {}) {
        return request(`${this._getPath(query)}/statistics`, {...args}, "get");
    }
    statisticsPost({query, ...args} = {}) {
        return request(`${this._getPath(query)}/statistics`, {...args}, "post");
    }

    detail({query, ...args} = {}) {
        return request(`${this._getPath(query)}/detail`, {...args}, "get");
    }

    types({query, ...args} = {}) {
        return request(`${this._getPath(query)}/types`, {...args}, "get");
    }

    list({query, ...args} = {}) {
        return request(`${this._getPath(query)}/list`, {...args}, "post");
    }

    update({query, ...args} = {}) {
        return request(`${this._getPath(query)}/update`, {...args}, "post");
    }

    status({query, ...args} = {}) {
        return request(`${this._getPath(query)}/status`, {...args}, "post");
    }

    authStatus({query, ...args} = {}) {
        return request(`${this._getPath(query)}/authStatus`, {...args}, "post");
    }
}
