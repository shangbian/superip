#!/usr/bin/expect -f
# 自动执行 certbot DNS-01：显示 TXT 值后等待 180 秒再自动按回车（请在此时间内到阿里云添加 TXT）
# 使用：CERTBOT_EMAIL=your@email.com sudo -E ./certbot-dns-expect.sh

set timeout 120
set email $env(CERTBOT_EMAIL)
if {$email == ""} {
    puts "请设置 CERTBOT_EMAIL"
    exit 1
}

spawn certbot certonly --manual --preferred-challenges dns -d markbot.shangbianai.com --agree-tos --email $email --no-eff-email

expect {
    "with the following value:" {
        expect "\n"
        expect -re "(.+)\n"
        set txt [string trim $expect_out(1,string)]
        send_user "\n===== 请在 3 分钟内在阿里云 DNS 添加以下 TXT 记录 =====\n"
        send_user "主机记录: _acme-challenge.markbot\n"
        send_user "记录类型: TXT\n"
        send_user "记录值: $txt\n"
        send_user "========================================================\n\n"
        send_user "等待 180 秒，请在此时间内到阿里云 DNS 添加上述 TXT 记录…\n"
        after 180000
        send "\r"
        exp_continue
    }
    "Congratulations" {
        send_user "\n证书签发成功\n"
    }
    "Certificate not yet due for renewal" {
        send_user "\n证书仍在有效期内\n"
    }
    eof
}

expect eof
