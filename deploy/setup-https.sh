#!/bin/bash
# 为 markbot.shangbianai.com 配置 HTTPS（Let's Encrypt）
# 使用方式：在服务器上执行（需 root 或 sudo）
#   CERTBOT_EMAIL=your@email.com sudo -E ./setup-https.sh
# 或先导出邮箱：export CERTBOT_EMAIL=your@email.com

set -e

DOMAIN="markbot.shangbianai.com"
NGINX_CONF="/etc/nginx/conf.d/markbot-shangbianai.conf"

# Let's Encrypt 通知邮箱（必填，用于证书到期提醒）
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"
if [ -z "$CERTBOT_EMAIL" ]; then
  echo "请设置 CERTBOT_EMAIL 环境变量，例如："
  echo "  export CERTBOT_EMAIL=admin@shangbianai.com"
  echo "  sudo -E ./setup-https.sh"
  exit 1
fi

# 需 root 执行
if [ "$(id -u)" -ne 0 ]; then
  echo "请使用 root 或 sudo 执行此脚本"
  exit 1
fi

echo "=== 1. 检查 Nginx 配置 ==="
if [ ! -f "$NGINX_CONF" ]; then
  echo "未找到 $NGINX_CONF，请先部署 Nginx 配置（markbot-shangbianai.conf）"
  exit 1
fi
nginx -t || { echo "Nginx 配置有误"; exit 1; }
echo "Nginx 配置正常"

echo ""
echo "=== 2. 安装 certbot 与 nginx 插件 ==="
if command -v certbot &>/dev/null; then
  echo "certbot 已安装"
else
  apt-get update -qq
  apt-get install -y certbot python3-certbot-nginx
fi

echo ""
echo "=== 3. 申请并部署 Let's Encrypt 证书（$DOMAIN）==="
certbot --nginx \
  -d "$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "$CERTBOT_EMAIL" \
  --redirect

echo ""
echo "=== 4. 验证自动续期 ==="
(crontab -l 2>/dev/null | grep -q certbot) && echo "certbot 续期定时任务已存在" || true
systemctl list-timers 2>/dev/null | grep -i certbot || true

echo ""
echo "=== 完成 ==="
echo "证书已为 $DOMAIN 签发并已配置到 Nginx。"
echo "请访问 https://$DOMAIN 验证（HTTP 已自动重定向到 HTTPS）。"
