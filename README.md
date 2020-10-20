# package-version-update
模块包发布版本自动更新

## 第一步
```javascript
npm install package-version-update -g
```
## 第二步
在package.json文件添加：
```javascript
"scripts": {
  "prepublish": "version update", // 发布前先更新版本
},
```
## 第三步
在项目目录中运行
```bash
npm publish
```
