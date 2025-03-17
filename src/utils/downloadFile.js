import { saveAs } from 'file-saver';
import http from './request';

/**
 * 下载文件
 * @param {string} url - 下载文件的 URL
 * @param {string} fileName - 保存的文件名
 */
export const downloadFile = async (url, fileName) => {
    try {
        const response = await http.get(url, {
            responseType: 'blob', // 确保响应类型为 blob
        });

        // 从响应头中获取文件名
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition && contentDisposition.includes('filename=')) {
            fileName = decodeURIComponent(
                contentDisposition
                    .split('filename=')[1]
                    .split(';')[0]
                    .replace(/['"]/g, '') // 去除可能的引号
            );
        }

        // 创建 Blob 对象
        const blob = new Blob([response.data], {
            type: response.headers['content-type'], // 使用响应头中的 MIME 类型
        });

        // 保存文件
        saveAs(blob, fileName);
        console.log("文件下载成功:", fileName);
        alert("文件下载成功！");
    } catch (error) {
        console.error("文件下载失败:", error);
        throw error;
    }
};