import styled from 'styled-components'

export const StyledCode = styled.div`
  font-family: Courier, Osaka-Mono, monospace;
  white-space: pre;
  & .hljs-comment, & .hljs-quote {
    color: #8e908c;
  }
  & .hljs-variable, & .hljs-template-variable,
  & .hljs-tag, & .hljs-name,
  & .hljs-selector-id, & .hljs-selector-class,
  & .hljs-regexp, & .hljs-deletion {
    color: #c82829;
  }
  & .hljs-number, & .hljs-built_in,
  & .hljs-builtin-name, & .hljs-literal,
  & .hljs-type, & .hljs-params,
  & .hljs-meta, & .hljs-link {
    color: #f5871f;
  }
  & .hljs-attribute {
    color: #eab700;
  }
  & .hljs-string, & .hljs-symbol,
  & .hljs-bullet, & .hljs-addition {
    color: #718c00;
  }
  & .hljs-title, & .hljs-section {
    color: #4271ae;
  }
  & .hljs-keyword, & .hljs-selector-tag {
    color: #8959a8;
  }
  & .hljs-emphasis {
    font-style: italic;
  }
  & .hljs-strong {
    font-weight: bold;
  }
`
