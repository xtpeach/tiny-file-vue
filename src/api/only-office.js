import axios from "~/http/request"


// 缓存正在编辑的office文件
export const cacheEditingFile = (data) => {
	return axios({
		url: `/api/onlyOffice/edit/cache/${data.storageKey}${data.path}/${data.fileName}`,
		method: "post",
		data,
		config: {
			showDefaultMsg: false
		}
	})
}
