/**
 * 회사 정체성 단일 진실원천.
 * 6.1 실습: 헤르메스에게 이 파일을 여러분 회사로 바꿔 달라고 요청하는 것부터 시작합니다.
 * 색·글꼴은 이 파일이 아니라 DESIGN.md + src/styles/tokens.css 담당입니다 (6.7).
 */
export interface SiteConfig {
  company: { name: string; tagline: string; description: string };
  links: Record<string, string>;
  cta: { enabled: boolean; label: string; href: string };
}

export const siteConfig: SiteConfig = {
  company: {
    name: "MAGMA",
    tagline: "AI 팀이 만들고, 사람이 다듬는 콘텐츠",
    description:
      "MAGMA 콘텐츠 사업부는 AI 에이전트 팀과 함께 글을 만들고 발행하는 조직입니다. 과장하지 않고, 꾸준히 쌓는 것을 원칙으로 합니다.",
  },
  links: {
    github: "https://github.com/dandacompany",
  },
  cta: {
    // 6.6 「SNS 자동발행 + CTA」에서 구현·활성화하는 확장 슬롯
    enabled: false,
    label: "",
    href: "",
  },
};
