<template>
  <div class="zfile-office-viewer">
    <div id="office-body"></div>
  </div>
</template>

<script setup>
import useStorageConfigStore from "~/stores/storage-config";
let storageConfigStore = useStorageConfigStore();

// 组件接收的属性：
//  fileUrl:    文件下载路径
//  fileName:   文件名
const props = defineProps({
  fileUrl: String,
  fileName: String
});

onMounted(() => {
  loadScript(`${storageConfigStore.globalConfig.onlyOfficeUrl}/web-apps/apps/api/documents/api.js`, () => {
    const index = props.fileName.lastIndexOf('.');
    const fileType = props.fileName.substr(index + 1);
    let filePath = props.fileUrl.substr(0, props.fileUrl.lastIndexOf('/'));
    console.log("filePath", props.fileUrl);
		filePath = filePath.replace('/pd', '/api/onlyOffice/edit') + `/${props.fileName}`;
		console.log("filePath-re", filePath);
    const config = {
      "document": {
        "fileType": fileType,
        "title": props.fileName,
        "url": props.fileUrl,
        "lang": "zh-CN"
      },
      "width": '100%',
      "editorConfig": {
				"callbackUrl": filePath,
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
  })
})


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
</script>

<style scoped>

.zfile-office-viewer, #office-body {
  height: 100%;
  width: 100%;
}
</style>
