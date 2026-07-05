# 宠物自嗨盲盒匹配 - 微信小程序项目

本项目是根据当前运行的 **TypeScript + React + Vite + Tailwind CSS** 网页版 App，完全重构并迁移而成的**原生微信小程序**项目。

您可以直接在本地使用**微信开发者工具**（WeChat Developer Tools）导入并打开该目录，进行预览、真机调试或发布。

---

## 📁 目录结构对照

| 原网页版模块 (React) | 小程序版模块 (WeChat Native) | 职责描述 |
| :--- | :--- | :--- |
| `src/App.tsx` (全局状态) | `app.js` & `app.json` | 全局生命周期、全局数据存取（宠物档案、心愿单、开盒历史、本地持久化） |
| `src/index.css` (Tailwind) | `app.wxss` | 全局基础样式、品牌色（Coral）与卡片布局变量定义 |
| `src/components/BlindBoxSection.tsx` | `pages/index/` (开盲盒首页) | 盲盒开箱动效、匹配度计算、智能卡片渲染与多维推荐理由生成 |
| `src/components/ToyList.tsx` | `pages/toys/` (玩具库) | 全量自嗨玩具列表，支持关键词搜索与分类标签筛选、快速加入心愿单 |
| `src/components/WishlistTab.tsx` | `pages/wishlist/` (心愿单) | 收藏玩具集合，支持为每款玩具**定制书写个人专属备注**并保存 |
| `src/components/MineTab.tsx` | `pages/mine/` (我的) | 管理多个萌宠档案（可新增、切换、删除），提供**盲盒开启历史记录（支持单条删除和清空全部）** |
| `src/components/ToyDetailModal` | `pages/toy-detail/` (指南详情页) | 展示具体玩具的深度游玩路线说明、官方游玩攻略与高危咀嚼安全提示 |

---

## 🚀 快速上手使用步骤

### 1. 导出项目
1. 在 Google AI Studio 界面右上角，打开菜单，选择 **Export to ZIP**（导出为 ZIP 压缩包）。
2. 在您的本地电脑上解压该压缩包。
3. 您会看到一个名为 `wechat-miniprogram` 的独立文件夹。这就是您小程序的完整根目录。

### 2. 导入微信开发者工具
1. 下载并安装最新版的 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2. 启动开发者工具，扫码登录您的微信开发者账号。
3. 点击 **+** (新增项目) 或 **导入项目**。
4. **项目目录**：选择解压出来的 `wechat-miniprogram` 文件夹。
5. **AppID**：如果您有小程序账号，填入您的 AppID；如果没有，可以选择 **测试号**（Tourist Mode）进行本地免账号开发调试。
6. 点击**确定**导入，即可在左侧模拟器中看到完全功能可运行的微信小程序！

---

## 🎨 TabBar 图标静态资源替换

为了保证小程序能直接在真机和开发者工具中跑通，我们在 `app.json` 中配置了底栏 TabBar 的图标路径。

由于打包体积原因，我们在 `wechat-miniprogram/assets/images/` 路径下保留了目录。请在本地开发时，把您所喜爱的 8 张 `png` 图标放置进去以获得最美观的效果：

- `assets/images/box.png` / `box_active.png` (开盲盒默认/选中)
- `assets/images/toys.png` / `toys_active.png` (玩具库默认/选中)
- `assets/images/heart.png` / `heart_active.png` (心愿单默认/选中)
- `assets/images/pet.png` / `pet_active.png` (我的档案默认/选中)

*(注：图标建议尺寸为 81px * 81px 左右，底色透明的 PNG 格式)*

---

## ✨ 完美迁移与功能亮点

1. **核心逻辑零缩水**：
   - 包含完整的开盒算法，当开启“根据宠物匹配”时，根据当前狗狗或猫咪的性格、年龄、运动消耗量计算出 **90%~99% 的专属匹配度**，并提供生动拟真的“智能推荐理由”；
   - 未开启匹配时，则作为“盲选随机推荐”，不显示匹配度，理由切换为“爆款通用推荐”，完全与网页版修复后的逻辑一致。
2. **完整的萌宠管理与删除安全策略**：
   - 在“我的”页面，支持随意添加、切换宠物档案；
   - 支持**安全删除档案**：只有当宠物档案大于1个时才允许删除。删除后，**自动顺延切换下一个宠物为 active 状态，并强制开启匹配状态**，确保永远有一只宠物处于“匹配中”的核心逻辑。
3. **强大的历史记录增删功能**：
   - 支持实时保存每一次的盲盒开启结果，并写入微信持久化缓存 `wx.setStorageSync`；
   - 支持**单条删除历史**和**清空全部历史记录**，并带有优雅的微信原生确认弹窗。
4. **定制备忘录**：
   - 心愿单内置文本编辑框。您可以随时随地保存或更新爱宠的心愿单备忘录（比如：作为可乐的四岁生日大礼等），自动持久化保存。

祝您的毛孩子开箱愉快！🐶🐱
