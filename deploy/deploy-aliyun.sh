#!/bin/bash
# 放羊哥综合营销智能体 - 一键部署到阿里云
# 在本机（Mac）项目根目录执行：./deploy/deploy-aliyun.sh
# 项目根目录：多智能体（含 frontend/、backend/、deploy/）

set -e

# 服务器配置（~/.ssh/config 中 Host aliyun -> 182.92.97.169）
SSH_TARGET="${SSH_TARGET:-aliyun}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_DIR="/opt/superip"
FRONTEND_LOCAL="./frontend"
BACKEND_LOCAL="./backend"
NGINX_CONF_LOCAL="./deploy/superip-8050.conf"
# 复用 SSH 连接，未配置免密时只需输入一次密码
CPATH="/tmp/superip-deploy-$$"
SSH_OPTS="-o ControlMaster=auto -o ControlPath=$CPATH -o ControlPersist=120"
ssh_cmd() { ssh $SSH_OPTS "$REMOTE_USER@$SSH_TARGET" "$@"; }
scp_cmd() { scp $SSH_OPTS "$@"; }
rsync_cmd() { rsync -avz -e "ssh $SSH_OPTS" "$@"; }
cleanup() { ssh -O exit -o ControlPath=$CPATH "$REMOTE_USER@$SSH_TARGET" 2>/dev/null || true; }
trap cleanup EXIT

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
log_info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 检查在项目根目录
if [ ! -d "$FRONTEND_LOCAL" ] || [ ! -d "$BACKEND_LOCAL" ]; then
  log_error "请在项目根目录（多智能体）下执行，且确保存在 frontend/ 和 backend/ 目录"
  exit 1
fi

if [ ! -f "$NGINX_CONF_LOCAL" ]; then
  log_error "未找到 Nginx 配置: $NGINX_CONF_LOCAL"
  exit 1
fi

log_info "连接服务器（未配置免密时请在此输入一次密码）: $SSH_TARGET ..."
ssh $SSH_OPTS -o ConnectTimeout=15 "$REMOTE_USER@$SSH_TARGET" "echo ok" || {
  log_error "无法连接，请检查网络或使用: ssh $REMOTE_USER@$SSH_TARGET"
  exit 1
}

log_info "创建远程目录 ..."
ssh_cmd "mkdir -p $REMOTE_DIR/frontend $REMOTE_DIR/backend"

log_info "同步前端到 $REMOTE_DIR/frontend ..."
rsync_cmd --delete \
  --exclude 'node_modules' --exclude '.git' \
  "$FRONTEND_LOCAL/" "$REMOTE_USER@$SSH_TARGET:$REMOTE_DIR/frontend/"

log_info "同步后端到 $REMOTE_DIR/backend ..."
rsync_cmd --delete \
  --exclude 'node_modules' --exclude '.git' --exclude '.env' \
  "$BACKEND_LOCAL/" "$REMOTE_USER@$SSH_TARGET:$REMOTE_DIR/backend/"

log_info "上传 Nginx 配置 ..."
scp_cmd "$NGINX_CONF_LOCAL" "$REMOTE_USER@$SSH_TARGET:/etc/nginx/conf.d/superip-8050.conf"

log_info "在服务器上安装依赖、构建并启动后端（PM2）..."
ssh_cmd bash -s "$REMOTE_DIR" << 'REMOTE_SCRIPT'
set -e
REMOTE_DIR="$1"
cd "$REMOTE_DIR/backend"

# 若不存在 .env，从 .env.example 复制并提示
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "[WARN] 已从 .env.example 生成 .env，请登录服务器编辑 /opt/superip/backend/.env 填写 COZE_TOKEN、COZE_WORKFLOW_ID 等"
  else
    echo "[WARN] 未找到 .env 和 .env.example，请手动创建 .env"
  fi
fi

npm install --production=false
npm run build 2>/dev/null || true

# PM2：先停再启，保证端口 3050
export PORT=3050
pm2 delete superip-backend 2>/dev/null || true
if [ -f dist/server.js ]; then
  pm2 start dist/server.js --name superip-backend
else
  pm2 start server.js --name superip-backend
fi
pm2 save
REMOTE_SCRIPT

log_info "重载 Nginx ..."
ssh_cmd "nginx -t && systemctl reload nginx || service nginx reload"

log_info "检查端口与进程 ..."
ssh_cmd "ss -tlnp | grep -E '8050|3050' || true; pm2 list | grep superip || true"

echo ""
log_info "部署完成。"
log_info "前端（静态）: http://182.92.97.169:8050"
log_info "API 代理:     http://182.92.97.169:8050/api/ -> 127.0.0.1:3050"
log_info "后端进程:     pm2 list -> superip-backend"
