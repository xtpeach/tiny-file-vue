<template>
  <div class="zfile-office-viewer">
    <div id="office-body"></div>
  </div>
</template>

<script setup>
//  fileUrl:    文件下载路径
//  fileName:   文件名
let props = {
  fileUrl: String,
  fileName: String
};

onMounted(() => {
	// 加载基础信息
	loadGlobalSiteSetting();
});

import useStorageConfigStore from "~/stores/storage-config";
let storageConfigStore = useStorageConfigStore();

import { loadGlobalSiteConfigReq } from "~/api/home";
const loadGlobalSiteSetting = () => {
	loadGlobalSiteConfigReq().then((res) => {
		// 如果未安装, 则跳转到安装页
		if (!res.data.installed) {
			router.push('/install');
			return;
		}

		// 查询设置参数赋值
		storageConfigStore.updateGlobalConfig(res.data);

		let filePath = getQueryVariable("filePath");
		props.fileName = filePath.substr(filePath.lastIndexOf('/') + 1);

		// 加载 onlyOffice
		loadScript(`${storageConfigStore.globalConfig.onlyOfficeUrl}/web-apps/apps/api/documents/api.js`, () => {
			let index = props.fileName.lastIndexOf('.');
			let fileType = props.fileName.substr(index + 1);

			props.fileName = decodeURI(props.fileName);
			props.fileUrl = decodeURI(filePath);
			props.fileUrl = `${storageConfigStore.globalConfig.domain}/pd${props.fileUrl}`;

			filePath = decodeURI(filePath);

			console.log("props.fileUrl", props.fileUrl);

			const config = {
				"document": {
					"fileType": fileType,
					"title": props.fileName,
					"url": props.fileUrl,
					"lang": "zh-CN"
				},
				"width": '100%',
				"editorConfig": {
					"callbackUrl": `${storageConfigStore.globalConfig.domain}/api/onlyOffice/edit${filePath}`,
					"createUrl": null,
					"lang": "zh-CN",
					"mode": "edit",
					"recent": null,
					"user": {
						"id": "2797f3743a9e4ee080ecd8270b349c68",
						"name": "tiny-file"
					},
					"customization": {
						"autosave": true,
						"comment": false,
						"commentAuthorOnly": false,
						"compactToolbar": false,
						"feedback": false,
						"forcesave": false,
						"help": false,
						"review": false,
						"zoom": 0,
						"features": false
					},
					"permissions":{
						"chat": false
					},
					"embedded": {
						"embedUrl": null,
						"fullscreenUrl": null,
						"saveUrl": null,
						"shareUrl": null,
						"toolbarDocked": null
					},
					"plugins": null
				}
			};
			const docEditor = new DocsAPI.DocEditor("office-body", config);
		});

	}).catch((err) => {
		if (err.message === 'Network Error') {
			ElMessage.error('加载失败，无法连接到服务端，请联系管理员.');
		}
	})
}

function loadScript(src, callback) {
  let script = document.createElement('script'),
      head = document.getElementsByTagName('head')[0];
  script.type = 'text/javascript';
  script.charset = 'UTF-8';
  script.src = src;
  if (script.addEventListener) {
    script.addEventListener('load', function () {
      callback();
    }, false);
    script.addEventListener('error', function () {
      ElMessage.warning("调用在线文档服务失败，请检查在线文档服务是否正常");
    }, false);
  } else if (script.attachEvent) {
    script.attachEvent('onreadystatechange', function () {
      var target = window.event.srcElement;
      if (target.readyState === 'loaded') {
        callback();
      }
    });
  }
  head.appendChild(script);
}

// 获取 url 参数
function getQueryVariable(variable) {
	let query = window.location.search.substring(1);
	let vars = query.split("&");
	for (let i = 0; i < vars.length; i++) {
		let pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (false);
}
</script>

<style scoped>

.zfile-office-viewer, #office-body {
  height: 100%;
  width: 100%;
}
</style>
