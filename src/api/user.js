
import http from '../utils/request'

export const listViewOnGoingList = (data) => {
    return http.get('/user/task/page', {
        params: data,
    })
}


export const queryTheEntrustmentDetailsByEntrustmentNumber = (id) => {
    return http.get('/user/task/' + id)
}

export const acceptCommission = (data) => {
    console.log("接收委托留言");
    return http.post('/user/Accept', data)
}