#!/bin/bash
# 在证书已签发的条件下，为 markbot.shangbianai.com 配置 Nginx HTTPS
# 使用：sudo ./configure-nginx-ssl.sh

set -e

DOMAIN="markbot.shangbianai.com"
NGINX_CONF="/etc/nginx/conf.d/markbot-shangbianai.conf"
CERT_ROOT="/etc/letsencrypt/live/${DOMAIN}"

if [ "$(id -u)" -ne 0 ]; then
  echo "请使用 root 或 sudo 执行"
  exit 1
fi

if [ ! -f "${CERT_ROOT}/fullchain.pem" ] || [ ! -f "${CERT_ROOT}/privkey.pem" ]; then
  echo "未找到证书，请先完成 DNS-01 申请：sudo -E ./setup-https-dns.sh 或 certbot certonly --manual --preferred-challenges dns -d ${DOMAIN}"
  exit 1
fi

BACKUP="${NGINX_CONF}.bak.$(date +%Y%m%d%H%M%S)"
cp -a "$NGINX_CONF" "$BACKUP"

cat > "$NGINX_CONF" << 'NGINX_SSL_EOF'
# markbot.shangbianai.com -> 放羊哥综合营销智能体（HTTP + HTTPS）
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
echo "Nginx 已启用 HTTPS，请访问 https://markbot.shangbianai.com 验证。"
