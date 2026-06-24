---
title: '别删机：Oracle 免费小鸡重装系统生存手册'
description: 'Oracle 免费小鸡重装系统生存手册，教你如何在不删除实例的情况下重装系统盘，避免失去免费实例名额。'
date: 2026-06-23
---

# 别删机：Oracle 免费小鸡重装系统生存手册

Oracle Cloud 的免费机器有个特点：创建的时候像抽奖，删掉以后像失忆。尤其是免费实例，手一滑点了 `Terminate`，再想抢回来就开始和容量池斗智斗勇。

所以这篇只讲一个目标：**不删除实例，给系统盘重装系统**。

## 一句话结论

不要删实例，不要点 `Terminate`。

正确姿势是：

```text
More Actions -> Replace Boot Volume
```

也就是 **替换引导卷**。

这个操作会替换系统盘，但保留实例本身。你的免费机器名额不会因为删除实例而释放掉。

## 先认清三个 OCID

OCI 页面上到处都是 OCID，看起来都像一串密文。填错了就会被控制台无情拒绝。

```text
实例 OCID：ocid1.instance...
镜像 OCID：ocid1.image...
启动卷 OCID：ocid1.bootvolume...
```

重装系统时，如果你选的是通过镜像重装，那么输入框要填的是：

```text
ocid1.image...
```

不是实例详情页最上面的那个 `ocid1.instance...`。

截图里 `一般信息 -> OCID` 那个是实例本身的 ID，不能填进“映像 OCID”。它是身份证，不是安装包。

## 本次案例

这台机器的信息大概是：

```text
区域：ap-singapore-1
形状：VM.Standard.E2.1.Micro
系统：Canonical Ubuntu 24.04
内存：约 1GB
```

这类机器适合跑轻量服务，比如 SSH、Nginx、Caddy、sing-box、xray、hysteria2、Tailscale、WireGuard、小脚本、小 API。别指望它扛一整套重型服务，它只有 1GB 内存，不能硬装成数据中心。

## 官方镜像 OCID 怎么找

Oracle 官方有镜像 OCID 列表：

https://docs.oracle.com/en-us/iaas/images/

Ubuntu 24.04 的列表在这里：

https://docs.oracle.com/en-us/iaas/images/ubuntu-2404/index.htm

本次用到的镜像页面是：

https://docs.oracle.com/en-us/iaas/images/ubuntu-2404/canonical-ubuntu-24-04-2026-02-28-0.htm

新加坡 `ap-singapore-1` 对应的 Ubuntu 24.04 镜像 OCID 是：

```text
ocid1.image.oc1.ap-singapore-1.aaaaaaaau6s26vibk7dykvfupb5djtxp2736hhk4qhy6y35ncq4l5otfak4q
```

这个 OCID 的前缀是 `ocid1.image`，所以它才是镜像。

## 重装前检查清单

先确认三件事：

```text
1. 重要数据已经备份
2. 本地还有 SSH 私钥
3. 不准备点击 Terminate
```

如果你只上传过公钥，也没关系。OCI 当初保存的是公钥，登录时你本地用的是对应私钥。

常见对应关系：

```text
上传到 OCI：id_ed25519.pub
本地登录用：id_ed25519

上传到 OCI：id_rsa.pub
本地登录用：id_rsa
```

私钥通常在：

```bash
ls -la ~/.ssh
```

## 控制台操作步骤

进入 OCI 控制台：

```text
Compute -> Instances -> 点进你的实例
```

然后：

```text
More Actions -> Replace Boot Volume
```

表单里这样选：

```text
Preserve Boot Volume：开启
Replace by：Image
Apply image by：Input OCID
Image OCID：填 ocid1.image...
Boot volume size：50 GB
```

`Preserve Boot Volume` 一定要开。这样旧系统盘会保留下来，万一后悔，还有东西可救。

最后点：

```text
Replace
```

OCI 会停止实例、替换系统盘，然后把实例恢复到替换前的状态。这个过程不是删机重建。

## SSH 为什么不用重新上传

OCI 不是从旧系统盘里复制 SSH 公钥。

正确流程是：

```text
OCI 实例 metadata -> cloud-init -> 新系统 /home/ubuntu/.ssh/authorized_keys
```

当初创建实例时上传的公钥，会存在实例 metadata 里，名字通常是：

```text
ssh_authorized_keys
```

新 Ubuntu 第一次启动时，`cloud-init` 会读取它，然后写入新系统的：

```text
/home/ubuntu/.ssh/authorized_keys
```

所以只要你本地还拿着对应私钥，一般不需要重新上传。

如果你特别不放心，可以在替换引导卷页面展开：

```text
Advanced Options -> Metadata
```

手动加一项：

```text
Name: ssh_authorized_keys
Value: 你的公钥内容
```

注意，值必须是公钥，长这样：

```text
ssh-ed25519 AAAA... yourname
```

或者：

```text
ssh-rsa AAAA... yourname
```

不要填私钥。看到下面这种开头就停手：

```text
-----BEGIN OPENSSH PRIVATE KEY-----
```

## 重装后 SSH 报错怎么办

重装系统后，服务器的 SSH host key 会变。你第一次连接时很可能看到这个警告：

```text
WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!
Host key verification failed.
```

这不是你的私钥错了，是本地 `known_hosts` 还记着旧系统的指纹。

执行：

```bash
ssh-keygen -R <你的公网 IP>
```

比如：

```bash
ssh-keygen -R 161.118.233.14
```

然后重新连接：

```bash
ssh ubuntu@<你的公网 IP>
```

如果你需要指定私钥：

```bash
ssh -i ~/.ssh/你的私钥 ubuntu@<你的公网 IP>
```

第一次连接会问是否信任新的 fingerprint，确认 IP 是自己的机器后输入：

```text
yes
```

## 如果提示 Permission denied

优先排查这几个：

```text
1. 用户名是不是 ubuntu
2. 私钥是不是对应当初上传的公钥
3. 私钥权限是不是太开放
4. 安全列表/NSG 是否允许 22 端口
5. 系统是否还在启动 cloud-init
```

私钥权限修一下：

```bash
chmod 600 ~/.ssh/你的私钥
```

再连：

```bash
ssh -i ~/.ssh/你的私钥 ubuntu@<你的公网 IP>
```

## 1GB 内存机器重装后先加 swap

`VM.Standard.E2.1.Micro` 只有约 1GB 内存，跑轻量服务可以，但别硬扛。

建议重装后先加 2GB swap：

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

它不能让机器变强，但能让系统在内存紧张时少一点突然暴毙的机会。

## 免费流量别理解错

OCI Always Free 有 10TB/月出站流量额度，但一般按账号/租户共享理解，不是每台小机器独享 10TB。

```text
入站：免费
出站：Always Free 每月 10TB
```

做代理、网站访问、下载分发，主要算出站。

## 最后再强调一遍

免费机器重装系统的核心不是勇气，是别点错按钮。

正确路线：

```text
Replace Boot Volume
```

危险路线：

```text
Terminate Instance
```

前者是重装系统。

后者是开始抢机器。

如果只是想把系统恢复干净，同发行版重装，替换引导卷就是正路。填镜像 OCID 时看准 `ocid1.image...`，别把实例 OCID 拿去冒充安装镜像。
