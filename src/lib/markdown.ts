import { marked } from 'marked';
import DOMPurify from 'dompurify';

/** CMS markdown -> sanitised HTML. */
export const mdToHtml = (md: string) => DOMPurify.sanitize(marked.parse(md || '', { async: false, gfm: true, breaks: false }) as string);
