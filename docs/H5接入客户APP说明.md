# H5 页面接入客户 APP 说明

本 H5 为纯前端页面 + 同域 API，客户 APP 通过**加载该 H5 的访问地址**即可使用，无需改 H5 代码。推荐在 APP 内用 **WebView 内嵌** 打开。

---

## 一、H5 访问地址

| 环境     | 地址 |
|----------|------|
| **正式（推荐）** | `https://markbot.shangbianai.com` |
| 备用（IP 直连） | `http://182.92.97.169:8050` |

**说明**：页面与接口同域，接口 `/api/coze` 经 Nginx 代理到后端。客户 APP 的 WebView 直接加载 **`https://markbot.shangbianai.com`** 即可，无需单独配置 CORS。

---

## 二、接入方式（客户 APP 侧）

### 方式一：WebView 内嵌（推荐）

在客户 APP 内用系统 WebView 加载 H5 地址，用户不离开 APP 即可使用。

- **Android**：使用 `WebView` 加载 URL，建议开启 JavaScript、DOM 存储；若需与原生交互再配置 `JavascriptInterface` / `evaluateJavascript`。
- **iOS**：使用 `WKWebView` 加载 URL，需在「允许加载的域名」或 ATS 中放行该域名（若为 HTTPS）。

**要点**：

- 直接加载完整 H5 地址：**`https://markbot.shangbianai.com`**，不要用 file 协议或把页面拷到本地再加载。
- 保证 WebView 可访问外网；正式环境已使用 HTTPS，满足多数 APP 的 HTTPS 要求。

### 方式二：系统浏览器或内嵌浏览器打开

在 APP 内通过「在应用内打开浏览器」或「调起系统浏览器」打开上述 H5 地址。实现简单，但体验与 APP 一体化程度不如 WebView 内嵌。

### 方式三：仅前端页面在客户域名、接口跨域

若客户希望 H5 部署在其自身域名下（如 `https://app.客户.com/ai-tools`），则会出现**跨域**：页面在客户域，请求发到本服务 `/api/coze`。此时需在本项目**后端**的 `CORS_ORIGIN` 中增加客户前端域名（含协议），例如：

```env
# backend/.env
CORS_ORIGIN=https://markbot.shangbianai.com,https://app.客户.com
```

同时需在前端配置 API 基础地址指向本服务（例如通过构建时的环境变量或配置项），否则前端仍会请求当前页面的 `/api/coze` 导致 404。  
**常规推荐**：仍采用方式一，在 APP 内 WebView 直接打开本服务提供的 H5 地址，无需跨域与改前端。

---

## 三、HTTPS

正式环境已配置域名 **https://markbot.shangbianai.com**（HTTPS），客户 APP 可直接使用该地址，满足对 HTTPS 的要求。证书与 Nginx 配置参见 [DEPLOY.md](../DEPLOY.md) 与 [deploy/HTTPS-排查与方案.md](../deploy/HTTPS-排查与方案.md)。

---

## 四、简要检查清单（给客户）

| 项           | 说明 |
|--------------|------|
| H5 地址       | 使用正式地址 **`https://markbot.shangbianai.com`**。 |
| 网络          | APP/WebView 能访问该地址（公司网络、VPN、防火墙放行）。 |
| WebView 设置  | 已开启 JavaScript；若为 iOS，已放行对应域名。 |
| HTTPS 要求   | 若 APP 强制 HTTPS，需先为 H5 配置 HTTPS 再接入。 |

---

## 五、技术说明（可选阅读）

- **前端**：静态页面（`index.html` + `app.js`），通过相对路径 `/api/coze` 调用接口，与当前站点同域。
- **后端**：提供 `/api/coze/workflow/execute` 等接口，由 Nginx 在 8050 上反向代理到后端服务。
- **在 WebView 中加载本 H5 地址时**：页面和请求均来自同一域名（本服务），不涉及跨域，无需额外 CORS 配置；仅当 H5 部署在客户域名且请求本服务接口时，才需在后端配置 `CORS_ORIGIN`。

如有客户具体技术栈（如 Android WebView / iOS WKWebView / 小程序 web-view）或域名/HTTPS 方案，可在此基础上补充对应示例代码或配置说明。
