# API服务:

| 请求地址 | HTTP方法 | 说明 |
| --- | --- | --- |
| `/api/v1/news?page=1` | *GET* | 获取新闻列表 |
| `/api/v1/news/{id}` | *GET* | 获取新闻详情 |

### Create a new swagger project

```
$ swagger project create hello-world
```

#### Design your API in the Swagger Editor

```
$ swagger project edit
```

### Write controller code in Node.js

```
function hello(req, res) {
    var name = req.swagger.params.name.value || 'stranger';
    var hello = util.format('Hello, %s', name);
    res.json(hello);
}
```

###  Run the server

```
swagger project start
```

### Now, call the API!