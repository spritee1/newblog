import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题，留空则走i18n默认标题
	title: "",

	// 公告内容
	content: "欢迎来到 MYBLOG。这里记录折腾、作品和一些想清楚的事。",

	// 是否允许用户关闭公告
	closable: true,

	link: {
		// 启用链接
		enable: true,
		// 链接文本
		text: "关于本站",
		// 链接 URL
		url: "/about/",
		// 内部链接
		external: false,
	},
};
