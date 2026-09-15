import { EnquirySection } from "@/components/enquiry-section";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionContent } from "@/components/section-content";
import { StoryContent } from "@/components/story-content";
import { QuoteForm } from "@/components/quote-form";
import { stories } from "@/lib/stories";
import {
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Factory,
  ShieldCheck,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SiteFooter } from "@/components/site-footer";
import { MainNavigation } from "@/components/main-navigation";
import { products } from "@/lib/content";
const pages: Record<
  string,
  { tag: string; title: string; lead: string; items: string[] }
> = {
  solutions: {
    tag: "解决方案",
    title: "不只是机器，而是一套完整的智能零售系统。",
    lead: "从硬件、软件到支付与运营支持，围绕您的业务模式完成配置。",
    items: ["智能运营管理", "支付与远程监控", "年龄验证方案", "全球部署支持"],
  },
  "oem-odm": {
    tag: "OEM 与 ODM",
    title: "把您的想法，转化为可量产的设备。",
    lead: "从需求分析、工业设计、样机测试到批量生产，BOHOL 提供完整开发路径。",
    items: ["需求定义", "结构与外观设计", "样机制造", "验证与量产"],
  },
  projects: {
    tag: "项目案例",
    title: "为真实市场和运营场景而设计。",
    lead: "根据商品、消费者、当地支付方式和维护条件设计自动零售项目。",
    items: ["美妆零售项目", "冷饮运营网络", "年龄验证零售", "易碎商品自动售卖"],
  },
  manufacturing: {
    tag: "制造能力",
    title: "把质量控制落实到每一个制造环节。",
    lead: "工程、钣金、装配、电气集成和出厂检测形成完整生产体系。",
    items: ["原材料检验", "钣金与加工", "整机装配", "功能与质量检测"],
  },
  insights: {
    tag: "行业洞察",
    title: "在生产之前，先做出更好的决策。",
    lead: "为运营商、经销商和品牌方提供自动零售设备选型与项目规划内容。",
    items: [
      "如何选择出货系统",
      "定制机器前的准备清单",
      "支付方案选择",
      "设备维护设计",
    ],
  },
  about: {
    tag: "关于 BOHOL",
    title: "面向全球智能零售市场的设备工程伙伴。",
    lead: "以工程能力、生产纪律和长期服务解决新型自动零售需求。",
    items: ["工程驱动", "面向出口市场", "长期技术支持", "可扩展生产能力"],
  },
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}): Promise<Metadata> {
  const { path = [] } = await params;
  const key = path[0] || "home";
  const p = pages[key];
  const story = path[1] ? stories[key]?.[path[1]] : undefined;
  const title = story?.title.zh || p?.tag || "智能自动售货机制造商";
  const canonical = `/zh${path.length ? `/${path.join("/")}` : ""}`;
  const english = path.length ? `/${path.join("/")}` : "/";
  return {
    title: `${title} | BOHOL`,
    description: story?.intro.zh || p?.lead || "BOHOL 为全球客户设计和制造智能自动售货机。",
    alternates: {
      canonical,
      languages: { en: english, "zh-CN": canonical, "x-default": english },
    },
    openGraph: { title, description: story?.intro.zh || p?.lead, locale: "zh_CN", alternateLocale: ["en_US"], images: [] },
    twitter: { title, description: story?.intro.zh || p?.lead, images: [] },
  };
}
function Header() {
  return (
    <>
    <header
      className="inner-header zh-header"
      style={{
        background: "#fff",
        color: "#071014",
        borderBottom: "1px solid #d9dede",
      }}
    >
      <Link className="brand" href="/zh">
        <span className="brand-mark">B</span>
        <span>
          BOHOL<small>智能售货技术</small>
        </span>
      </Link>
      <MainNavigation locale="zh" />
      <LanguageSwitcher />
      <Link className="quote" href="/zh/contact">
        获取报价 <ArrowUpRight size={15} />
      </Link>
    </header>
    <div className="header-spacer" aria-hidden="true" />
    </>
  );
}
function Footer() {
  return <SiteFooter locale="zh" />;
}
export default async function ChinesePage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path = [] } = await params;
  const key = path[0] || "home";
  const productSlug = path[0] === "vending-machines" ? path[1] : undefined;
  const product = products.find((p) => p.slug === productSlug);
  if (path.length > 2 || (path.length === 2 && !product && !stories[key]?.[path[1]])) notFound();
  if (path.length === 2 && stories[key]?.[path[1]]) return <><Header/><StoryContent kind={key} slug={path[1]} locale="zh"/><Footer/></>;
  if (product)
    return (
      <>
        <Header />
        <main className="product-detail zh">
          <div className="detail-image">
            <Image
              src={product.image}
              alt={product.name}
              width={800}
              height={1100}
              priority
            />
          </div>
          <div>
            <p className="section-tag">BOHOL 智能设备</p>
            <h1>
              {
                (
                  {
                    "vape-vending-machine": "电子烟自动售货机",
                    "cold-drink-vending-machine": "冷饮自动售货机",
                    "elevator-vending-machine": "履带升降自动售货机",
                    "eyelash-vending-machine": "睫毛自动售货机",
                    "card-vending-machine": "卡牌自动售货机",
                  } as Record<string, string>
                )[product.slug]
              }
            </h1>
            <p className="inner-lead">
              根据商品尺寸、目标市场、支付方式和品牌要求进行灵活配置。
            </p>
            <ul>
              {[
                "支持外观与结构定制",
                "支持多种支付方式",
                "远程库存与设备管理",
              ].map((x) => (
                <li key={x}>
                  <CheckCircle2 size={17} />
                  {x}
                </li>
              ))}
            </ul>
            <Link className="primary-button" href="#enquiry">
              索取产品资料 <ArrowUpRight />
            </Link>
          </div>
        </main>
        <EnquirySection locale="zh" productName={product.name} />
        <Footer />
      </>
    );
  if (key === "home")
    return (
      <>
        <Header />
        <main className="zh-home">
          <section className="zh-hero">
            <div>
              <p>智能售货 · 围绕您的业务打造</p>
              <h1>
                让零售
                <br />
                <em>不受限制。</em>
              </h1>
              <span>
                从产品概念到全球部署，BOHOL
                为品牌方、运营商和经销商设计专业智能售货设备。
              </span>
              <Link className="primary-button" href="/zh/vending-machines">
                查看设备 <ArrowUpRight />
              </Link>
            </div>
            <Image
              src="/images/hero/elevator-machine.webp"
              alt="BOHOL 智能自动售货机"
              width={700}
              height={1000}
              priority
            />
          </section>
          <section className="zh-products">
            <p className="section-tag">核心产品</p>
            <h2>
              针对不同商品场景
              <br />
              设计的四类设备。
            </h2>
            <div>
              {products.map((p) => (
                <Link href={`/zh/vending-machines/${p.slug}`} key={p.slug}>
                  <Image src={p.image} alt={p.name} width={380} height={540} />
                  <h3>
                    {
                      (
                        {
                          "vape-vending-machine": "电子烟自动售货机",
                          "cold-drink-vending-machine": "冷饮自动售货机",
                          "elevator-vending-machine": "履带升降自动售货机",
                          "eyelash-vending-machine": "睫毛自动售货机",
                          "card-vending-machine": "卡牌自动售货机",
                        } as Record<string, string>
                      )[p.slug]
                    }
                  </h3>
                  <span>查看详情 →</span>
                </Link>
              ))}
            </div>
          </section>
          <section className="zh-values">
            {[
              [Cpu, "智能控制", "远程监控、库存管理与可配置触屏交互。"],
              [
                ShieldCheck,
                "稳定可靠",
                "模块化设计和完整质量检测支持长期运营。",
              ],
              [Factory, "自主制造", "工程、加工、装配和检验形成完整生产链。"],
            ].map(([Icon, t, d]) => (
              <article key={String(t)}>
                <Icon />
                <h3>{String(t)}</h3>
                <p>{String(d)}</p>
              </article>
            ))}
          </section>
          <section className="final-cta">
            <p>准备启动新项目？</p>
            <h2>
              让我们一起打造
              <br />
              下一台设备。
            </h2>
            <Link href="/zh/contact">
              开始沟通 <ArrowUpRight />
            </Link>
          </section>
        </main>
        <Footer />
      </>
    );
  if (key === "vending-machines")
    return (
      <>
        <Header />
        <main className="inner-page zh">
          <p className="section-tag">自动售货机</p>
          <h1>
            为您的商品和市场
            <br />
            选择合适的设备。
          </h1>
          <div className="product-grid">
            {products.map((p) => (
              <Link href={`/zh/vending-machines/${p.slug}`} key={p.slug}>
                <div>
                  <Image src={p.image} alt={p.name} width={500} height={700} />
                </div>
                <h2>
                  {
                    (
                      {
                        "vape-vending-machine": "电子烟自动售货机",
                        "cold-drink-vending-machine": "冷饮自动售货机",
                        "elevator-vending-machine": "履带升降自动售货机",
                        "eyelash-vending-machine": "睫毛自动售货机",
                        "card-vending-machine": "卡牌自动售货机",
                      } as Record<string, string>
                    )[p.slug]
                  }
                </h2>
                <p>根据产品和运营要求灵活配置。</p>
              </Link>
            ))}
          </div>
        </main>
        <Footer />
      </>
    );
  if (key === "contact")
    return (
      <>
        <Header />
        <main className="inner-page zh">
          <p className="section-tag">联系我们</p>
          <h1>
            告诉我们您想
            <br />
            销售什么商品。
          </h1>
          <p className="inner-lead">
            请提供商品类型、目标国家、预计数量和定制功能。
          </p>
          <div className="quote-panel" style={{maxWidth:800,marginTop:40}}><QuoteForm locale="zh"/></div>
        </main>
        <Footer />
      </>
    );
  const p = pages[key];
  if (!p) notFound();
  return (
    <>
      <Header />
      <main className="inner-page zh">
        <p className="section-tag">{p.tag}</p>
        <h1>{p.title}</h1>
        <p className="inner-lead">{p.lead}</p>
        {key === "about" ? <div className="editorial" style={{padding:"40px 0"}}><h2>扎根广州番禺，服务全球市场。</h2><p>BOHOL 总部位于中国广东省广州市番禺区，拥有 8 年研发制造经验和 20,000 平方米生产设施，为全球品牌方与经销商提供自动售货机及 OEM/ODM 定制服务。</p><h2>制造与质量控制</h2><p>设备经过 72 小时老化测试和多点安全检查，结合 ISO 9001:2015 质量管理及相关 CE、RoHS 要求开展生产与验证。</p><h2>国际合作与定制能力</h2><p>服务 30 多个国家的合作伙伴，拥有 30 多项研发与设计专利。支持品牌外观、货道结构、软件界面本地化与电气配置定制。</p><Link className="primary-button" href="/zh/contact">联系我们</Link></div> : <SectionContent section={key} locale="zh"/>}
      </main>
      <Footer />
    </>
  );
}
