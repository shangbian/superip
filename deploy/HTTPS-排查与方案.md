# markbot.shangbianai.com HTTPS 申请失败：原因与解决方案

## 一、原因分析

### 1. 现象

执行 `setup-https.sh`（certbot --nginx）时，Let's Encrypt 校验失败：

```
Domain: markbot.shangbianai.com
Type:   unauthorized
Detail: 113.56.145.141: Invalid response from https://webblock.volcengine.com: 404
```

### 2. 排查结果

| 检查项 | 结果 |
|--------|------|
| **DNS 解析** | markbot.shangbianai.com → 115.190.64.160 ✓ |
| **公网访问 http://markbot.shangbianai.com** | 返回 **302**，Location: **https://webblock.volcengine.com**，Server: **Suzaku** |
| **服务器本机 curl 127.0.0.1:80** | 返回 **200 OK**，Server: **nginx/1.24.0** ✓ |

### 3. 结论

- **公网访问 80 端口的流量在到达服务器 Nginx 之前，被火山引擎的 Suzaku 层拦截**，并 302 重定向到 `https://webblock.volcengine.com`。
- Let's Encrypt 使用 **HTTP-01** 校验时，会请求 `http://markbot.shangbianai.com/.well-known/acme-challenge/xxx`，只能收到上述 302，拿不到 Nginx 上的校验内容，因此校验失败。
- 服务器本机 Nginx 配置与 80 端口正常，问题出在**机房/云平台侧对 80 端口的拦截或重定向**（常见于未备案域名或 WAF/网关策略）。

---

## 二、解决方案

### 方案一：在火山引擎控制台放行 80 或关闭 302（推荐，若可操作）

1. 登录 [火山引擎控制台](https://console.volcengine.com/)。
2. 找到与 **115.190.64.160** 相关的资源：
   - **负载均衡 / 七层转发**：查看是否有 HTTP(80) 监听器将流量 302 到 webblock。
   - **Web 应用防火墙 (WAF)**：查看是否对未备案/HTTP 域名做了“跳转至 webblock”等策略。
   - **Suzaku / 安全 / 网关类产品**：查看是否有“未备案跳转”“HTTP 强跳”等，对 markbot.shangbianai.com 或 80 端口放行或关闭该策略。
3. 使 **公网访问 http://markbot.shangbianai.com 直接到达 ECS 上的 Nginx**（返回 200，且不再 302 到 webblock）。
4. 在服务器上重新执行：
   ```bash
   export CERTBOT_EMAIL=your@email.com
   sudo -E /tmp/setup-https.sh
   ```

### 方案二：使用 DNS-01 校验（不依赖 80 端口）

不经过 80 端口，由 Let's Encrypt 通过 **DNS TXT 记录** 校验域名所有权，证书签发后再在 Nginx 中配置 HTTPS。

- **优点**：不依赖 80 端口，不受 Suzaku/302 影响；可申请通配符证书。
- **缺点**：需在阿里云 DNS 添加一次 TXT 记录（手动或使用阿里云 API 自动）。

项目内已提供 **DNS-01 申请与 Nginx 配置** 脚本，见下方「三、实施步骤」。

---

## 三、实施步骤（方案二：DNS-01）

### 3.1 阿里云 DNS 添加 TXT 记录（必读）

- 登录 [阿里云控制台](https://dns.console.aliyun.com/) → 云解析 DNS → 找到 **shangbianai.com**。
- 点击「添加记录」：
  - **记录类型**：TXT  
  - **主机记录**：`_acme-challenge.markbot`（不要带 `.shangbianai.com`，只填前半段）  
  - **记录值**：certbot 终端里显示的那一串（每次申请不同，以终端为准）  
  - **TTL**：600 或默认  
- 保存后等待约 1～2 分钟再在 certbot 里按回车，避免 NXDOMAIN。

### 3.2 在服务器上执行（推荐本机 SSH 交互执行）

**方式 A：交互执行（推荐）**

1. 本机 SSH 登录服务器：`ssh 世恒光火山服务器`
2. 执行：
   ```bash
   export CERTBOT_EMAIL=admin@shangbianai.com
   sudo -E /tmp/setup-https-dns.sh
   ```
3. certbot 会输出「记录值」；**立即**到阿里云按 3.1 添加 TXT，保存后等 1～2 分钟。
4. 回到终端按 **回车**，等待签发。
5. 签发成功后，脚本会自动配置 Nginx 并重载；访问 `https://markbot.shangbianai.com` 验证。

**方式 B：自动等待 3 分钟**

1. 执行：`export CERTBOT_EMAIL=admin@shangbianai.com && sudo -E /tmp/certbot-dns-expect.sh`
2. 脚本会打印「记录值」并等待 3 分钟；**在此 3 分钟内**到阿里云按 3.1 添加该 TXT 并保存。
3. 3 分钟后脚本自动按回车完成校验；若仍报 NXDOMAIN，请检查主机记录是否为 `_acme-challenge.markbot` 且记录值一致，并稍等 DNS 生效后重试。

### 3.3 证书已签发、仅配置 Nginx 时

若证书已通过其他方式签发，只需启用 HTTPS：

```bash
sudo /tmp/configure-nginx-ssl.sh
```

### 3.4 验证与续期

- **验证**：访问 `https://markbot.shangbianai.com`，应返回 200，证书校验通过。
- **续期**：证书约 90 天有效，到期前在服务器执行：
  ```bash
  sudo certbot renew --manual --preferred-challenges dns
  sudo nginx -t && sudo systemctl reload nginx
  ```
  续期时同样会提示添加 TXT，按 3.1 在阿里云添加后回车即可。
