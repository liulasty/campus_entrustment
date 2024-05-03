
import http from '../utils/request'

// import aliyun from '../utils/ailiyun.js'

export const getData = (id) => {
    console.log("获取最新委托");
    return http.get('/task/getNewTask/' + id)
}

export const userList = (data) => {
    console.log("获取委托列表");
    return http.post('/user/page', data)
}

export const adminActivation = (id) => {
    console.log("辅助激活用户");
    return http.put('/user/adminActivation/' + id)
}


export const deleteAccounts = (data) => {
    if (!Array.isArray(data)) {
        data = [data];
    }


    console.log(data.length === 1 ? "删除单个用户" : "批量删除用户", data);

    if (data.length === 0) {
        throw new Error("Empty input. Expected at least one userId.");
    }

    return http.post('/user/deleteUser', data);
}


export const getTaskList = (data) => {
    console.log("获取委托列表");
    return http.post('/task/page', data)
}

export const getTaskCategories = (id) => {
    console.log("获取委托的分类类别");
    return http.get('/task/getTaskCategory')
}

export const addTaskDraft = (data) => {
    console.log("添加用户草稿")
    return http.post('/task/addTaskDraft', data)
}

export const getTaskDraftById = (id) => {
    console.log("用户获取委托草稿");
    return http.get('/task/getUserDelegateDraft/' + id)
}

export const getDraftDetailsBasedOnCommissionId = (id) => {
    console.log("根据委托id获取委托草稿详情");
    return http.get('/task/getTask/' + id)
}

export const updateTaskDraft = (data) => {
    console.log("更新委托草稿");
    return http.post('/task/updateTaskDraft', data)
}

export const deleteTaskDraft = (id) => {
    console.log("删除委托草稿");
    return http.delete('/task/deleteTaskDraft/' + id)
}

export const submitTaskDraft = (id) => {
    console.log("提交委托草稿");
    return http.put('/task/auditTask/' + id)
}

export const confirmTask = (id) => {
    console.log("获取需要发布的委托");
    return http.get('/task/confirmTask/' + id)
}

export const publishingDelegation = (data) => {
    console.log("发布委托");
    return http.put('/user/publisher/confirmTask/' + data.id, data)
}


export const getReason = (id) => {
    console.log("获取审核不通过的原因");
    return http.get('/task/getReason/' + id)
}

export const getUserInfo = (id) => {
    // console.log("获取用户信息");
    return http.get('/userInfo/' + id)
}

export const uploadImg = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return http.post('/img/upload', formData)
}

export const submitCertificationInformation = (data) => {
    console.log("提交认证信息");
    return http.post('/userInfo', data)
}




export const confirmToPassTheReview = (id) => {
    console.log("确认通过审核");
    return http.put('/userInfo/confirmToPassTheReview/' + id)
}


export const refuseToPassReview = (id) => {
    console.log("拒绝通过审核");
    return http.put('/userInfo/refuseToPassReview/' + id)
}

export const getUserList = (listSelectCondition) => {
    // console.log("查询参数", listSelectCondition);
    return http.get('/user/page', {
        params: listSelectCondition,
    })
}
// 查询存储委托信息记录列表
export function listDelegateRecords(query) {
    console.log("查询存储委托信息记录列表:");
    return http.get('/admin/task/list', {
        params: query
    })
}

export function getDelegateByTaskID(TaskID) {
    return http.get('/admin/task/' + TaskID)
}

// 查询存储委托信息审核记录详细
export function getDelegateauditrecords(RecordID) {
    return http.get('/delegateauditrecords/' + RecordID)
}

// 新增存储委托信息审核记录
export function addDelegateauditrecords(data) {
    return http.post('/delegateauditrecords', data)

}

// 修改存储委托信息审核记录
export function updateDelegateauditrecords(data) {
    return http.put('/delegateauditrecords', data)
}

// 删除存储委托信息审核记录
export function delDelegateauditrecords(RecordID) {
    return http.delete('/delegateauditrecords/' + RecordID)
}


export const deleteCertificationRecords = (id) => {
    // console.log("删除认证记录");
    return http.delete('/userInfo/' + id)
}

export const deleteAuthenticationInformation = (id) => {
    // console.log("删除认证信息");
    return http.delete('/userInfo/' + id)
}

// 
export const cancelUserInfoAuthentication = (id) => {
    // console.log("取消认证");
    return http.put('/userInfo/cancelUserInfoAuthentication/' + id)
}

export const delDelegate = (id) => {
    // console.log("管理员删除委托信息");
    return http.delete('/admin/task/' + id)
}


export const FallbackDraft = (id) => {
    console.log("管理员回退草稿");
    return http.put('/admin/task/getFallbackDraft/' + id)
}


export const allowPublish = (id) => {
    console.log("管理员允许发布");
    return http.put('/admin/task/allowPublish/' + id)
}

export const notAllowed = (id) => {
    console.log("管理员拒绝发布");
    return http.put('/admin/task/notAllowed/' + id)
}


export const uploadAvatar = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return http.post('/img/uploadAvatar', formData);
};

export const updateImg = (formData) => {
    return http.post('/img/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },// 设置请求头为multipart/form-data类型
    })
}

export const updateEvent = (eventId, event) => {
    return http.put("/event/" + eventId, event)
}

export const deleteImg = (deleteImg) => {
    return http.delete('/img/delete', { data: deleteImg })
}

export const deleteEvent = (deleteEventId) => {
    console.log("删除的事件编号", deleteEventId);
    return http.delete('/event/' + deleteEventId)
}

export const getEventImg = (eventId) => {
    return http.get('/img/getEventImg/' + eventId)
}

export const addEvent = (eventList) => {
    return http.post('/event/EventList', eventList)
}

export const selectEventById = (id) => {
    return http.get('/event/' + id)
}


export const list = (listSelectCondition) => {
    console.log("查询参数", listSelectCondition);
    return http.get('/event/page', {
        params: listSelectCondition,
    })
}

export const login = (userInfo) => {
    console.log("登录参数", userInfo)
    return http.post('/user/login', userInfo)
}

export const logout = () => {
    console.log("退出");
    return http.delete('user/logout')
}


export const register = (userInfo) => {
    console.log("注册参数", userInfo)
    return http.post('/user/register', userInfo)
}

export const deleteUser = (id) => {
    console.log("删除", id)
    return http.delete('/user/' + id)
}



export const athleteAdd = (athlete) => {
    console.log("athleteAdd参数", athlete);
    return http.post('/athlete', athlete)
}

export const getAthleteApply = (id) => {
    console.log("获取运动员申请记录", id);
    return http.get('/athlete/apply/' + id)
}

export const getAthlete = (id) => {
    console.log("获取运动员详细信息", id);
    return http.get('/athlete/' + id)
}

export const updateAthlete = (data) => {
    console.log("修改运动员信息,运动员信息", data)
    return http.put('/athlete/' + data.athleteId, data)
}

export const examineSports = (id) => {
    console.log("运动员审核通过", id);
    return http.get('/user/athlete/' + id)
}

export const refusePlayer = (id) => {
    console.log("运动员审核不通过", id);
    return http.delete('/user/athlete/' + id)
}



export const DeleteRecord = (id) => {
    console.log("删除运动员申请记录", id)
    return http.delete("/athlete/" + id)
}


export const projectList = (listSelectCondition) => {
    console.log("查询参数", listSelectCondition);
    return http.get('/project/page', {
        params: listSelectCondition,
    })
}

export const eventTypes = () => {
    console.log("活动类型")
    return http.get("/event/eventType")
}

export const addProject = (projectList) => {
    console.log("添加项目")
    return http.post('/project', projectList)
}

export const selectProject = (id) => {
    console.log("根据编号查询项目")
    return http.get('/project/' + id)
}

export const editProject = (data) => {
    console.log("编辑项目")
    return http.put('/project/' + data.id, data)
}


export const deleteProject = (id) => {
    console.log("删除项目")
    return http.delete("/project/" + id)
}

export const joinProject = (data) => {
    console.log("运动员参加项目")
    return http.post("/project/join", data)
}

export const refuseProject = (id) => {
    console.log("拒绝该运动员参加该项目")
    return http.put("/registration/refuse/" + id)
}

export const selectApply = (id) => {
    console.log("查询运动员申请参赛记录", id)
    return http.get("/registration/" + id)
}

export const RegistrationList = (data) => {
    console.log("参赛记录搜索", data)

    if (data.date != "") {
        let dateString = data.date;
        let date = new Date(dateString);
        date.setHours(date.getHours() + 8);

        const data1 = {
            name: data.name,
            status: data.status,
            date: date,
            currentPage: 1,
            pageSize: 5,
        }

        return http.get("/registration/page", {
            params: data1,
        })
    }


    return http.get("/registration/page", {
        params: data,
    })
}

export const getAthleteRegistrationTotal = (id) => {
    console.log("查询运动员申请参赛记录总数,运动员编号", id)
    return http.get("/registration/athlete/" + id)
}

export const deleteRegistration = (id) => {
    console.log("删除参赛记录")
    return http.delete("/registration/" + id)
}

export const attendProject = (id) => {
    console.log("同意参加项目", id)
    return http.put("/registration/" + id)
}




// export const loadImageAsBase64 =(url) =>{
//     return aliyun.get(url)
// }