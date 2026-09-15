import { QuoteForm } from "./quote-form";
import styles from "./enquiry-section.module.css";
export function EnquirySection({ productName = "", locale = "en" }: { productName?: string; locale?: "en" | "zh" }) {
 const zh = locale === "zh";
 return <section id="enquiry" className={styles.section}><div className={styles.copy}><h2>{zh ? "让我们了解您的项目。" : "Tell us about your next project."}</h2><p>{productName || (zh ? "告诉我们您的商品、目标市场和定制需求。" : "Share your product, target market and customization requirements.")}</p><a href="mailto:sales@boholvending.com">sales@boholvending.com</a><p>{zh ? "您的信息仅用于回复询盘。" : "Your details are used to respond to your enquiry."}</p></div><div className={styles.panel}><QuoteForm locale={locale} productName={productName}/></div></section>;
}
