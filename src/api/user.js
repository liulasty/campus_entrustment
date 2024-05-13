
import { data } from 'jquery'
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
    return http.post('/user/accept', data)
}


export const publishDelegationList = (data) => {
    return http.get('/user/publisher/page', {
        params: data,
    })
}
export const getTaskAcceptById = (id) => {
    return http.get('/user/accept/' + id)
}


export const acceptDelegationList = (data) => {
    return http.get('/user/accept/page', {
        params: data,
    })
}

export const cancelAcceptorByAcceptor = (id) => {
    return http.put('/user/accept/cancel/' + id)
}


export const confirmTheRecipient = (id) => {
    return http.put('/user/publisher/confirm/' + id)
}
