import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity';
const matcher = new RegExpMatcher({ ...englishDataset.build(), ...englishRecommendedTransformers });
export function cleanTransmission(value: unknown, limit: number): string {
  if (typeof value !== 'string' || value.length > limit * 4) throw new Error('Keep your transmission short.');
  const text = value.normalize('NFKC').replace(/[\p{Cf}\p{M}]/gu, '').replace(/\s+/g, ' ').trim();
  if (text.length > limit) throw new Error('Keep your transmission short.');
  if (/[<>\x00-\x08\x0e-\x1f]/.test(text) || /https?:|www\.|[\w.-]+\.(com|net|org|io|co|xyz)\b/i.test(text)) throw new Error('Plain text only. Leave links and markup on Earth.');
  const joined = text.replace(/(?:\b[\p{L}\p{N}][\s._*-]+){2,}[\p{L}\p{N}]\b/gu, word => word.replace(/[\s._*-]+/g, ''));
  if (matcher.hasMatch(text) || matcher.hasMatch(joined)) throw new Error('Keep this frequency friendly. Please rephrase.');
  return text;
}
