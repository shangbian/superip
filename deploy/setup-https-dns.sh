#!/bin/bash
# markbot.shangbianai.com 使用 DNS-01 申请 Let's Encrypt 证书并配置 Nginx HTTPS
# 使用方式：在服务器上交互执行（需 root），按提示在阿里云 DNS 添加 TXT 记录后回车继续
#   CERTBOT_EMAIL=your@email.com sudo -E ./setup-https-dns.sh

set -e

DOMAIN="markbot.shangbianai.com"
NGINX_CONF="/etc/nginx/conf.d/markbot-shangbianai.conf"
CERT_ROOT="/etc/letsencrypt/live/${DOMAIN}"

CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"
if [ -z "$CERTBOT_EMAIL" ]; then
  echo "请设置 CERTBOT_EMAIL，例如：export CERTBOT_EMAIL=admin@shangbianai.com"
  exit 1
fi

if [ "$(id -u)" -ne 0 ]; then
  echo "请使用 root 或 sudo 执行此脚本"
  exit 1
fi

echo "=== 1. 使用 DNS-01 申请证书（需在阿里云 DNS 添加 TXT 记录）==="
echo "按 certbot 提示操作："
echo "  1) 在阿里云 云解析 DNS 中，为域名 shangbianai.com 添加记录："
echo "     记录类型: TXT"
echo "     主机记录: _acme-challenge.markbot"
echo "     记录值: （certbot 会显示一串随机值，复制粘贴即可）"
echo "  2) 保存后等待约 1 分钟，回到终端按回车继续"
echo ""

certbot certonly \
  --manual \
  --preferred-challenges dns \
  -d "$DOMAIN" \
  --agree-tos \
  --email "$CERTBOT_EMAIL" \
  --no-eff-email

if [ ! -f "${CERT_ROOT}/fullchain.pem" ] || [ ! -f "${CERT_ROOT}/privkey.pem" ]; then
  echo "证书未成功签发，请检查上述步骤后重试"
  exit 1
fi

echo ""
echo "=== 2. 配置 Nginx 启用 HTTPS ==="
BACKUP="${NGINX_CONF}.bak.$(date +%Y%m%d%H%M%S)"
cp -a "$NGINX_CONF" "$BACKUP"

cat > "$NGINX_CONF" << 'NGINX_SSL_EOF'
# markbot.shangbianai.com -> 放羊哥综合营销智能体（HTTP + HTTPS）
# 证书由 certbot DNS-01 签发，续期后执行: nginx -t && systemctl reload nginx

server {
    listen 80;
    server_name markbot.shangbianai.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name markbot.shangbianai.com;
    root /opt/superip/frontend;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/markbot.shangbianai.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/markbot.shangbianai.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3050;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }
}
NGINX_SSL_EOF

nginx -t || { echo "Nginx 配置错误，已恢复备份"; cp -a "$BACKUP" "$NGINX_CONF"; exit 1; }
systemctl reload nginx

echo ""
echo "=== 完成 ==="
echo "证书已签发并已配置到 Nginx。"
echo "请访问 https://${DOMAIN} 验证。"
echo "续期：证书约 90 天有效，到期前在服务器执行："
echo "  certbot renew --manual --preferred-challenges dns"
echo "  然后 nginx -t && systemctl reload nginx"
