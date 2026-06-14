const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "assets", "yuque");

const C = {
  bg: "#f8f1e3",
  bg2: "#f2ead9",
  ink: "#171412",
  muted: "#69645d",
  coral: "#df765d",
  coral2: "#f3b29f",
  sage: "#91bba5",
  sage2: "#cfe1d6",
  panel: "#fff8eb",
  panel2: "#f5eddd",
  gold: "#e9c46a",
  blue: "#8fb5d6",
};

const W = 1200;
const H = 720;
const FONT = "'LXGW WenKai','PingFang SC','Microsoft YaHei',Arial,sans-serif";

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function attrs(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => `${k}="${esc(v)}"`)
    .join(" ");
}

function text(x, y, value, options = {}) {
  const {
    size = 24,
    weight = 600,
    fill = C.ink,
    anchor = "start",
    opacity,
    family = FONT,
  } = options;
  return `<text ${attrs({
    x,
    y,
    "text-anchor": anchor,
    "font-family": family,
    "font-size": size,
    "font-weight": weight,
    fill,
    opacity,
  })}>${esc(value)}</text>`;
}

function multiline(x, y, lines, options = {}) {
  const { gap = 30, size = 22, weight = 500, fill = C.ink, anchor = "start" } = options;
  return lines
    .map((line, i) => text(x, y + i * gap, line, { size, weight, fill, anchor }))
    .join("\n");
}

function roughRect(x, y, w, h, options = {}) {
  const {
    fill = C.panel,
    stroke = C.ink,
    sw = 3,
    rx = 12,
    opacity = 1,
    dash,
    klass,
  } = options;
  const d1 = `M ${x + rx} ${y + 1} L ${x + w - rx - 2} ${y} Q ${x + w + 1} ${y} ${x + w} ${y + rx} L ${x + w - 1} ${y + h - rx} Q ${x + w} ${y + h + 1} ${x + w - rx} ${y + h} L ${x + rx + 1} ${y + h - 1} Q ${x - 1} ${y + h} ${x} ${y + h - rx} L ${x + 1} ${y + rx} Q ${x} ${y} ${x + rx} ${y + 1} Z`;
  const d2 = `M ${x + rx + 2} ${y + 3} L ${x + w - rx + 1} ${y + 2} Q ${x + w - 2} ${y + 1} ${x + w - 2} ${y + rx + 1} L ${x + w + 1} ${y + h - rx - 2} Q ${x + w - 1} ${y + h - 2} ${x + w - rx - 1} ${y + h - 1} L ${x + rx - 2} ${y + h + 1} Q ${x + 1} ${y + h - 2} ${x + 2} ${y + h - rx - 1} L ${x - 1} ${y + rx + 2} Q ${x + 1} ${y + 1} ${x + rx + 2} ${y + 3} Z`;
  return `<g${klass ? ` class="${klass}"` : ""} opacity="${opacity}">
    <path d="${d1}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>
    <path d="${d2}" fill="none" stroke="${stroke}" stroke-width="${Math.max(1.2, sw * 0.55)}" stroke-linejoin="round" opacity=".45"${dash ? ` stroke-dasharray="${dash}"` : ""}/>
  </g>`;
}

function windowPanel(x, y, w, h, title, options = {}) {
  const { fill = C.panel, bar = C.coral, titleFill = C.ink } = options;
  return `<g>
    ${roughRect(x, y, w, h, { fill, sw: 3, rx: 12 })}
    <path d="M ${x + 1} ${y + 42} L ${x + w - 1} ${y + 40}" stroke="${C.ink}" stroke-width="3"/>
    <path d="M ${x + 12} ${y + 2} L ${x + w - 12} ${y + 1} Q ${x + w} ${y + 1} ${x + w - 1} ${y + 15} L ${x + w - 1} ${y + 41} L ${x + 1} ${y + 42} L ${x + 1} ${y + 14} Q ${x + 1} ${y + 3} ${x + 12} ${y + 2} Z" fill="${bar}" opacity=".95" stroke="${C.ink}" stroke-width="2.5"/>
    <circle cx="${x + 22}" cy="${y + 22}" r="7" fill="${C.coral}" stroke="${C.ink}" stroke-width="2"/>
    <circle cx="${x + 46}" cy="${y + 22}" r="7" fill="${C.gold}" stroke="${C.ink}" stroke-width="2"/>
    <circle cx="${x + 70}" cy="${y + 22}" r="7" fill="${C.sage}" stroke="${C.ink}" stroke-width="2"/>
    ${text(x + w / 2, y + 28, title, { size: 20, weight: 800, anchor: "middle", fill: titleFill })}
  </g>`;
}

function card(x, y, w, h, title, subtitle, options = {}) {
  const { fill = C.panel, tag, tagFill = C.sage2, titleSize = 21 } = options;
  const tagSvg = tag
    ? `${roughRect(x + w - 64, y - 12, 58, 27, { fill: tagFill, sw: 2, rx: 7 })}
       ${text(x + w - 35, y + 8, tag, { size: 15, weight: 800, anchor: "middle" })}`
    : "";
  return `<g>
    ${roughRect(x, y, w, h, { fill, sw: 3, rx: 10 })}
    ${text(x + w / 2, y + 36, title, { size: titleSize, weight: 800, anchor: "middle" })}
    ${subtitle ? text(x + w / 2, y + 67, subtitle, { size: 17, weight: 600, anchor: "middle", fill: C.muted }) : ""}
    ${tagSvg}
  </g>`;
}

function pill(x, y, label, options = {}) {
  const { fill = C.panel, width = Math.max(72, label.length * 18 + 22), color = C.ink } = options;
  return `<g>
    ${roughRect(x, y, width, 34, { fill, sw: 2, rx: 17 })}
    ${text(x + width / 2, y + 23, label, { size: 17, weight: 800, anchor: "middle", fill: color })}
  </g>`;
}

function arrowPath(d, options = {}) {
  const { sw = 9, stroke = C.ink, marker = "arrow", opacity = 1, dash } = options;
  return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#${marker})" opacity="${opacity}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
}

function linePath(d, options = {}) {
  const { sw = 3, stroke = C.ink, opacity = 1, dash } = options;
  return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
}

function dot(x, y, fill = C.sage) {
  return `<circle cx="${x}" cy="${y}" r="6" fill="${fill}" stroke="${C.ink}" stroke-width="2"/>`;
}

function defs() {
  return `<defs>
    <radialGradient id="paper" cx="50%" cy="45%" r="72%">
      <stop offset="0%" stop-color="${C.bg}"/>
      <stop offset="100%" stop-color="${C.bg2}"/>
    </radialGradient>
    <marker id="arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="13" markerHeight="13" orient="auto">
      <path d="M 1 1 L 11 6 L 1 11 z" fill="${C.ink}" stroke="${C.ink}" stroke-width="1"/>
    </marker>
    <marker id="smallArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
      <path d="M 1 1 L 9 5 L 1 9 z" fill="${C.ink}"/>
    </marker>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#161412" flood-opacity=".10"/>
    </filter>
  </defs>`;
}

function shell(meta, content) {
  const { title, subtitle } = meta;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc">
  <title id="title">${esc(title)}</title>
  <desc id="desc">${esc(subtitle || title)}</desc>
  ${defs()}
  <rect width="${W}" height="${H}" fill="url(#paper)"/>
  <path d="M 40 654 C 250 690 510 674 694 698 C 856 718 1010 696 1160 666" fill="none" stroke="#e6ddca" stroke-width="4" opacity=".6"/>
  <path d="M 34 22 C 230 10 460 18 690 12 C 880 8 1030 12 1166 24" fill="none" stroke="#efe5d0" stroke-width="4" opacity=".42"/>
  ${text(600, 56, title, { size: 40, weight: 900, anchor: "middle", fill: meta.titleColor || C.ink })}
  ${subtitle ? text(600, 92, subtitle, { size: 22, weight: 700, anchor: "middle", fill: C.muted }) : ""}
  ${content}
</svg>
`;
}

function smallList(x, y, items, options = {}) {
  const { gap = 34, size = 19 } = options;
  return items.map((item, i) => `${text(x, y + i * gap, "•", { size: 25, weight: 900 })}${text(x + 24, y + i * gap, item, { size, weight: 650 })}`).join("\n");
}

function diagram01() {
  let c = "";
  c += text(216, 142, "重构前", { size: 35, weight: 900, anchor: "middle", fill: C.coral });
  c += text(216, 176, "角色在传接球", { size: 22, weight: 800, anchor: "middle", fill: C.muted });
  c += windowPanel(70, 205, 430, 350, "异步流水线", { bar: C.coral });
  [
    ["产品", "下个迭代", 110, 280, C.coral2],
    ["架构", "长期演进", 250, 330, C.panel],
    ["开发", "当前实现", 125, 420, C.panel],
    ["测试", "上个迭代", 288, 455, C.panel],
    ["运维", "线上运行", 170, 520, C.panel],
  ].forEach(([a, b, x, y, f]) => {
    c += card(x, y, 135, 70, a, b, { fill: f, titleSize: 19 });
  });
  c += arrowPath("M 235 315 C 310 280 350 316 384 355", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 360 385 C 260 378 230 420 255 466", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 224 455 C 178 484 180 505 218 526", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 248 532 C 360 534 410 490 377 433", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 504 380 C 585 330 618 318 692 318", { sw: 12 });
  c += pill(535, 342, "时间差", { fill: C.panel, width: 100 });
  c += text(928, 142, "重构后", { size: 35, weight: 900, anchor: "middle", fill: C.sage });
  c += text(928, 176, "同一张工程地图", { size: 22, weight: 800, anchor: "middle", fill: C.muted });
  c += windowPanel(710, 205, 420, 350, "完整上下文", { bar: C.sage });
  c += card(752, 278, 150, 78, "业务目标", "为什么做", { fill: C.sage2 });
  c += card(940, 278, 150, 78, "系统边界", "怎么支撑", { fill: C.sage2 });
  c += card(752, 420, 150, 78, "实现闭环", "如何落地", { fill: C.sage2 });
  c += card(940, 420, 150, 78, "质量运行", "如何证明", { fill: C.sage2 });
  c += linePath("M 902 316 C 926 316 916 316 940 316", { sw: 3 });
  c += linePath("M 828 356 C 828 388 828 390 828 420", { sw: 3 });
  c += linePath("M 1016 356 C 1016 388 1016 390 1016 420", { sw: 3 });
  c += linePath("M 902 460 C 926 460 916 460 940 460", { sw: 3 });
  c += text(920, 595, "产品 / 架构 / 开发 / 测试 / 运维", { size: 23, weight: 900, anchor: "middle" });
  c += text(920, 626, "不再只靠交接，而是围绕同一个模型推进", { size: 19, weight: 650, anchor: "middle", fill: C.muted });
  return shell({ title: "一、分工的本质是异步", subtitle: "产品想未来，开发做现在，测试验过去，运维守线上", titleColor: C.coral }, c);
}

function diagram02() {
  let c = "";
  c += text(235, 142, "信息损耗", { size: 34, weight: 900, anchor: "middle", fill: C.coral });
  c += windowPanel(68, 196, 410, 372, "文档与会议堆叠", { bar: C.coral });
  ["PRD", "概要设计", "接口文档", "测试用例", "上线检查", "复盘"].forEach((name, i) => {
    const x = 105 + (i % 2) * 175;
    const y = 258 + Math.floor(i / 2) * 84;
    c += card(x, y, 150, 58, name, "", { fill: i % 2 ? C.panel : C.coral2, titleSize: 19 });
  });
  const points = [
    [180, 286, 356, 284],
    [356, 286, 188, 370],
    [180, 370, 355, 454],
    [354, 370, 178, 454],
    [180, 455, 354, 286],
    [354, 455, 180, 286],
  ];
  points.forEach(([x1, y1, x2, y2], i) => c += linePath(`M ${x1} ${y1} C ${x1 + 80} ${y1 - 50 + i * 12} ${x2 - 70} ${y2 + 40 - i * 10} ${x2} ${y2}`, { sw: 3, opacity: .78 }));
  c += arrowPath("M 488 380 C 570 338 616 338 690 380", { sw: 12 });
  c += pill(533, 332, "上下文对齐", { fill: C.panel, width: 146 });
  c += text(928, 142, "共同语义", { size: 34, weight: 900, anchor: "middle", fill: C.sage });
  c += windowPanel(716, 196, 412, 372, "一张工程判断清单", { bar: C.sage });
  c += card(760, 270, 148, 64, "目标", "做什么", { fill: C.sage2 });
  c += card(945, 270, 148, 64, "边界", "不做什么", { fill: C.sage2 });
  c += card(760, 382, 148, 64, "风险", "哪里会错", { fill: C.sage2 });
  c += card(945, 382, 148, 64, "验证", "如何证明", { fill: C.sage2 });
  c += smallList(800, 505, ["需求评审：目标一致", "转测：范围明确", "上线：风险可控"], { gap: 28, size: 18 });
  return shell({ title: "二、流程和文档弥补上下文损耗", subtitle: "流程的价值，是让异步角色重新看见同一件事" }, c);
}

function diagram03() {
  let c = "";
  c += text(220, 148, "过去：多人转译", { size: 32, weight: 900, anchor: "middle", fill: C.coral });
  c += windowPanel(62, 206, 362, 340, "低层信息来回传", { bar: C.coral });
  [
    ["业务", 108, 284],
    ["产品", 260, 260],
    ["研发", 115, 400],
    ["测试", 275, 426],
  ].forEach(([name, x, y]) => c += card(x, y, 105, 58, name, "", { fill: C.panel, titleSize: 19 }));
  c += linePath("M 214 300 C 250 300 230 285 260 288", { sw: 3 });
  c += linePath("M 162 342 C 212 366 238 384 276 424", { sw: 3 });
  c += linePath("M 314 318 C 260 358 222 386 220 424", { sw: 3 });
  c += linePath("M 166 429 C 210 472 280 474 328 456", { sw: 3 });
  c += arrowPath("M 438 374 C 520 328 586 330 656 374", { sw: 12 });
  c += roughRect(496, 292, 100, 118, { fill: C.sage2, sw: 3, rx: 20 });
  c += text(546, 348, "AI", { size: 38, weight: 900, anchor: "middle" });
  c += text(546, 382, "转译器", { size: 19, weight: 800, anchor: "middle", fill: C.muted });
  c += text(928, 148, "现在：高层判断", { size: 32, weight: 900, anchor: "middle", fill: C.sage });
  c += windowPanel(698, 206, 430, 340, "压缩沟通链路", { bar: C.sage });
  c += card(748, 270, 150, 70, "目标", "业务价值", { fill: C.sage2 });
  c += card(930, 270, 150, 70, "约束", "边界条件", { fill: C.sage2 });
  c += card(748, 410, 150, 70, "方案", "实现路径", { fill: C.sage2 });
  c += card(930, 410, 150, 70, "风险", "验证清单", { fill: C.sage2 });
  c += linePath("M 898 306 L 930 306", { sw: 3 });
  c += linePath("M 824 340 L 824 410", { sw: 3 });
  c += linePath("M 1006 340 L 1006 410", { sw: 3 });
  c += linePath("M 898 446 L 930 446", { sw: 3 });
  c += text(914, 590, "低层材料交给 AI，关键取舍留给人", { size: 24, weight: 900, anchor: "middle" });
  return shell({ title: "三、AI 先压缩的是沟通链路", subtitle: "少传递样板信息，多讨论目标、约束、取舍和风险" }, c);
}

function diagram04() {
  let c = "";
  c += text(252, 146, "三种角色", { size: 32, weight: 900, anchor: "middle", fill: C.coral });
  c += card(90, 250, 150, 78, "产品", "做什么", { fill: C.coral2 });
  c += card(270, 330, 150, 78, "架构", "怎么支撑", { fill: C.panel });
  c += card(90, 440, 150, 78, "设计", "如何使用", { fill: C.panel });
  c += linePath("M 240 288 C 300 285 322 320 330 330", { sw: 4 });
  c += linePath("M 240 480 C 300 475 322 430 330 408", { sw: 4 });
  c += linePath("M 165 328 C 165 360 165 400 165 440", { sw: 4 });
  c += arrowPath("M 458 380 C 542 346 596 346 674 380", { sw: 12 });
  c += pill(520, 330, "同一模型", { fill: C.panel, width: 122 });
  c += text(916, 146, "同一种能力", { size: 32, weight: 900, anchor: "middle", fill: C.sage });
  c += windowPanel(702, 210, 420, 350, "业务 + 系统 + 体验", { bar: C.sage });
  c += roughRect(832, 282, 160, 160, { fill: C.sage2, sw: 4, rx: 22 });
  c += text(912, 350, "复合型", { size: 34, weight: 900, anchor: "middle" });
  c += text(912, 388, "产品工程师", { size: 25, weight: 900, anchor: "middle" });
  [
    ["业务目标", 742, 300],
    ["系统边界", 956, 300],
    ["状态流转", 742, 438],
    ["用户体验", 956, 438],
  ].forEach(([name, x, y]) => c += pill(x, y, name, { fill: C.panel, width: 116 }));
  c += linePath("M 858 318 L 832 338", { sw: 3 });
  c += linePath("M 956 318 L 990 338", { sw: 3 });
  c += linePath("M 858 456 L 832 414", { sw: 3 });
  c += linePath("M 956 456 L 990 414", { sw: 3 });
  c += text(912, 608, "不是少沟通，而是把上下文收敛到同一张图", { size: 23, weight: 900, anchor: "middle" });
  return shell({ title: "四、产品、架构、设计向同一种能力靠近", subtitle: "懂业务、懂系统、懂状态流转的人会变得更稀缺" }, c);
}

function diagram05() {
  let c = "";
  c += text(235, 148, "割裂联调", { size: 32, weight: 900, anchor: "middle", fill: C.coral });
  c += windowPanel(70, 210, 400, 330, "前后端两张图", { bar: C.coral });
  c += card(112, 286, 140, 72, "前端", "页面 / 状态", { fill: C.coral2 });
  c += card(292, 396, 140, 72, "后端", "接口 / 数据", { fill: C.panel });
  c += linePath("M 252 322 C 320 304 378 336 396 396", { sw: 3, dash: "9 8" });
  c += text(292, 370, "字段？错误码？权限？", { size: 19, weight: 800, anchor: "middle", fill: C.muted });
  c += arrowPath("M 486 378 C 562 338 604 338 680 378", { sw: 12 });
  c += pill(532, 330, "全栈闭环", { fill: C.panel, width: 122 });
  c += text(928, 148, "完整状态流", { size: 32, weight: 900, anchor: "middle", fill: C.sage });
  c += windowPanel(710, 210, 420, 330, "从点击到落库", { bar: C.sage });
  const steps = [
    ["UI", "用户操作", 758, 292],
    ["API", "接口契约", 926, 292],
    ["DB", "数据落库", 926, 414],
    ["OBS", "监控反馈", 758, 414],
  ];
  steps.forEach(([a, b, x, y]) => c += card(x, y, 126, 66, a, b, { fill: C.sage2, titleSize: 22 }));
  c += arrowPath("M 884 324 L 926 324", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 989 358 L 989 414", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 926 447 L 884 447", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 820 414 L 820 358", { sw: 4, marker: "smallArrow" });
  c += text(920, 594, "体验、性能、安全、可维护性放进同一个闭环", { size: 22, weight: 900, anchor: "middle" });
  return shell({ title: "五、前后端被全栈闭环重新组织", subtitle: "联调成本来自两张图，全栈能力来自一条状态流" }, c);
}

function diagram06() {
  let c = "";
  c += text(236, 146, "传统后置", { size: 32, weight: 900, anchor: "middle", fill: C.coral });
  c += windowPanel(70, 214, 400, 328, "上线后再找人", { bar: C.coral });
  c += card(112, 286, 145, 66, "开发", "写业务", { fill: C.panel });
  c += card(292, 286, 145, 66, "DBA", "看数据库", { fill: C.coral2 });
  c += card(112, 414, 145, 66, "运维", "守机器", { fill: C.coral2 });
  c += card(292, 414, 145, 66, "故障", "再应急", { fill: C.panel });
  c += linePath("M 258 319 L 292 319", { sw: 3 });
  c += linePath("M 184 352 L 184 414", { sw: 3 });
  c += linePath("M 258 447 L 292 447", { sw: 3 });
  c += arrowPath("M 486 378 C 560 334 610 334 684 378", { sw: 12 });
  c += pill(532, 330, "云化 + DevOps", { fill: C.panel, width: 158 });
  c += text(930, 146, "运行即工程", { size: 32, weight: 900, anchor: "middle", fill: C.sage });
  c += windowPanel(708, 214, 422, 328, "持续运行闭环", { bar: C.sage });
  [
    ["代码", 762, 278],
    ["CI/CD", 920, 278],
    ["云资源", 1002, 380],
    ["监控", 920, 478],
    ["恢复", 762, 478],
    ["数据库", 760, 380],
  ].forEach(([name, x, y]) => c += pill(x, y, name, { fill: C.sage2, width: 108 }));
  c += arrowPath("M 870 294 L 920 294", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 1004 313 C 1050 330 1064 356 1056 380", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 1002 494 L 920 494", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 870 494 L 818 494", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 816 478 L 816 414", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 816 380 L 816 312", { sw: 4, marker: "smallArrow" });
  c += text(920, 600, "容量 / 成本 / 可观测 / 回滚 / 恢复", { size: 23, weight: 900, anchor: "middle" });
  return shell({ title: "六、DBA、运维和研发在云化中融合", subtitle: "不只是会部署，而是让系统可运行、可观察、可恢复" }, c);
}

function diagram07() {
  let c = "";
  c += text(236, 146, "测试在最后", { size: 32, weight: 900, anchor: "middle", fill: C.coral });
  c += windowPanel(70, 214, 400, 328, "验收式测试", { bar: C.coral });
  c += card(118, 300, 120, 66, "开发完成", "", { fill: C.panel, titleSize: 18 });
  c += arrowPath("M 248 333 L 302 333", { sw: 4, marker: "smallArrow" });
  c += card(310, 300, 120, 66, "发现问题", "", { fill: C.coral2, titleSize: 18 });
  c += arrowPath("M 370 366 C 330 420 238 426 178 390", { sw: 4, marker: "smallArrow" });
  c += pill(156, 430, "返工", { fill: C.panel, width: 88, color: C.coral });
  c += arrowPath("M 486 378 C 560 334 610 334 684 378", { sw: 12 });
  c += pill(530, 330, "质量建模", { fill: C.panel, width: 126 });
  c += text(928, 146, "风险前置", { size: 32, weight: 900, anchor: "middle", fill: C.sage });
  c += windowPanel(708, 214, 422, 328, "证明系统是对的", { bar: C.sage });
  c += card(742, 284, 150, 62, "核心链路", "必须正确", { fill: C.sage2, titleSize: 19 });
  c += card(946, 284, 150, 62, "边界异常", "必须覆盖", { fill: C.sage2, titleSize: 19 });
  c += card(742, 404, 150, 62, "自动回归", "持续证明", { fill: C.sage2, titleSize: 19 });
  c += card(946, 404, 150, 62, "线上监控", "持续发现", { fill: C.sage2, titleSize: 19 });
  c += linePath("M 892 315 L 946 315", { sw: 3 });
  c += linePath("M 818 346 L 818 404", { sw: 3 });
  c += linePath("M 1022 346 L 1022 404", { sw: 3 });
  c += linePath("M 892 435 L 946 435", { sw: 3 });
  c += text(918, 594, "不是多点几下，而是建立风险模型", { size: 24, weight: 900, anchor: "middle" });
  return shell({ title: "七、测试从验收角色变成质量建模角色", subtitle: "质量不是最后发现 bug，而是提前定义正确性" }, c);
}

function diagram08() {
  let c = "";
  c += text(600, 142, "三类核心能力", { size: 34, weight: 900, anchor: "middle", fill: C.sage });
  const x1 = 156, y = 238;
  c += card(x1, y, 210, 130, "业务建模", "目标 / 对象 / 规则", { fill: C.sage2, titleSize: 27 });
  c += card(495, y, 210, 130, "系统实现", "接口 / 数据 / 代码", { fill: C.panel, titleSize: 27 });
  c += card(834, y, 210, 130, "验证闭环", "测试 / 监控 / 反馈", { fill: C.sage2, titleSize: 27 });
  c += arrowPath("M 366 302 C 420 280 446 280 495 302", { sw: 10 });
  c += arrowPath("M 705 302 C 760 280 784 280 834 302", { sw: 10 });
  c += arrowPath("M 940 370 C 850 585 360 585 255 370", { sw: 10 });
  c += pill(515, 530, "反馈重新进入建模", { fill: C.panel, width: 210 });
  c += windowPanel(232, 432, 200, 92, "业务问题", { bar: C.coral });
  c += windowPanel(500, 432, 200, 92, "工程方案", { bar: C.sage });
  c += windowPanel(768, 432, 200, 92, "运行证据", { bar: C.sage });
  c += text(332, 488, "为什么做", { size: 22, weight: 900, anchor: "middle" });
  c += text(600, 488, "怎么落地", { size: 22, weight: 900, anchor: "middle" });
  c += text(868, 488, "如何证明", { size: 22, weight: 900, anchor: "middle" });
  return shell({ title: "八、软件工程的新核心：建模、实现、验证", subtitle: "角色标签会变软，工程闭环会变硬" }, c);
}

function diagram09() {
  let c = "";
  c += text(224, 146, "以前：需要小团队", { size: 31, weight: 900, anchor: "middle", fill: C.coral });
  c += windowPanel(70, 214, 380, 328, "多人启动产品", { bar: C.coral });
  ["市场", "产品", "设计", "前端", "后端", "测试", "运维"].forEach((name, i) => {
    const x = 104 + (i % 3) * 105;
    const y = 280 + Math.floor(i / 3) * 78;
    c += pill(x, y, name, { fill: i % 2 ? C.panel : C.coral2, width: 86 });
  });
  c += arrowPath("M 486 378 C 560 334 610 334 684 378", { sw: 12 });
  c += pill(548, 330, "AI 扩大半径", { fill: C.panel, width: 146 });
  c += text(930, 146, "以后：OPC 闭环", { size: 31, weight: 900, anchor: "middle", fill: C.sage });
  c += windowPanel(700, 214, 430, 328, "一个人 + AI 工具组", { bar: C.sage });
  c += roughRect(870, 330, 110, 110, { fill: C.panel, sw: 4, rx: 30 });
  c += text(925, 382, "人", { size: 38, weight: 900, anchor: "middle" });
  c += text(925, 414, "+ AI", { size: 22, weight: 900, anchor: "middle", fill: C.muted });
  [
    ["机会", 772, 276],
    ["需求", 930, 262],
    ["设计", 1050, 326],
    ["开发", 1050, 466],
    ["验证", 930, 540],
    ["运营", 772, 496],
  ].forEach(([name, x, y]) => c += pill(x, y, name, { fill: C.sage2, width: 92 }));
  c += arrowPath("M 858 286 C 890 260 900 260 930 276", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 1008 280 C 1046 286 1060 306 1058 326", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 1094 360 L 1094 466", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 1050 504 C 1020 536 980 548 930 540", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 908 540 C 850 540 804 520 790 496", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 772 458 C 734 404 736 326 772 314", { sw: 4, marker: "smallArrow" });
  c += text(916, 604, "不是亲手做所有事，而是理解完整闭环", { size: 23, weight: 900, anchor: "middle" });
  return shell({ title: "九、OPC 能力会变得更现实", subtitle: "AI 降低启动门槛，软件工程判断力决定上限" }, c);
}

function diagram10() {
  let c = "";
  c += text(232, 146, "旧组织：角色墙", { size: 31, weight: 900, anchor: "middle", fill: C.coral });
  c += windowPanel(70, 214, 400, 328, "边界很硬", { bar: C.coral });
  ["产品", "前端", "后端", "测试", "DBA", "运维"].forEach((name, i) => {
    const x = 112 + (i % 2) * 160;
    const y = 282 + Math.floor(i / 2) * 76;
    c += card(x, y, 128, 56, name, "", { fill: i < 2 ? C.coral2 : C.panel, titleSize: 19 });
  });
  [252, 328, 404].forEach(y => c += linePath(`M 270 ${y} L 270 ${y + 52}`, { sw: 4, opacity: .5 }));
  c += arrowPath("M 486 378 C 560 334 610 334 684 378", { sw: 12 });
  c += pill(552, 330, "闭环变强", { fill: C.panel, width: 122 });
  c += text(932, 146, "新组织：能力网", { size: 31, weight: 900, anchor: "middle", fill: C.sage });
  c += windowPanel(706, 214, 424, 328, "上下文损耗更少", { bar: C.sage });
  c += card(832, 286, 172, 86, "复合型个人", "业务 + 技术 + 质量", { fill: C.sage2, titleSize: 22 });
  c += card(746, 420, 150, 72, "AI 工具", "执行放大器", { fill: C.panel, titleSize: 20 });
  c += card(940, 420, 150, 72, "小团队", "闭环协作", { fill: C.panel, titleSize: 20 });
  c += arrowPath("M 916 372 L 832 420", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 920 372 L 1016 420", { sw: 4, marker: "smallArrow" });
  c += text(920, 594, "不是角色最多，而是闭环最快形成", { size: 24, weight: 900, anchor: "middle" });
  return shell({ title: "十、组织和个人都会被重新定义", subtitle: "AI 会放大复合型人才，也会暴露上下文传递成本" }, c);
}

function diagram11() {
  let c = "";
  c += text(238, 146, "危险路径", { size: 32, weight: 900, anchor: "middle", fill: C.coral });
  c += windowPanel(70, 214, 400, 328, "AI 替你跳过过程", { bar: C.coral });
  c += card(112, 294, 140, 68, "直接问", "帮我实现", { fill: C.coral2 });
  c += arrowPath("M 252 328 L 306 328", { sw: 4, marker: "smallArrow" });
  c += card(314, 294, 120, 68, "复制", "能跑就行", { fill: C.panel });
  c += arrowPath("M 374 362 C 350 430 242 438 184 398", { sw: 4, marker: "smallArrow" });
  c += pill(144, 430, "判断力空心", { fill: C.panel, width: 138, color: C.coral });
  c += arrowPath("M 486 378 C 560 334 610 334 684 378", { sw: 12 });
  c += pill(532, 330, "刻意练习", { fill: C.panel, width: 122 });
  c += text(930, 146, "训练路径", { size: 32, weight: 900, anchor: "middle", fill: C.sage });
  c += windowPanel(704, 214, 426, 328, "用 AI 扩大判断力", { bar: C.sage });
  const steps = [
    ["1 自己建模", "对象 / 状态 / 异常"],
    ["2 AI 评审", "反问 / 找风险"],
    ["3 对比差异", "方案 / 取舍"],
    ["4 真实复盘", "延期 / 事故 / 返工"],
  ];
  steps.forEach(([a, b], i) => {
    const x = 748 + (i % 2) * 178;
    const y = 282 + Math.floor(i / 2) * 118;
    c += card(x, y, 150, 72, a, b, { fill: C.sage2, titleSize: 18 });
  });
  c += arrowPath("M 898 318 L 926 318", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 824 354 L 824 400", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 1002 354 L 1002 400", { sw: 4, marker: "smallArrow" });
  c += arrowPath("M 898 436 L 926 436", { sw: 4, marker: "smallArrow" });
  c += text(918, 594, "不是让 AI 替你思考，而是让思考暴露出来", { size: 22, weight: 900, anchor: "middle" });
  return shell({ title: "十一、新晋工程师如何培养复合能力", subtitle: "交付变快之后，更要刻意训练架构、评审和沟通" }, c);
}

const diagrams = [
  ["ai-se-01-async-roles.svg", diagram01],
  ["ai-se-02-context-loss.svg", diagram02],
  ["ai-se-03-ai-compresses-communication.svg", diagram03],
  ["ai-se-04-product-architecture-design.svg", diagram04],
  ["ai-se-05-fullstack-loop.svg", diagram05],
  ["ai-se-06-cloud-devops.svg", diagram06],
  ["ai-se-07-quality-modeling.svg", diagram07],
  ["ai-se-08-model-implement-verify.svg", diagram08],
  ["ai-se-09-opc-loop.svg", diagram09],
  ["ai-se-10-org-person-redefined.svg", diagram10],
  ["ai-se-11-new-engineer-growth.svg", diagram11],
];

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const [file, render] of diagrams) {
  const target = path.join(OUT_DIR, file);
  fs.writeFileSync(target, render(), "utf8");
  console.log(target);
}
